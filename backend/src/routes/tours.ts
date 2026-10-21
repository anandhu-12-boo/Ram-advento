import { Router, Request, Response } from "express";
import { z } from "zod";
import { sendError, sendSuccess } from "../utils/response.js";
import { requireAuth, requireAdmin, AuthenticatedRequest } from "../middleware/auth.js";
import { connectMongoDB, MongoTour } from "../db/mongodb.js";

const router = Router();

// GET /api/tours - List available tours with optional search/filtering
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, location, minPrice, maxPrice, featured, search } = req.query;
    await connectMongoDB();

    const mongoFilter: any = { available: true };
    if (category) mongoFilter.category = String(category);
    if (featured !== undefined) mongoFilter.featured = featured === "true" || featured === "1";
    if (location) mongoFilter.location = { $regex: String(location), $options: "i" };
    if (minPrice || maxPrice) {
      mongoFilter.price = {};
      if (minPrice) mongoFilter.price.$gte = Number(minPrice);
      if (maxPrice) mongoFilter.price.$lte = Number(maxPrice);
    }
    if (search) {
      mongoFilter.$or = [
        { title: { $regex: String(search), $options: "i" } },
        { description: { $regex: String(search), $options: "i" } },
        { tagline: { $regex: String(search), $options: "i" } },
      ];
    }

    const mongoTours = await MongoTour.find(mongoFilter).sort({ price: 1 });
    return sendSuccess(res, mongoTours);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

// GET /api/tours/:slug - Get tour by slug
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const slug = String(req.params.slug || "");
    await connectMongoDB();

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(slug);
    const mongoTour = await MongoTour.findOne(
      isMongoId ? { $or: [{ slug }, { _id: slug }] } : { slug }
    );

    if (!mongoTour) {
      return sendError(res, "Tour not found", 404);
    }
    return sendSuccess(res, mongoTour);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

const createTourSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  tagline: z.string().default(""),
  description: z.string().default(""),
  category: z.string().default("Jeep Safari"),
  location: z.string().default("Munnar, Kerala"),
  duration: z.string().default("4 Hours"),
  price: z.number().int().min(0),
  max_guests: z.number().int().default(6),
  vehicle: z.string().default("Mahindra Thar 4x4"),
  images: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  itinerary: z.array(z.any()).default([]),
  inclusions: z.array(z.string()).default([]),
  exclusions: z.array(z.string()).default([]),
  pickup_locations: z.array(z.string()).default([]),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
});

// POST /api/tours - Create a new tour (Admin only)
router.post("/", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = createTourSchema.parse(req.body);
    await connectMongoDB();

    const tour = await MongoTour.create(parsed);
    return sendSuccess(res, tour, "Tour created successfully", 201);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return sendError(res, err.errors.map(e => e.message).join(", "), 400);
    }
    return sendError(res, err.message, 500);
  }
});

// PUT /api/tours/:id - Update tour (Admin only)
router.put("/:id", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await connectMongoDB();

    const tour = await MongoTour.findByIdAndUpdate(id, req.body, { new: true });
    if (!tour) {
      return sendError(res, "Tour not found", 404);
    }
    return sendSuccess(res, tour, "Tour updated successfully");
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

// DELETE /api/tours/:id - Delete tour (Admin only)
router.delete("/:id", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await connectMongoDB();

    await MongoTour.findByIdAndDelete(id);
    return sendSuccess(res, null, "Tour deleted successfully");
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

export default router;
