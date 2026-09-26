import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../index.js";

describe("Account API (/api/account)", () => {
  it("GET /api/account/profile requires authentication (401)", async () => {
    const res = await request(app).get("/api/account/profile");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("PUT /api/account/profile requires authentication (401)", async () => {
    const res = await request(app).put("/api/account/profile").send({
      name: "Sojan",
      phone: "+919876543210",
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
