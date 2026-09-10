-- ROLES ---------------------------------------------------------------
create type public.app_role as enum ('customer','admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "read own roles" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

-- shared updated_at ---------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;

-- PROFILES ------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  phone text not null default '',
  avatar text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles select" on public.profiles for select to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "profiles insert own" on public.profiles for insert to authenticated
  with check (id = auth.uid());
create policy "profiles update" on public.profiles for update to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(),'admin'));
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

create or replace function public.ensure_profile(p_name text default null, p_phone text default null)
returns public.profiles language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  mail text := coalesce(auth.jwt() ->> 'email','');
  row public.profiles;
begin
  if uid is null then raise exception 'Not authenticated'; end if;
  insert into public.profiles (id, name, email, phone)
  values (uid, coalesce(nullif(p_name,''), split_part(mail,'@',1)), mail, coalesce(p_phone,''))
  on conflict (id) do update set
    email = excluded.email,
    name = case when coalesce(nullif(p_name,''),'') <> '' then p_name else public.profiles.name end,
    phone = case when coalesce(nullif(p_phone,''),'') <> '' then p_phone else public.profiles.phone end
  returning * into row;

  insert into public.user_roles (user_id, role) values (uid,'customer') on conflict do nothing;
  if lower(mail) = 'ramadventure143@gmail.com' then
    insert into public.user_roles (user_id, role) values (uid,'admin') on conflict do nothing;
  end if;
  return row;
end $$;

-- TOURS ---------------------------------------------------------------
create table public.tours (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  tagline text not null default '',
  description text not null default '',
  category text not null default 'Jeep Safari',
  location text not null default 'Munnar, Kerala',
  duration text not null default '',
  price integer not null default 0,
  max_guests integer not null default 6,
  vehicle text not null default '',
  images text[] not null default '{}',
  highlights text[] not null default '{}',
  itinerary jsonb not null default '[]'::jsonb,
  inclusions text[] not null default '{}',
  exclusions text[] not null default '{}',
  pickup_locations text[] not null default '{}',
  rating numeric(2,1) not null default 4.9,
  review_count integer not null default 0,
  available boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.tours to anon, authenticated;
grant insert, update, delete on public.tours to authenticated;
grant all on public.tours to service_role;
alter table public.tours enable row level security;
create policy "tours public read" on public.tours for select to anon, authenticated using (available or public.has_role(auth.uid(),'admin'));
create policy "tours admin write" on public.tours for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger tours_touch before update on public.tours
  for each row execute function public.touch_updated_at();

-- AVAILABILITY --------------------------------------------------------
create table public.availability (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours(id) on delete cascade,
  date date not null,
  time_slot text not null,
  total_slots integer not null default 6,
  booked_slots integer not null default 0,
  available_slots integer generated always as (total_slots - booked_slots) stored,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tour_id, date, time_slot)
);
grant select on public.availability to anon, authenticated;
grant insert, update, delete on public.availability to authenticated;
grant all on public.availability to service_role;
alter table public.availability enable row level security;
create policy "availability public read" on public.availability for select to anon, authenticated using (true);
create policy "availability admin write" on public.availability for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger availability_touch before update on public.availability
  for each row execute function public.touch_updated_at();

