import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../index.js";

describe("Admin API (/api/admin)", () => {
  it("GET /api/admin/overview requires authentication (401)", async () => {
    const res = await request(app).get("/api/admin/overview");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("PUT /api/admin/bookings/:id/status requires authentication (401)", async () => {
    const res = await request(app).put("/api/admin/bookings/b-123/status").send({
      booking_status: "confirmed",
      payment_status: "paid",
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
