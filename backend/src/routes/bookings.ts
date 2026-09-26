import { Router, Response } from "express";
import { z } from "zod";
import { sendError, sendSuccess } from "../utils/response.js";
import { requireAuth, requireAdmin, AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

const createBookingSchema = z.object({
  slug: z.string().min(1),
  date: z.string().min(8),
  time: z.string().min(3),
  guests: z.number().int().min(1).max(12),
  vehicle: z.string().max(80),
  pickup: z.string().max(120),
  special: z.string().max(1000).optional(),
  name: z.string().max(120).optional(),
  phone: z.string().max(30).optional(),
});

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

function formatBookingError(message: string): string {
  for (const key of Object.keys(bookingErrors)) {
    if (message.includes(key)) return bookingErrors[key]!;
  }
  return message || "Something went wrong creating your booking.";
}

// POST /api/bookings - Create new booking
router.post("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = createBookingSchema.parse(req.body);
    const { data: booking, error } = await req.supabase!.rpc("create_booking", {
      p_tour_slug: parsed.slug,
      p_date: parsed.date,
      p_time: parsed.time,
      p_guests: parsed.guests,
      p_vehicle: parsed.vehicle,
      p_pickup: parsed.pickup,
      p_special: parsed.special ?? "",
      p_name: parsed.name ?? "",
      p_phone: parsed.phone ?? "",
    });

    if (error) {
      return sendError(res, formatBookingError(error.message), 400);
    }

    const row = Array.isArray(booking) ? booking[0] : booking;
    return sendSuccess(res, row, "Booking created successfully", 201);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return sendError(res, err.errors.map((e) => e.message).join(", "), 400);
    }
    return sendError(res, err.message, 500);
  }
});

// GET /api/bookings/my - List customer's own bookings
router.get("/my", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data, error } = await req.supabase!
      .from("bookings")
      .select("*, tours(title,slug,location,duration,images,vehicle)")
      .order("created_at", { ascending: false });

    if (error) {
      return sendError(res, "Could not load bookings: " + error.message, 500);
    }
    return sendSuccess(res, data || []);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

// GET /api/bookings/:bookingId - Get booking by ref ID
router.get("/:bookingId", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { data, error } = await req.supabase!
      .from("bookings")
      .select("*, tours(title,slug,location,duration,images,vehicle,price)")
      .eq("booking_id", bookingId)
      .maybeSingle();

    if (error) {
      return sendError(res, "Could not load booking detail: " + error.message, 500);
    }
    if (!data) {
      return sendError(res, "Booking not found", 404);
    }
    return sendSuccess(res, data);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

// POST /api/bookings/:bookingId/cancel - Cancel booking
router.post("/:bookingId/cancel", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { data, error } = await req.supabase!.rpc("cancel_booking", {
      p_booking_id: bookingId,
    });

    if (error) {
      return sendError(res, formatBookingError(error.message), 400);
    }
    return sendSuccess(res, data, "Booking cancelled successfully");
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

// POST /api/bookings/:bookingId/pay - Process payment confirmation
router.post("/:bookingId/pay", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { paymentId = `PAY-${Date.now()}` } = req.body;

    const { data, error } = await req.supabase!
      .from("bookings")
      .update({
        payment_status: "paid",
        booking_status: "confirmed",
        payment_id: paymentId,
      })
      .eq("booking_id", bookingId)
      .select()
      .single();

    if (error) {
      return sendError(res, "Payment update failed: " + error.message, 400);
    }
    return sendSuccess(res, data, "Payment confirmed and booking updated.");
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

// GET /api/bookings - Admin view all bookings
router.get("/", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data, error } = await req.supabase!
      .from("bookings")
      .select("*, tours(title,slug)")
      .order("created_at", { ascending: false });

    if (error) {
      return sendError(res, "Failed to load bookings: " + error.message, 500);
    }
    return sendSuccess(res, data || []);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

export default router;
