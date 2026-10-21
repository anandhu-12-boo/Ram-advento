import { Router, Request, Response } from "express";
import { z } from "zod";
import { sendError, sendSuccess } from "../utils/response.js";
import { requireAuth, requireAdmin, AuthenticatedRequest } from "../middleware/auth.js";
import { connectMongoDB, MongoEnquiry } from "../db/mongodb.js";

const router = Router();

const enquirySchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(30).optional().default(""),
  message: z.string().min(5).max(2000),
});

// POST /api/enquiries - Submit contact enquiry (Public)
router.post("/", async (req: Request, res: Response) => {
  try {
    const parsed = enquirySchema.parse(req.body);
    await connectMongoDB();

    const enquiry = await MongoEnquiry.create({
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      message: parsed.message,
      status: "new",
    });

    return sendSuccess(res, enquiry, "Your message has been sent successfully!", 201);
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
    await connectMongoDB();
    const enquiries = await MongoEnquiry.find().sort({ createdAt: -1 });
    return sendSuccess(res, enquiries || []);
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

    await connectMongoDB();
    const updated = await MongoEnquiry.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      return sendError(res, "Enquiry not found", 404);
    }
    return sendSuccess(res, updated, "Enquiry status updated");
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

// DELETE /api/enquiries/:id - Delete enquiry (Admin)
router.delete("/:id", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await connectMongoDB();
    await MongoEnquiry.findByIdAndDelete(id);
    return sendSuccess(res, null, "Enquiry deleted successfully");
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

export default router;
