import { Router, Response } from "express";
import { z } from "zod";
import { sendError, sendSuccess } from "../utils/response.js";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

// GET /api/account/profile - Get profile & user roles
router.get("/profile", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data: profile, error: profileErr } = await req.supabase!.rpc("ensure_profile", {});
    if (profileErr) {
      return sendError(res, "Could not load user profile: " + profileErr.message, 500);
    }

    const { data: roles, error: rolesErr } = await req.supabase!
      .from("user_roles")
      .select("role")
      .eq("user_id", req.userId!);

    if (rolesErr) {
      return sendError(res, "Could not load user roles: " + rolesErr.message, 500);
    }

    const roleList = (roles ?? []).map((r) => r.role as string);
    const profileRow = Array.isArray(profile) ? profile[0] : profile;

    return sendSuccess(res, {
      profile: profileRow ?? null,
      roles: roleList,
      isAdmin: roleList.includes("admin"),
    });
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

const updateProfileSchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().max(30),
});

// PUT /api/account/profile - Update name and phone
router.put("/profile", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = updateProfileSchema.parse(req.body);
    const { data, error } = await req.supabase!
      .from("profiles")
      .update({ name: parsed.name, phone: parsed.phone })
      .eq("id", req.userId!)
      .select()
      .single();

    if (error) {
      return sendError(res, "Could not update profile: " + error.message, 400);
    }

    return sendSuccess(res, data, "Profile updated successfully");
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return sendError(res, err.errors.map((e) => e.message).join(", "), 400);
    }
    return sendError(res, err.message, 500);
  }
});

export default router;