-- BOOKINGS ------------------------------------------------------------
create sequence public.booking_ref_seq;

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_id text not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  tour_id uuid not null references public.tours(id),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  booking_date date not null,
  time_slot text not null,
  guests integer not null,
  vehicle text not null default '',
  pickup_location text not null default '',
  special_request text not null default '',
  total_amount integer not null default 0,
  payment_status text not null default 'pending',
  booking_status text not null default 'pending',
  payment_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_status_chk check (booking_status in ('pending','confirmed','completed','cancelled','rescheduled')),
  constraint bookings_payment_chk check (payment_status in ('pending','paid','failed','refunded'))
);
grant select, update on public.bookings to authenticated;
grant all on public.bookings to service_role;
alter table public.bookings enable row level security;
create policy "bookings select" on public.bookings for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "bookings update" on public.bookings for update to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'))
  with check (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create trigger bookings_touch before update on public.bookings
  for each row execute function public.touch_updated_at();

create or replace function public.create_booking(
  p_tour_slug text,
  p_date date,
  p_time text,
  p_guests integer,
  p_vehicle text,
  p_pickup text,
  p_special text default '',
  p_name text default '',
  p_phone text default ''
) returns public.bookings language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  mail text := coalesce(auth.jwt() ->> 'email','');
  t public.tours;
  av public.availability;
  amount integer;
  ref text;
  existing public.bookings;
  b public.bookings;
begin
  if uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_guests is null or p_guests < 1 then raise exception 'INVALID_GUESTS'; end if;
  if p_date is null or p_date < current_date then raise exception 'INVALID_DATE'; end if;

  select * into t from public.tours where slug = p_tour_slug and available;
  if not found then raise exception 'TOUR_NOT_FOUND'; end if;
  if p_guests > t.max_guests then raise exception 'GUEST_LIMIT'; end if;

  select * into existing from public.bookings
   where user_id = uid and tour_id = t.id and booking_date = p_date and time_slot = p_time
     and created_at > now() - interval '2 minutes' limit 1;
  if found then return existing; end if;

  select * into av from public.availability
   where tour_id = t.id and date = p_date and time_slot = p_time for update;

  if found then
    if av.status <> 'open' then raise exception 'SLOT_CLOSED'; end if;
    if av.booked_slots + p_guests > av.total_slots then raise exception 'SLOT_FULL'; end if;
    update public.availability set booked_slots = booked_slots + p_guests where id = av.id;
  else
    if p_guests > t.max_guests then raise exception 'SLOT_FULL'; end if;
    insert into public.availability (tour_id, date, time_slot, total_slots, booked_slots)
    values (t.id, p_date, p_time, t.max_guests, p_guests);
  end if;

  amount := case when t.price = 0 then 0 else t.price + greatest(0, p_guests - 4) * 400 end;
  ref := 'RAM-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.booking_ref_seq')::text, 5, '0');

  insert into public.bookings (
    booking_id, user_id, tour_id, customer_name, customer_email, customer_phone,
    booking_date, time_slot, guests, vehicle, pickup_location, special_request, total_amount
  ) values (
    ref, uid, t.id,
    coalesce(nullif(p_name,''), (select name from public.profiles where id = uid), split_part(mail,'@',1)),
    mail,
    coalesce(nullif(p_phone,''), (select phone from public.profiles where id = uid), ''),
    p_date, p_time, p_guests, p_vehicle, p_pickup, coalesce(p_special,''), amount
  ) returning * into b;

  return b;
end $$;

create or replace function public.cancel_booking(p_booking_id text)
returns public.bookings language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); b public.bookings;
begin
  if uid is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into b from public.bookings where booking_id = p_booking_id
    and (user_id = uid or public.has_role(uid,'admin')) for update;
  if not found then raise exception 'BOOKING_NOT_FOUND'; end if;
  if b.booking_status = 'cancelled' then return b; end if;
  update public.availability set booked_slots = greatest(0, booked_slots - b.guests)
    where tour_id = b.tour_id and date = b.booking_date and time_slot = b.time_slot;
  update public.bookings set booking_status = 'cancelled' where id = b.id returning * into b;
  return b;
end $$;

