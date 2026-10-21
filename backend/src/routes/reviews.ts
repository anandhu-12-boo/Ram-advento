import { Router, Request, Response } from "express";
import { z } from "zod";
import { sendError, sendSuccess } from "../utils/response.js";
import { requireAuth, requireAdmin, AuthenticatedRequest } from "../middleware/auth.js";
import { connectMongoDB, MongoReview } from "../db/mongodb.js";

const router = Router();

// GET /api/reviews - List approved public reviews
router.get("/", async (req: Request, res: Response) => {
  try {
    await connectMongoDB();
    const reviews = await MongoReview.find({ approved: true })
      .sort({ createdAt: -1 })
      .limit(20);

    return sendSuccess(res, reviews || []);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

// GET /api/reviews/admin - List all reviews (Admin moderation view)
router.get("/admin", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await connectMongoDB();
    const reviews = await MongoReview.find().sort({ createdAt: -1 });
    return sendSuccess(res, reviews || []);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

const reviewSchema = z.object({
  tour_id: z.string().optional().default(""),
  booking_id: z.string().optional().default(""),
  author_name: z.string().min(2).max(100),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3).max(1000),
});

// POST /api/reviews - Submit review (Authenticated customer)
router.post("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = reviewSchema.parse(req.body);
    await connectMongoDB();

    const review = await MongoReview.create({
      user_id: req.userId || "anonymous",
      tour_id: parsed.tour_id,
      booking_id: parsed.booking_id,
      author_name: parsed.author_name,
      rating: parsed.rating,
      comment: parsed.comment,
      approved: false, // Requires admin moderation
    });

    return sendSuccess(
      res,
      review,
      "Thank you! Your review has been submitted and will appear once approved.",
      201
    );
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return sendError(res, err.errors.map((e) => e.message).join(", "), 400);
    }
    return sendError(res, err.message, 500);
  }
});

// PUT /api/reviews/:id/moderation - Approve or reject review (Admin)
router.put("/:id/moderation", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;
    if (typeof approved !== "boolean") {
      return sendError(res, "Field 'approved' must be a boolean", 400);
    }

    await connectMongoDB();
    const updated = await MongoReview.findByIdAndUpdate(id, { approved }, { new: true });
    if (!updated) {
      return sendError(res, "Review not found", 404);
    }
    return sendSuccess(res, updated, `Review ${approved ? "approved" : "rejected"}`);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

// DELETE /api/reviews/:id - Delete review (Admin)
router.delete("/:id", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await connectMongoDB();
    await MongoReview.findByIdAndDelete(id);
    return sendSuccess(res, null, "Review deleted successfully");
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

export default router;
