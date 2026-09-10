import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { SupabaseClient } from "@supabase/supabase-js";

type Ctx = { supabase: SupabaseClient<any, any, any>; userId: string };

async function assertAdmin(context: Ctx) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Admin access denied.");
}

const statusSchema = z.enum(["pending", "confirmed", "completed", "cancelled", "rescheduled"]);
const paymentSchema = z.enum(["pending", "paid", "failed", "refunded"]);

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as Ctx);
    const supabase = context.supabase;
    const today = new Date().toISOString().slice(0, 10);

    const [{ data: bookings }, { count: customers }, { count: tourCount }] = await Promise.all([
      supabase
        .from("bookings")
        .select(
          "id,booking_id,customer_name,customer_email,booking_date,time_slot,guests,total_amount,payment_status,booking_status,created_at,tours(title,slug)",
        )
        .order("created_at", { ascending: false }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("tours").select("id", { count: "exact", head: true }),
    ]);

    const rows = bookings ?? [];
    const paid = rows.filter((b: any) => b.payment_status === "paid");
    const byStatus = (s: string) => rows.filter((b: any) => b.booking_status === s).length;

    const revenueSince = (days: number) => {
      const from = new Date(Date.now() - days * 86400000).toISOString();
      return paid
        .filter((b: any) => b.created_at >= from)
        .reduce((sum: number, b: any) => sum + (b.total_amount ?? 0), 0);
    };

    const tourCounts = new Map<string, number>();
    for (const b of rows) {
      const title = (b as any).tours?.title ?? "Unknown";
      tourCounts.set(title, (tourCounts.get(title) ?? 0) + 1);
    }

    const dailyMap = new Map<string, { date: string; bookings: number; revenue: number }>();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      dailyMap.set(d, { date: d, bookings: 0, revenue: 0 });
    }
    for (const b of rows) {
      const d = String((b as any).created_at).slice(0, 10);
      const entry = dailyMap.get(d);
      if (entry) {
        entry.bookings += 1;
        if ((b as any).payment_status === "paid") entry.revenue += (b as any).total_amount ?? 0;
      }
    }

    return {
      stats: {
        totalBookings: rows.length,
        todayBookings: rows.filter((b: any) => String(b.created_at).slice(0, 10) === today).length,
        pending: byStatus("pending"),
        confirmed: byStatus("confirmed"),
        completed: byStatus("completed"),
        cancelled: byStatus("cancelled"),
        rescheduled: byStatus("rescheduled"),
        totalCustomers: customers ?? 0,
        totalTours: tourCount ?? 0,
        totalRevenue: paid.reduce((s: number, b: any) => s + (b.total_amount ?? 0), 0),
        revenueToday: paid
          .filter((b: any) => String(b.created_at).slice(0, 10) === today)
          .reduce((s: number, b: any) => s + (b.total_amount ?? 0), 0),
        revenueWeek: revenueSince(7),
        revenueMonth: revenueSince(30),
      },
      recent: rows.slice(0, 8),
      todayTrips: rows.filter((b: any) => b.booking_date === today),
      upcoming: rows
        .filter((b: any) => b.booking_date >= today && b.booking_status !== "cancelled")
        .sort((a: any, b: any) => a.booking_date.localeCompare(b.booking_date))
        .slice(0, 8),
      popularTours: [...tourCounts.entries()]
        .map(([title, count]) => ({ title, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      daily: [...dailyMap.values()],
    };
  });

export const listAdminBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as Ctx);
    const { data, error } = await context.supabase
      .from("bookings")
      .select("*, tours(title,slug,location,duration)")
      .order("created_at", { ascending: false });
    if (error) throw new Error("Could not load bookings.");
    return data ?? [];
  });

export const getAdminBooking = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { bookingId: string }) =>
    z.object({ bookingId: z.string().min(3) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { data: row, error } = await context.supabase
      .from("bookings")
      .select("*, tours(title,slug,location,duration,vehicle,price)")
      .eq("booking_id", data.bookingId)
      .maybeSingle();
    if (error) throw new Error("Could not load this booking.");
    return row ?? null;
  });

export const updateBookingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: { bookingId: string; bookingStatus?: string; paymentStatus?: string }) =>
      z
        .object({
          bookingId: z.string().min(3),
          bookingStatus: statusSchema.optional(),
          paymentStatus: paymentSchema.optional(),
        })
        .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    if (data.bookingStatus === "cancelled") {
      const { error } = await context.supabase.rpc("cancel_booking", {
        p_booking_id: data.bookingId,
      });
      if (error) throw new Error("Could not cancel this booking.");
      if (!data.paymentStatus) return { ok: true };
    }
    const patch: { booking_status?: string; payment_status?: string } = {};
    if (data.bookingStatus && data.bookingStatus !== "cancelled")
      patch["booking_status"] = data.bookingStatus;
    if (data.paymentStatus) patch["payment_status"] = data.paymentStatus;
    if (Object.keys(patch).length === 0) return { ok: true };
    const { error } = await context.supabase
      .from("bookings")
      .update(patch)
      .eq("booking_id", data.bookingId);
    if (error) throw new Error("Could not update this booking.");
    return { ok: true };
  });

/* ---------------- tours ---------------- */

