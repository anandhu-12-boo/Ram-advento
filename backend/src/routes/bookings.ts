import { Router, Response } from "express";
import { z } from "zod";
import { sendError, sendSuccess } from "../utils/response.js";
import { requireAuth, requireAdmin, AuthenticatedRequest } from "../middleware/auth.js";
import { connectMongoDB, MongoBooking, MongoTour } from "../db/mongodb.js";

const router = Router();

const createBookingSchema = z.object({
  slug: z.string().min(1),
  date: z.string().min(8),
  time: z.string().min(3),
  guests: z.number().int().min(1).max(12),
  vehicle: z.string().max(80).optional().default("Mahindra Thar 4x4"),
  pickup: z.string().max(120).optional().default("Munnar Town"),
  special: z.string().max(1000).optional().default(""),
  name: z.string().max(120).optional().default("Guest"),
  phone: z.string().max(30).optional().default(""),
});

// POST /api/bookings - Create new booking
router.post("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = createBookingSchema.parse(req.body);
    await connectMongoDB();

    const tour = await MongoTour.findOne({ slug: parsed.slug });
    const basePrice = tour ? tour.price : parsed.slug.includes("kolukkumalai") ? 4500 : 2500;
    const totalAmount = basePrice + Math.max(0, parsed.guests - 4) * 400;

    const bookingId = "RAM-" + Date.now().toString().slice(-6);

    const booking = await MongoBooking.create({
      booking_id: bookingId,
      user_id: req.userId || "anonymous",
      tour_id: tour ? tour._id.toString() : "",
      tour_slug: parsed.slug,
      customer_name: parsed.name || req.user?.user_metadata?.name || "Customer",
      customer_email: req.user?.email || "customer@ramtours.com",
      customer_phone: parsed.phone || "",
      booking_date: parsed.date,
      time_slot: parsed.time,
      guests: parsed.guests,
      vehicle: parsed.vehicle || "Mahindra Thar 4x4",
      pickup_location: parsed.pickup || "Tea County Munnar",
      special_request: parsed.special || "",
      total_amount: totalAmount,
      payment_status: "pending",
      booking_status: "confirmed",
    });

    return sendSuccess(res, booking, "Booking created successfully", 201);
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
    await connectMongoDB();
    const bookings = await MongoBooking.find({
      $or: [
        { user_id: req.userId },
        { customer_email: req.user?.email },
      ],
    }).sort({ createdAt: -1 });

    return sendSuccess(res, bookings);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

// GET /api/bookings/:bookingId - Get booking by ref ID
router.get("/:bookingId", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { bookingId } = req.params;
    await connectMongoDB();
    const booking = await MongoBooking.findOne({
      $or: [{ booking_id: bookingId }, { _id: bookingId }],
    });

    if (!booking) {
      return sendError(res, "Booking not found", 404);
    }
    return sendSuccess(res, booking);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

// POST /api/bookings/:bookingId/cancel - Cancel booking
router.post("/:bookingId/cancel", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { bookingId } = req.params;
    await connectMongoDB();
    const booking = await MongoBooking.findOneAndUpdate(
      { $or: [{ booking_id: bookingId }, { _id: bookingId }] },
      { booking_status: "cancelled" },
      { new: true }
    );

    if (!booking) {
      return sendError(res, "Booking not found", 404);
    }
    return sendSuccess(res, booking, "Booking cancelled successfully");
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

// POST /api/bookings/:bookingId/pay - Process payment confirmation
router.post("/:bookingId/pay", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { paymentId = `PAY-${Date.now()}` } = req.body;
    await connectMongoDB();

    const booking = await MongoBooking.findOneAndUpdate(
      { $or: [{ booking_id: bookingId }, { _id: bookingId }] },
      {
        payment_status: "paid",
        booking_status: "confirmed",
        payment_id: paymentId,
      },
      { new: true }
    );

    if (!booking) {
      return sendError(res, "Booking not found", 404);
    }
    return sendSuccess(res, booking, "Payment confirmed successfully");
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

// GET /api/bookings - Admin list all bookings
router.get("/", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await connectMongoDB();
    const bookings = await MongoBooking.find().sort({ createdAt: -1 });
    return sendSuccess(res, bookings);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

export default router;
