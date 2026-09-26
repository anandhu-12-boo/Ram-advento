import { Router, Request, Response } from "express";
import { z } from "zod";
import { publicSupabaseClient } from "../db/supabase.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { requireAuth, requireAdmin, AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

// GET /api/availability?slug=...&date=...
router.get("/", async (req: Request, res: Response) => {
  try {
    const slug = req.query.slug as string;
    const date = req.query.date as string;

    if (!slug || !date) {
      return sendError(res, "Query parameters 'slug' and 'date' are required.", 400);
    }

    const { data: tour, error: tourError } = await publicSupabaseClient
      .from("tours")
      .select("id,max_guests")
      .eq("slug", slug)
      .maybeSingle();

    if (tourError || !tour) {
      return sendSuccess(res, []);
    }

    const { data: rows, error: availError } = await publicSupabaseClient
      .from("availability")
      .select("time_slot,total_slots,booked_slots,available_slots,status")
      .eq("tour_id", tour.id)
      .eq("date", date);

    if (availError) {
      return sendError(res, "Failed to load slot availability.", 500);
    }

    const result = (rows ?? []).map((r) => ({
      time_slot: r.time_slot,
      total_slots: r.total_slots,
      booked_slots: r.booked_slots,
      available_slots: r.available_slots ?? (r.total_slots - r.booked_slots),
      status: r.status,
    }));

    return sendSuccess(res, result);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

const availabilitySchema = z.object({
  tour_id: z.string().uuid(),
  date: z.string().min(8),
  time_slot: z.string().min(2),
  total_slots: z.number().int().default(6),
  status: z.enum(["open", "closed"]).default("open"),
});

// POST /api/availability - Admin manually configures availability slot
router.post("/", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = availabilitySchema.parse(req.body);
    const { data, error } = await req.supabase!
      .from("availability")
      .upsert(parsed, { onConflict: "tour_id,date,time_slot" })
      .select()
      .single();

    if (error) {
      return sendError(res, "Failed to update availability: " + error.message, 400);
    }
    return sendSuccess(res, data, "Availability updated");
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return sendError(res, err.errors.map(e => e.message).join(", "), 400);
    }
    return sendError(res, err.message, 500);
  }
});

export default router;