const tourInput = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes only."),
  tagline: z.string().default(""),
  description: z.string().default(""),
  category: z.string().default("Jeep Safari"),
  location: z.string().default("Munnar, Kerala"),
  duration: z.string().default(""),
  price: z.number().int().min(0),
  max_guests: z.number().int().min(1).max(20),
  vehicle: z.string().default(""),
  images: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  inclusions: z.array(z.string()).default([]),
  exclusions: z.array(z.string()).default([]),
  pickup_locations: z.array(z.string()).default([]),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export const listAdminTours = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as Ctx);
    const { data, error } = await context.supabase
      .from("tours")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw new Error("Could not load tours.");
    return data ?? [];
  });

export const saveTour = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => tourInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { id, ...fields } = data;
    const query = id
      ? context.supabase.from("tours").update(fields).eq("id", id)
      : context.supabase.from("tours").insert(fields);
    const { error } = await query;
    if (error) {
      throw new Error(
        error.message.includes("duplicate")
          ? "Another tour already uses that web address."
          : "Could not save this tour.",
      );
    }
    return { ok: true };
  });

export const deleteTour = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { error } = await context.supabase.from("tours").delete().eq("id", data.id);
    if (error) throw new Error("Could not delete this tour — it may have bookings attached.");
    return { ok: true };
  });

/* ---------------- availability ---------------- */

export const listAvailability = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as Ctx);
    const { data, error } = await context.supabase
      .from("availability")
      .select("*, tours(title,slug)")
      .order("date", { ascending: true });
    if (error) throw new Error("Could not load availability.");
    return data ?? [];
  });

export const saveAvailability = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      id?: string;
      tour_id: string;
      date: string;
      time_slot: string;
      total_slots: number;
      status: string;
    }) =>
      z
        .object({
          id: z.string().uuid().optional(),
          tour_id: z.string().uuid(),
          date: z.string().min(8),
          time_slot: z.string().min(3),
          total_slots: z.number().int().min(0).max(60),
          status: z.enum(["open", "closed"]),
        })
        .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { id, ...fields } = data;
    const { error } = id
      ? await context.supabase.from("availability").update(fields).eq("id", id)
      : await context.supabase.from("availability").insert(fields);
    if (error) {
      throw new Error(
        error.message.includes("duplicate")
          ? "That tour already has a slot at this date and time."
          : "Could not save this slot.",
      );
    }
    return { ok: true };
  });

export const deleteAvailability = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { error } = await context.supabase.from("availability").delete().eq("id", data.id);
    if (error) throw new Error("Could not delete this slot.");
    return { ok: true };
  });

/* ---------------- customers ---------------- */

export const listCustomers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as Ctx);
    const [{ data: profiles, error }, { data: bookings }] = await Promise.all([
      context.supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      context.supabase
        .from("bookings")
        .select("user_id,booking_status,payment_status,total_amount"),
    ]);
    if (error) throw new Error("Could not load customers.");
    const rows = bookings ?? [];
    return (profiles ?? []).map((p: any) => {
      const mine = rows.filter((b: any) => b.user_id === p.id);
      return {
        ...p,
        totalBookings: mine.length,
        completed: mine.filter((b: any) => b.booking_status === "completed").length,
        cancelled: mine.filter((b: any) => b.booking_status === "cancelled").length,
        totalSpent: mine
          .filter((b: any) => b.payment_status === "paid")
          .reduce((s: number, b: any) => s + (b.total_amount ?? 0), 0),
      };
    });
  });

export const setCustomerActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; isActive: boolean }) =>
    z.object({ id: z.string().uuid(), isActive: z.boolean() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { error } = await context.supabase
      .from("profiles")
      .update({ is_active: data.isActive })
      .eq("id", data.id);
    if (error) throw new Error("Could not update this account.");
    return { ok: true };
  });

export const getCustomerBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { data: rows } = await context.supabase
      .from("bookings")
      .select("*, tours(title)")
      .eq("user_id", data.id)
      .order("created_at", { ascending: false });
    return rows ?? [];
  });

/* ---------------- reviews & enquiries ---------------- */

export const listAdminReviews = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as Ctx);
    const { data, error } = await context.supabase
      .from("reviews")
      .select("*, tours(title)")
      .order("created_at", { ascending: false });
    if (error) throw new Error("Could not load reviews.");
    return data ?? [];
  });

export const setReviewApproved = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; approved: boolean }) =>
    z.object({ id: z.string().uuid(), approved: z.boolean() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { error } = await context.supabase
      .from("reviews")
      .update({ approved: data.approved })
      .eq("id", data.id);
    if (error) throw new Error("Could not update this review.");
    return { ok: true };
  });

export const deleteReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { error } = await context.supabase.from("reviews").delete().eq("id", data.id);
    if (error) throw new Error("Could not delete this review.");
    return { ok: true };
  });

export const listEnquiries = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as Ctx);
    const { data, error } = await context.supabase
      .from("contact_enquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error("Could not load enquiries.");
    return data ?? [];
  });

export const setEnquiryStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status: string }) =>
    z
      .object({ id: z.string().uuid(), status: z.enum(["new", "contacted", "resolved"]) })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { error } = await context.supabase
      .from("contact_enquiries")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error("Could not update this enquiry.");
    return { ok: true };
  });
