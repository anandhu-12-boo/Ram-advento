import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../index.js";
import { MongoTour } from "../db/mongodb.js";

describe("Tours API (/api/tours)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("GET /api/tours returns list of available tours", async () => {
    const mockTours = [
      { id: "1", title: "Munnar Jeep Safari", slug: "munnar-jeep-safari", price: 2500, available: true },
      { id: "2", title: "Kolukkumalai Adventure", slug: "kolukkumalai-adventure", price: 4500, available: true },
    ];

    vi.spyOn(MongoTour, "find").mockReturnValue({
      sort: () => Promise.resolve(mockTours),
    } as any);

    const res = await request(app).get("/api/tours");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
  });

  it("GET /api/tours/:slug returns tour detail when tour exists", async () => {
    const mockTour = {
      _id: "507f1f77bcf86cd799439011",
      title: "Munnar Jeep Safari",
      slug: "munnar-jeep-safari",
      price: 2500,
      description: "Off-road run",
    };

    vi.spyOn(MongoTour, "findOne").mockResolvedValue(mockTour as any);

    const res = await request(app).get("/api/tours/munnar-jeep-safari");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe("munnar-jeep-safari");
  });

  it("GET /api/tours/:slug returns 404 when tour does not exist", async () => {
    vi.spyOn(MongoTour, "findOne").mockResolvedValue(null as any);

    const res = await request(app).get("/api/tours/non-existent-tour");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe("Tour not found");
  });

  it("POST /api/tours requires authentication (returns 401 without Bearer token)", async () => {
    const res = await request(app).post("/api/tours").send({
      title: "New Safari",
      slug: "new-safari",
      price: 3000,
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
