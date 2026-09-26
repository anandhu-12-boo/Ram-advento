import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../index.js";
import { publicSupabaseClient } from "../db/supabase.js";

describe("Bookings API (/api/bookings)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("POST /api/bookings returns 401 when missing Bearer token", async () => {
    const res = await request(app).post("/api/bookings").send({
      slug: "munnar-jeep-safari",
      date: "2026-10-10",
      time: "06:00 AM",
      guests: 2,
      vehicle: "Mahindra Thar 4x4",
      pickup: "Munnar Town",
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("GET /api/bookings/my returns 401 when unauthenticated", async () => {
    const res = await request(app).get("/api/bookings/my");
    expect(res.status).toBe(401);
  });

  it("GET /api/bookings/:bookingId returns 401 when unauthenticated", async () => {
    const res = await request(app).get("/api/bookings/RAM-2026-00001");
    expect(res.status).toBe(401);
  });

  it("POST /api/bookings/:bookingId/cancel returns 401 when unauthenticated", async () => {
    const res = await request(app).post("/api/bookings/RAM-2026-00001/cancel");
    expect(res.status).toBe(401);
  });

  it("POST /api/bookings/:bookingId/pay returns 401 when unauthenticated", async () => {
    const res = await request(app).post("/api/bookings/RAM-2026-00001/pay");
    expect(res.status).toBe(401);
  });
});
