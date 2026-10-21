import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.js";
import { verifyToken } from "../utils/token.js";
import { connectMongoDB, MongoUser } from "../db/mongodb.js";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
  role: string;
  user_metadata?: {
    name?: string;
    role?: string;
  };
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
  userId?: string;
  role?: string;
  token?: string;
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

  // 1. Verify token
  const payload = verifyToken(token);
  if (payload) {
    req.token = token;
    req.userId = payload.userId;
    req.role = payload.role;
    req.user = {
      id: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      user_metadata: {
        name: payload.name,
        role: payload.role,
      },
    };
    return next();
  }

  return sendError(res, "Invalid or expired session.", 401);
};

export const requireAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.userId) {
    return sendError(res, "Authentication required prior to admin check.", 401);
  }

  // 1. Check role from token or MongoUser metadata
  if (req.role === "admin" || req.user?.user_metadata?.role === "admin") {
    return next();
  }

  // 2. Check MongoDB directly
  try {
    await connectMongoDB();
    const user = await MongoUser.findById(req.userId);
    if (user && user.role === "admin") {
      req.role = "admin";
      return next();
    }
  } catch {
    // Database check failed
  }

  return sendError(res, "Access denied. Admin privileges required.", 403);
};

