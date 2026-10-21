import { Router, Response } from "express";
import { z } from "zod";
import { sendError, sendSuccess } from "../utils/response.js";
import { requireAuth, requireAdmin, AuthenticatedRequest } from "../middleware/auth.js";
import { connectMongoDB, MongoBooking, MongoUser, MongoTour } from "../db/mongodb.js";

const router = Router();

// GET /api/admin/overview - Detailed metrics & analytics overview
router.get("/overview", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    await connectMongoDB();
    const [mongoBookings, customers, tourCount] = await Promise.all([
      MongoBooking.find().sort({ createdAt: -1 }),
      MongoUser.countDocuments(),
      MongoTour.countDocuments(),
    ]);

    const rows = mongoBookings.map((b: any) => ({
      id: b._id.toString(),
      booking_id: b.booking_id,
      customer_name: b.customer_name,
      customer_email: b.customer_email,
      booking_date: b.booking_date,
      time_slot: b.time_slot,
      guests: b.guests,
      total_amount: b.total_amount,
      payment_status: b.payment_status,
      booking_status: b.booking_status,
      created_at: b.createdAt || b.created_at,
      tours: { title: b.tour_slug || "Munnar Jeep Safari", slug: b.tour_slug || "munnar-jeep-safari" },
    }));

    const paid = rows.filter((b: any) => b.payment_status === "paid");
    const byStatus = (s: string) => rows.filter((b: any) => b.booking_status === s).length;

    const revenueSince = (days: number) => {
      const from = new Date(Date.now() - days * 86400000).toISOString();
      return paid
        .filter((b: any) => String(b.created_at) >= from)
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

    return sendSuccess(res, {
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
    });
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

const updateBookingStatusSchema = z.object({
  booking_status: z.enum(["pending", "confirmed", "completed", "cancelled", "rescheduled"]).optional(),
  payment_status: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
});

// PUT /api/admin/bookings/:id/status - Admin update booking / payment status
router.put("/bookings/:id/status", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = updateBookingStatusSchema.parse(req.body);

    // Update booking in MongoDB
    await connectMongoDB();
    const updated = await MongoBooking.findOneAndUpdate(
      { $or: [{ _id: id }, { booking_id: id }] },
      parsed,
      { new: true }
    );

    if (updated) {
      return sendSuccess(res, updated, "Booking status updated successfully.");
    }

    return sendError(res, "Booking not found", 404);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return sendError(res, err.errors.map((e) => e.message).join(", "), 400);
    }
    return sendError(res, err.message, 500);
  }
});

export default router;
