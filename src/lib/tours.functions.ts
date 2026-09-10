import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createPublicServerClient } from "@/lib/supabase-public";

export type TourRecord = {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  location: string;
  duration: string;
  price: number;
  max_guests: number;
  vehicle: string;
  images: string[];
  highlights: string[];
  itinerary: { time: string; title: string; detail: string }[];
  inclusions: string[];
  exclusions: string[];
  pickup_locations: string[];
  rating: number;
  review_count: number;
  available: boolean;
  featured: boolean;
};

const TOUR_COLUMNS =
  "id,title,slug,tagline,description,category,location,duration,price,max_guests,vehicle,images,highlights,itinerary,inclusions,exclusions,pickup_locations,rating,review_count,available,featured";

export const listTours = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createPublicServerClient();
  const { data, error } = await supabase
    .from("tours")
    .select(TOUR_COLUMNS)
    .eq("available", true)
    .order("price", { ascending: true });
  if (error) throw new Error("Could not load tours right now.");
  return (data ?? []) as unknown as TourRecord[];
});

export const getTour = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const supabase = createPublicServerClient();
    const { data: tour, error } = await supabase
      .from("tours")
      .select(TOUR_COLUMNS)
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error("Could not load this tour right now.");
    return (tour ?? null) as unknown as TourRecord | null;
  });

export const getSlotAvailability = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string; date: string }) =>
    z.object({ slug: z.string().min(1), date: z.string().min(4) }).parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = createPublicServerClient();
    const { data: tour } = await supabase
      .from("tours")
      .select("id,max_guests")
      .eq("slug", data.slug)
      .maybeSingle();
    if (!tour) return [];
    const { data: rows } = await supabase
      .from("availability")
      .select("time_slot,total_slots,booked_slots,available_slots,status")
      .eq("tour_id", tour.id)
      .eq("date", data.date);
    return (rows ?? []).map((r) => ({
      time_slot: r.time_slot,
      total_slots: r.total_slots,
      booked_slots: r.booked_slots,
      available_slots: r.available_slots ?? r.total_slots - r.booked_slots,
      status: r.status,
    }));
  });

export const listApprovedReviews = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createPublicServerClient();
  const { data } = await supabase
    .from("reviews")
    .select("id,author_name,rating,comment,created_at,tour_id")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(20);
  return data ?? [];
});

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: { name: string; email: string; phone: string; message: string }) =>
    z
      .object({
        name: z.string().min(2).max(120),
        email: z.string().email(),
        phone: z.string().max(30).default(""),
        message: z.string().min(5).max(2000),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = createPublicServerClient();
    const { error } = await supabase.from("contact_enquiries").insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
    });
    if (error) throw new Error("We could not send your message. Please try again or call us.");
    return { ok: true };
  });
