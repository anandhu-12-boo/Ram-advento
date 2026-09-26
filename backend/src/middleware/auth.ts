import { Request, Response, NextFunction } from "express";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { createAuthenticatedSupabaseClient, publicSupabaseClient } from "../db/supabase.js";
import { sendError } from "../utils/response.js";

export interface AuthenticatedRequest extends Request {
  user?: User;
  userId?: string;
  token?: string;
  supabase?: SupabaseClient;
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, "Authentication required. Missing Bearer token.", 401);
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return sendError(res, "Invalid token provided.", 401);
  }

  try {
    const { data: { user }, error } = await publicSupabaseClient.auth.getUser(token);
    if (error || !user) {
      return sendError(res, "Invalid or expired session.", 401);
    }

    req.token = token;
    req.user = user;
    req.userId = user.id;
    req.supabase = createAuthenticatedSupabaseClient(token);

    next();
  } catch (err: any) {
    return sendError(res, "Auth verification failed: " + err.message, 401);
  }
};

export const requireAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.userId || !req.supabase) {
    return sendError(res, "Authentication required prior to admin check.", 401);
  }

  try {
    const { data, error } = await req.supabase.rpc("has_role", {
      _user_id: req.userId,
      _role: "admin",
    });

    if (error || !data) {
      return sendError(res, "Access denied. Admin privileges required.", 403);
    }

    next();
  } catch (err: any) {
    return sendError(res, "Admin check failed: " + err.message, 500);
  }
};
