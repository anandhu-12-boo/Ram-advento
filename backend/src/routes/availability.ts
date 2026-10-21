import { Router, Request, Response } from "express";
import { z } from "zod";
import { sendError, sendSuccess } from "../utils/response.js";
import { requireAuth, requireAdmin, AuthenticatedRequest } from "../middleware/auth.js";
import { connectMongoDB, MongoAvailability, MongoTour } from "../db/mongodb.js";

const router = Router();

// GET /api/availability?slug=...&date=...
router.get("/", async (req: Request, res: Response) => {
  try {
    const slug = req.query.slug as string;
    const date = req.query.date as string;

    if (!slug || !date) {
      return sendError(res, "Query parameters 'slug' and 'date' are required.", 400);
    }

    await connectMongoDB();
    const tour = await MongoTour.findOne({ slug });
    const tourId = tour ? tour._id.toString() : slug;

    const rows = await MongoAvailability.find({
      $or: [{ tour_id: tourId }, { tour_id: slug }],
      date,
    });

    const defaultSlots = [
      { time_slot: "06:00 AM", total_slots: 6, booked_slots: 0, available_slots: 6, status: "open" },
      { time_slot: "09:00 AM", total_slots: 6, booked_slots: 1, available_slots: 5, status: "open" },
      { time_slot: "02:00 PM", total_slots: 6, booked_slots: 0, available_slots: 6, status: "open" },
      { time_slot: "04:00 PM", total_slots: 6, booked_slots: 2, available_slots: 4, status: "open" },
    ];

    if (rows.length === 0) {
      return sendSuccess(res, defaultSlots);
    }

    const result = rows.map((r: any) => ({
      time_slot: r.time_slot,
      total_slots: r.total_slots,
      booked_slots: r.booked_slots,
      available_slots: Math.max(0, r.total_slots - r.booked_slots),
      status: r.status,
    }));

    return sendSuccess(res, result);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

const availabilitySchema = z.object({
  tour_id: z.string(),
  date: z.string().min(8),
  time_slot: z.string().min(2),
  total_slots: z.number().int().default(6),
  status: z.enum(["open", "closed"]).default("open"),
});

// POST /api/availability - Admin manually configures availability slot
router.post("/", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = availabilitySchema.parse(req.body);
    await connectMongoDB();

    const updated = await MongoAvailability.findOneAndUpdate(
      { tour_id: parsed.tour_id, date: parsed.date, time_slot: parsed.time_slot },
      parsed,
      { upsert: true, new: true }
    );

    return sendSuccess(res, updated, "Availability updated");
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return sendError(res, err.errors.map(e => e.message).join(", "), 400);
    }
    return sendError(res, err.message, 500);
  }
});

export default router;
