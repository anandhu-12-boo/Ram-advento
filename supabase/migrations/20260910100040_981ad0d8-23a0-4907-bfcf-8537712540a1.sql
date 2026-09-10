revoke all on function public.has_role(uuid, public.app_role) from public, anon;
revoke all on function public.ensure_profile(text, text) from public, anon;
revoke all on function public.create_booking(text, date, text, integer, text, text, text, text, text) from public, anon;
revoke all on function public.cancel_booking(text) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;
grant execute on function public.ensure_profile(text, text) to authenticated, service_role;
grant execute on function public.create_booking(text, date, text, integer, text, text, text, text, text) to authenticated, service_role;
grant execute on function public.cancel_booking(text) to authenticated, service_role;