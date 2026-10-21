import crypto from "crypto";
import { config } from "../config/env.js";

const TOKEN_SECRET = config.jwtSecret;

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  name?: string;
  exp?: number;
}

export function generateToken(payload: Omit<TokenPayload, "exp">): string {
  const data = JSON.stringify({
    ...payload,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  const b64Data = Buffer.from(data).toString("base64url");
  const signature = crypto.createHmac("sha256", TOKEN_SECRET).update(b64Data).digest("base64url");
  return `${b64Data}.${signature}`;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length === 2) {
      const [b64Data, signature] = parts;
      const expectedSig = crypto.createHmac("sha256", TOKEN_SECRET).update(b64Data).digest("base64url");
      if (signature !== expectedSig) {
        return null;
      }
      const payload: TokenPayload = JSON.parse(Buffer.from(b64Data, "base64url").toString("utf-8"));
      if (payload.exp && Date.now() > payload.exp) {
        return null;
      }
      return payload;
    }

    // Fallback: try raw base64 if someone passes a base64 JSON token
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const raw = JSON.parse(decoded);
    if (raw && (raw.userId || raw.id)) {
      return {
        userId: raw.userId || raw.id,
        email: raw.email || "",
        role: raw.role || "customer",
        name: raw.name || "",
      };
    }
    return null;
  } catch {
    return null;
  }
}
