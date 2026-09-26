import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../index.js";

describe("GET /api/health", () => {
  it("should return status 200 and healthy status payload", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("healthy");
    expect(res.body.data.service).toBe("Ram Tours & Safaris API Backend");
  });

  it("should return 404 for non-existent routes", async () => {
    const res = await request(app).get("/api/invalid-route-xyz");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain("not found");
  });
});


