import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const bookingErrors: Record<string, string> = {
  AUTH_REQUIRED: "Please sign in to book.",
  INVALID_GUESTS: "Choose at least one guest.",
  INVALID_DATE: "Pick a date from today onwards.",
  TOUR_NOT_FOUND: "That adventure is not available right now.",
  GUEST_LIMIT: "That is more guests than this jeep allows — contact us for a convoy.",
  SLOT_CLOSED: "That time slot is closed. Please pick another.",
  SLOT_FULL: "That time slot is fully booked. Please pick another.",
  BOOKING_NOT_FOUND: "Booking not found.",
};

function friendly(message: string) {
  for (const key of Object.keys(bookingErrors)) {
    if (message.includes(key)) return bookingErrors[key]!;
  }
  return "Something went wrong. Please try again.";
}

export const getMyAccount = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: profile } = await supabase.rpc("ensure_profile", {});
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    return {
      profile: (Array.isArray(profile) ? profile[0] : profile) ?? null,
      roles: (roles ?? []).map((r) => r.role as string),
      isAdmin: (roles ?? []).some((r) => r.role === "admin"),
    };
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { name: string; phone: string }) =>
    z.object({ name: z.string().min(2).max(120), phone: z.string().max(30) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update({ name: data.name, phone: data.phone })
      .eq("id", context.userId);
    if (error) throw new Error("Could not save your details.");
    return { ok: true };
  });

export const listMyBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("bookings")
      .select("*, tours(title,slug,location,duration,images,vehicle)")
      .order("created_at", { ascending: false });
    if (error) throw new Error("Could not load your bookings.");
    return data ?? [];
  });

export const getMyBooking = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { bookingId: string }) =>
    z.object({ bookingId: z.string().min(3) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("bookings")
      .select("*, tours(title,slug,location,duration,images,vehicle,price)")
      .eq("booking_id", data.bookingId)
      .maybeSingle();
    if (error) throw new Error("Could not load this booking.");
    return row ?? null;
  });

export const createMyBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      slug: string;
      date: string;
      time: string;
      guests: number;
      vehicle: string;
      pickup: string;
      special?: string;
      name?: string;
      phone?: string;
    }) =>
      z
        .object({
          slug: z.string().min(1),
          date: z.string().min(8),
          time: z.string().min(3),
          guests: z.number().int().min(1).max(12),
          vehicle: z.string().max(80),
          pickup: z.string().max(120),
          special: z.string().max(1000).optional(),
          name: z.string().max(120).optional(),
          phone: z.string().max(30).optional(),
        })
        .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: booking, error } = await context.supabase.rpc("create_booking", {
      p_tour_slug: data.slug,
      p_date: data.date,
      p_time: data.time,
      p_guests: data.guests,
      p_vehicle: data.vehicle,
      p_pickup: data.pickup,
      p_special: data.special ?? "",
      p_name: data.name ?? "",
      p_phone: data.phone ?? "",
    });
    if (error) throw new Error(friendly(error.message));
    const row = Array.isArray(booking) ? booking[0] : booking;
    return row as { booking_id: string; total_amount: number } | null;
  });

export const cancelMyBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { bookingId: string }) =>
    z.object({ bookingId: z.string().min(3) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.rpc("cancel_booking", {
      p_booking_id: data.bookingId,
    });
    if (error) throw new Error(friendly(error.message));
    return { ok: true };
  });
