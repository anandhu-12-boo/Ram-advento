import { Router, Request, Response } from "express";
import { z } from "zod";
import { publicSupabaseClient } from "../db/supabase.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { requireAuth, requireAdmin, AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

// GET /api/reviews - List approved public reviews
router.get("/", async (req: Request, res: Response) => {
  try {
    const { data, error } = await publicSupabaseClient
      .from("reviews")
      .select("id,author_name,rating,comment,created_at,tour_id")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      return sendError(res, "Could not load reviews: " + error.message, 500);
    }
    return sendSuccess(res, data || []);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

// GET /api/reviews/admin - List all reviews (Admin moderation view)
router.get("/admin", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data, error } = await req.supabase!
      .from("reviews")
      .select("*, tours(title)")
      .order("created_at", { ascending: false });

    if (error) {
      return sendError(res, "Failed to load reviews for admin: " + error.message, 500);
    }
    return sendSuccess(res, data || []);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

const reviewSchema = z.object({
  tour_id: z.string().uuid().optional(),
  booking_id: z.string().uuid().optional(),
  author_name: z.string().min(2).max(100),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3).max(1000),
});

// POST /api/reviews - Submit review (Authenticated customer)
router.post("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = reviewSchema.parse(req.body);
    const { data, error } = await req.supabase!
      .from("reviews")
      .insert({
        user_id: req.userId!,
        tour_id: parsed.tour_id || null,
        booking_id: parsed.booking_id || null,
        author_name: parsed.author_name,
        rating: parsed.rating,
        comment: parsed.comment,
        approved: false, // Default pending admin approval
      })
      .select()
      .single();

    if (error) {
      return sendError(res, "Failed to submit review: " + error.message, 400);
    }
    return sendSuccess(res, data, "Review submitted and awaiting admin approval.", 201);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return sendError(res, err.errors.map((e) => e.message).join(", "), 400);
    }
    return sendError(res, err.message, 500);
  }
});

// PUT /api/reviews/:id/approve - Approve review (Admin)
router.put("/:id/approve", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    const { data, error } = await req.supabase!
      .from("reviews")
      .update({ approved: approved !== undefined ? approved : true })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return sendError(res, "Failed to approve review: " + error.message, 400);
    }
    return sendSuccess(res, data, "Review status updated.");
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

// DELETE /api/reviews/:id - Delete review (Admin)
router.delete("/:id", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await req.supabase!.from("reviews").delete().eq("id", id);
    if (error) {
      return sendError(res, "Failed to delete review: " + error.message, 400);
    }
    return sendSuccess(res, null, "Review deleted successfully.");
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

export default router;
