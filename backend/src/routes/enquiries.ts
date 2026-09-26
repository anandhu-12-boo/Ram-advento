import { Router, Request, Response } from "express";
import { z } from "zod";
import { publicSupabaseClient } from "../db/supabase.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { requireAuth, requireAdmin, AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

const enquirySchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(30).default(""),
  message: z.string().min(5).max(2000),
});

// POST /api/enquiries - Submit contact enquiry (Public)
router.post("/", async (req: Request, res: Response) => {
  try {
    const parsed = enquirySchema.parse(req.body);
    const { data, error } = await publicSupabaseClient
      .from("contact_enquiries")
      .insert({
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        message: parsed.message,
      })
      .select()
      .single();

    if (error) {
      return sendError(res, "We could not send your message: " + error.message, 400);
    }
    return sendSuccess(res, data, "Your message has been sent successfully!", 201);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return sendError(res, err.errors.map((e) => e.message).join(", "), 400);
    }
    return sendError(res, err.message, 500);
  }
});

// GET /api/enquiries - List all enquiries (Admin)
router.get("/", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data, error } = await req.supabase!
      .from("contact_enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return sendError(res, "Failed to load enquiries: " + error.message, 500);
    }
    return sendSuccess(res, data || []);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

// PUT /api/enquiries/:id/status - Update enquiry status (Admin)
router.put("/:id/status", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return sendError(res, "Status field is required", 400);

    const { data, error } = await req.supabase!
      .from("contact_enquiries")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return sendError(res, "Failed to update enquiry status: " + error.message, 400);
    }
    return sendSuccess(res, data, "Enquiry status updated");
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

// DELETE /api/enquiries/:id - Delete enquiry (Admin)
router.delete("/:id", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await req.supabase!
      .from("contact_enquiries")
      .delete()
      .eq("id", id);

    if (error) {
      return sendError(res, "Failed to delete enquiry: " + error.message, 400);
    }
    return sendSuccess(res, null, "Enquiry deleted successfully");
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

export default router;
