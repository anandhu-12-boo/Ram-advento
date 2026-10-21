import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../index.js";
import { MongoTour, MongoAvailability } from "../db/mongodb.js";

describe("Availability API (/api/availability)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("GET /api/availability returns 400 when missing slug or date", async () => {
    const res = await request(app).get("/api/availability");
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain("required");
  });

  it("GET /api/availability returns default slots when no custom slots exist", async () => {
    vi.spyOn(MongoTour, "findOne").mockResolvedValue(null as any);
    vi.spyOn(MongoAvailability, "find").mockResolvedValue([] as any);

    const res = await request(app).get("/api/availability?slug=unknown&date=2026-10-10");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(4);
  });

  it("GET /api/availability returns custom slots when slots exist", async () => {
    const mockTour = { _id: "tour-123", slug: "munnar-jeep-safari" };
    const mockSlots = [
      { time_slot: "06:00 AM", total_slots: 6, booked_slots: 2, status: "open" },
    ];

    vi.spyOn(MongoTour, "findOne").mockResolvedValue(mockTour as any);
    vi.spyOn(MongoAvailability, "find").mockResolvedValue(mockSlots as any);

    const res = await request(app).get("/api/availability?slug=munnar-jeep-safari&date=2026-10-10");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].time_slot).toBe("06:00 AM");
    expect(res.body.data[0].available_slots).toBe(4);
  });

  it("POST /api/availability rejects unauthenticated users", async () => {
    const res = await request(app).post("/api/availability").send({
      tour_id: "00000000-0000-0000-0000-000000000000",
      date: "2026-10-10",
      time_slot: "06:00 AM",
    });
    expect(res.status).toBe(401);
  });
});
