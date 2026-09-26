import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../index.js";
import { publicSupabaseClient } from "../db/supabase.js";

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

  it("GET /api/availability returns empty list if tour is not found", async () => {
    vi.spyOn(publicSupabaseClient, "from").mockReturnValue({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    } as any);

    const res = await request(app).get("/api/availability?slug=unknown&date=2026-10-10");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  it("GET /api/availability returns slots when tour exists", async () => {
    const mockTour = { id: "tour-123", max_guests: 6 };
    const mockSlots = [
      { time_slot: "06:00 AM", total_slots: 6, booked_slots: 2, available_slots: 4, status: "open" },
    ];

    vi.spyOn(publicSupabaseClient, "from").mockImplementation((table: string) => {
      if (table === "tours") {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: () => Promise.resolve({ data: mockTour, error: null }),
            }),
          }),
        } as any;
      }
      if (table === "availability") {
        return {
          select: () => ({
            eq: () => ({
              eq: () => Promise.resolve({ data: mockSlots, error: null }),
            }),
          }),
        } as any;
      }
      return {} as any;
    });

    const res = await request(app).get("/api/availability?slug=munnar-jeep-safari&date=2026-10-10");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].time_slot).toBe("06:00 AM");
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
