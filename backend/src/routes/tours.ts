import { Router, Request, Response } from "express";
import { z } from "zod";
import { publicSupabaseClient } from "../db/supabase.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { requireAuth, requireAdmin, AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

const TOUR_COLUMNS =
  "id,title,slug,tagline,description,category,location,duration,price,max_guests,vehicle,images,highlights,itinerary,inclusions,exclusions,pickup_locations,rating,review_count,available,featured";

import { MongoTour } from "../db/mongodb.js";

// GET /api/tours - List available tours with optional search/filtering
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, location, minPrice, maxPrice, featured, search } = req.query;

    let query = publicSupabaseClient
      .from("tours")
      .select(TOUR_COLUMNS)
      .eq("available", true);

    if (category) {
      query = query.eq("category", String(category));
    }
    if (location) {
      query = query.ilike("location", `%${location}%`);
    }
    if (minPrice) {
      const minP = Number(minPrice);
      if (!isNaN(minP)) query = query.gte("price", minP);
    }
    if (maxPrice) {
      const maxP = Number(maxPrice);
      if (!isNaN(maxP)) query = query.lte("price", maxP);
    }
    if (featured !== undefined) {
      query = query.eq("featured", featured === "true" || featured === "1");
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,tagline.ilike.%${search}%`);
    }

    const { data, error } = await query.order("price", { ascending: true });

    if (error) {
      // Fallback to MongoDB
      try {
        const mongoFilter: any = { available: true };
        if (category) mongoFilter.category = String(category);
        if (featured !== undefined) mongoFilter.featured = featured === "true" || featured === "1";
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
      } catch (mErr: any) {
        return sendError(res, "Could not load tours: " + error.message, 500);
      }
    }
    return sendSuccess(res, data || []);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

// GET /api/tours/:slug - Get tour by slug
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { data, error } = await publicSupabaseClient
      .from("tours")
      .select(TOUR_COLUMNS)
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      try {
        const mongoTour = await MongoTour.findOne({ slug });
        if (mongoTour) return sendSuccess(res, mongoTour);
      } catch (mErr) {}
      if (!data) {
        return sendError(res, "Tour not found", 404);
      }
    }
    return sendSuccess(res, data);
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
    const { data, error } = await req.supabase!
      .from("tours")
      .insert(parsed)
      .select()
      .single();

    if (error) {
      return sendError(res, "Failed to create tour: " + error.message, 400);
    }
    return sendSuccess(res, data, "Tour created successfully", 201);
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
    const { data, error } = await req.supabase!
      .from("tours")
      .update(req.body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return sendError(res, "Failed to update tour: " + error.message, 400);
    }
    return sendSuccess(res, data, "Tour updated successfully");
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

// DELETE /api/tours/:id - Delete tour (Admin only)
router.delete("/:id", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await req.supabase!
      .from("tours")
      .delete()
      .eq("id", id);

    if (error) {
      return sendError(res, "Failed to delete tour: " + error.message, 400);
    }
    return sendSuccess(res, null, "Tour deleted successfully");
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

export default router;
