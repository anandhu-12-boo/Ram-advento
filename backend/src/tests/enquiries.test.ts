import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../index.js";
import { publicSupabaseClient } from "../db/supabase.js";

describe("Enquiries API (/api/enquiries)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("POST /api/enquiries validates required fields", async () => {
    const res = await request(app).post("/api/enquiries").send({
      name: "A",
      email: "invalid-email",
      message: "hi",
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("POST /api/enquiries submits contact form successfully", async () => {
    const mockCreated = {
      id: "enq-1",
      name: "Rahul Sharma",
      email: "rahul@example.com",
      message: "Interested in safari booking",
      status: "new",
    };

    vi.spyOn(publicSupabaseClient, "from").mockReturnValue({
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: mockCreated, error: null }),
        }),
      }),
    } as any);

    const res = await request(app).post("/api/enquiries").send({
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "+919876543210",
      message: "Interested in safari booking for next month",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe("enq-1");
  });

  it("GET /api/enquiries returns 401 when unauthenticated", async () => {
    const res = await request(app).get("/api/enquiries");
    expect(res.status).toBe(401);
  });

  it("DELETE /api/enquiries/:id returns 401 when unauthenticated", async () => {
    const res = await request(app).delete("/api/enquiries/enq-1");
    expect(res.status).toBe(401);
  });
});
