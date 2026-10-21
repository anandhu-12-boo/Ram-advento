import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../index.js";
import { MongoReview } from "../db/mongodb.js";

describe("Reviews API (/api/reviews)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("GET /api/reviews returns approved public reviews", async () => {
    const mockReviews = [
      { _id: "rev-1", author_name: "Anand", rating: 5, comment: "Amazing safari experience!", createdAt: "2026-09-01" },
    ];

    vi.spyOn(MongoReview, "find").mockReturnValue({
      sort: () => ({
        limit: () => Promise.resolve(mockReviews),
      }),
    } as any);

    const res = await request(app).get("/api/reviews");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].author_name).toBe("Anand");
  });

  it("GET /api/reviews/admin requires authentication", async () => {
    const res = await request(app).get("/api/reviews/admin");
    expect(res.status).toBe(401);
  });

  it("POST /api/reviews requires authentication", async () => {
    const res = await request(app).post("/api/reviews").send({
      author_name: "Test User",
      rating: 5,
      comment: "Great experience",
    });
    expect(res.status).toBe(401);
  });

  it("PUT /api/reviews/:id/moderation requires authentication", async () => {
    const res = await request(app).put("/api/reviews/rev-1/moderation").send({ approved: true });
    expect(res.status).toBe(401);
  });

  it("DELETE /api/reviews/:id requires authentication", async () => {
    const res = await request(app).delete("/api/reviews/rev-1");
    expect(res.status).toBe(401);
  });
});