-- REVIEWS -------------------------------------------------------------
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete set null,
  tour_id uuid references public.tours(id) on delete cascade,
  author_name text not null default '',
  rating integer not null default 5,
  comment text not null default '',
  approved boolean not null default false,
  created_at timestamptz not null default now()
);
grant select on public.reviews to anon, authenticated;
grant insert, update, delete on public.reviews to authenticated;
grant all on public.reviews to service_role;
alter table public.reviews enable row level security;
create policy "reviews public read" on public.reviews for select to anon, authenticated
  using (approved or user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "reviews insert own" on public.reviews for insert to authenticated
  with check (user_id = auth.uid());
create policy "reviews admin write" on public.reviews for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- CONTACT ENQUIRIES ---------------------------------------------------
create table public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null default '',
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant insert on public.contact_enquiries to anon, authenticated;
grant select, update, delete on public.contact_enquiries to authenticated;
grant all on public.contact_enquiries to service_role;
alter table public.contact_enquiries enable row level security;
create policy "enquiries insert" on public.contact_enquiries for insert to anon, authenticated with check (true);
create policy "enquiries admin read" on public.contact_enquiries for select to authenticated
  using (public.has_role(auth.uid(),'admin'));
create policy "enquiries admin write" on public.contact_enquiries for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger enquiries_touch before update on public.contact_enquiries
  for each row execute function public.touch_updated_at();

-- SEED TOURS ----------------------------------------------------------
insert into public.tours (title, slug, tagline, description, category, location, duration, price, max_guests, vehicle, images, highlights, itinerary, inclusions, exclusions, pickup_locations, rating, review_count, available, featured) values
('Munnar Jeep Safari','munnar-jeep-safari','The classic off-road introduction to the high range','A half-day off-road run through tea estates, forest trails and viewpoints that regular cars never reach. Driven by local drivers who grew up on these trails.','Jeep Safari','Munnar, Kerala','4 Hours',2500,6,'Mahindra Thar 4x4',
 array['gaproad','mattupetty','heroPoster','forestPoster'],
 array['Off-road tea estate trails','Mist valley viewpoints','Local driver-guide with stories of the range','Tea factory stop'],
 '[{"time":"06:30","title":"Pickup","detail":"Hotel pickup anywhere in Munnar town."},{"time":"07:15","title":"Estate trails","detail":"Off-road climb through working tea estates."},{"time":"08:30","title":"Viewpoint break","detail":"Chai on a ridge above the mist line."},{"time":"10:30","title":"Drop off","detail":"Return to your stay."}]'::jsonb,
 array['4x4 jeep with driver','Fuel and permits','Bottled water','Photo stops'],
 array['Meals','Entry tickets','Personal expenses'],
 array['Munnar Town','Chithirapuram','Devikulam','Chinnakanal','Anachal','Other (we will call you)'],4.9,412,true,true),
('Kolukkumalai Adventure','kolukkumalai-adventure','Sunrise above the clouds at 7,900 ft','A pre-dawn climb up one of India''s roughest jeep tracks to the highest tea plantation in the world, timed for sunrise over a sea of clouds.','Jeep Safari','Kolukkumalai, Idukki','8 Hours',4500,6,'Mahindra Thar 4x4',
 array['kolukkumalai','topstation','heroPoster','vattavada'],
 array['Sunrise above the cloud line','World''s highest tea estate','Colonial-era tea factory visit','Sunrise point trek assistance'],
 '[{"time":"03:30","title":"Pickup","detail":"Early start from your Munnar stay."},{"time":"05:00","title":"Off-road ascent","detail":"The famous rocky climb to Kolukkumalai."},{"time":"06:15","title":"Sunrise","detail":"Watch the range emerge from the clouds."},{"time":"08:00","title":"Tea factory","detail":"Hand-rolled tea processing tour."},{"time":"11:30","title":"Drop off","detail":"Back in Munnar by late morning."}]'::jsonb,
 array['4x4 jeep with driver','Sunrise point guidance','Fuel and permits','Bottled water'],
 array['Tea factory entry','Breakfast','Personal expenses'],
 array['Munnar Town','Chithirapuram','Devikulam','Chinnakanal','Anachal','Other (we will call you)'],5.0,288,true,true),
('Munnar Full Day Tour','munnar-full-day-tour','Every viewpoint that matters, in one day','A complete sightseeing day covering Mattupetty, Echo Point, Kundala, tea museums and forest viewpoints, with off-road detours between the crowds.','Sightseeing','Munnar, Kerala','8 Hours',3500,7,'Mahindra Bolero / Thar',
 array['mattupetty','echopoint','valley','topstation'],
 array['Mattupetty dam and Echo Point','Kundala arch dam','Tea plantation walk','Off-road sunset viewpoint'],
 '[{"time":"08:30","title":"Pickup","detail":"Relaxed morning start."},{"time":"09:30","title":"Mattupetty & Echo Point","detail":"Lake, dam and viewpoints."},{"time":"12:30","title":"Lunch break","detail":"Local Kerala meal stop."},{"time":"14:00","title":"Kundala & Top Station","detail":"High range panoramas."},{"time":"17:00","title":"Drop off","detail":"Return by evening."}]'::jsonb,
 array['Vehicle with driver','Fuel and parking','All viewpoint stops','Bottled water'],
 array['Entry tickets','Meals','Boating charges'],
 array['Munnar Town','Chithirapuram','Devikulam','Chinnakanal','Anachal','Other (we will call you)'],4.8,531,true,true),
('Custom Adventure','custom-adventure','Built around your days, your pace, your people','Multi-day routes, honeymoon itineraries, photography trips, group convoys — tell us what you want to see and we build the trail around it.','Custom','Munnar & Idukki high range','Flexible',0,12,'Your choice of 4x4',
 array['jeep','kolukkumalai','anayirankal','forestPoster'],
 array['Any combination of routes','Multi-jeep convoys for groups','Camping and homestay coordination','Photography timing planned around light'],
 '[{"time":"Step 1","title":"Tell us your dates","detail":"Share your stay, dates and interests."},{"time":"Step 2","title":"We plan the route","detail":"A local driver-planner maps the trails."},{"time":"Step 3","title":"Confirm","detail":"Pay a small advance and your jeeps are held."}]'::jsonb,
 array['Route planning','Jeeps and drivers','Permits','24/7 support line'],
 array['Stays and meals','Entry tickets'],
 array['Munnar Town','Chithirapuram','Devikulam','Chinnakanal','Anachal','Other (we will call you)'],4.9,96,true,false);