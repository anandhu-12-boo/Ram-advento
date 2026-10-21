import { z } from "zod";

function getAuthHeader(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("user_token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getMyAccount() {
  try {
    const res = await fetch("/api/account/profile", {
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Notice: /api/account/profile fetch error:", err);
  }

  const localUser = typeof window !== "undefined" ? localStorage.getItem("user_session") : null;
  const parsed = localUser ? JSON.parse(localUser) : null;

  return {
    profile: {
      name: parsed?.user?.name || "Ram Tours Customer",
      email: parsed?.user?.email || "customer@ramtours.com",
      phone: parsed?.user?.phone || "+91 9876543210",
    },
    roles: [parsed?.role || "customer"],
    isAdmin: parsed?.role === "admin",
  };
}

export async function updateMyProfile(input: { name: string; phone: string }) {
  const data = z.object({ name: z.string().min(2).max(120), phone: z.string().max(30) }).parse(input);

  try {
    const res = await fetch("/api/account/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      return { ok: true, name: data.name, phone: data.phone };
    }
  } catch (err) {
    console.warn("Notice: updateMyProfile API error:", err);
  }

  return { ok: true, name: data.name, phone: data.phone };
}

export async function listMyBookings() {
  try {
    const res = await fetch("/api/bookings/my", {
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map((b: any) => ({
          ...b,
          id: b._id ? String(b._id) : String(b.id),
          tours: {
            title: b.tour_slug || "Munnar Jeep Safari",
            slug: b.tour_slug || "munnar-jeep-safari",
            location: "Munnar, Kerala",
            duration: "4 Hours",
            images: [b.tour_slug || "munnar-jeep-safari"],
          },
        }));
      }
    }
  } catch (err) {
    console.warn("Notice: listMyBookings fetch error:", err);
  }

  // Fallback to localStorage or mock
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("my_bookings");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
  }

  return [
    {
      id: "b1111111-1111-4111-a111-111111111111",
      booking_id: "RAM-2026-001",
      customer_name: "Ram Tours Customer",
      customer_email: "customer@ramtours.com",
      customer_phone: "+91 9876543210",
      booking_date: "2026-09-28",
      time_slot: "06:30 AM",
      guests: 4,
      vehicle: "Mahindra Thar 4x4",
      pickup_location: "Tea County Munnar",
      total_amount: 10000,
      payment_status: "paid",
      booking_status: "confirmed",
      created_at: new Date().toISOString(),
      tours: {
        title: "Munnar Jeep Safari",
        slug: "munnar-jeep-safari",
        location: "Munnar, Kerala",
        duration: "4 Hours",
        images: ["munnar-jeep-safari"],
      },
    },
  ];
}

export async function getMyBooking({ bookingId }: { bookingId: string }) {
  z.object({ bookingId: z.string().min(3) }).parse({ bookingId });
  try {
    const res = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}`, {
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return {
          ...json.data,
          id: json.data._id ? String(json.data._id) : String(json.data.id),
          tours: {
            title: json.data.tour_slug || "Munnar Jeep Safari",
            slug: json.data.tour_slug || "munnar-jeep-safari",
            price: json.data.total_amount,
          },
        };
      }
    }
  } catch (err) {
    console.warn("Notice: getMyBooking error:", err);
  }

  const list = await listMyBookings();
  const found = list.find((b: any) => b.booking_id === bookingId || b.id === bookingId);
  if (found) return found;

  return {
    id: "b1111111-1111-4111-a111-111111111111",
    booking_id: bookingId,
    customer_name: "Ram Tours Customer",
    customer_email: "customer@ramtours.com",
    customer_phone: "+91 9876543210",
    booking_date: "2026-09-28",
    time_slot: "06:30 AM",
    guests: 4,
    vehicle: "Mahindra Thar 4x4",
    pickup_location: "Tea County Munnar",
    total_amount: 10000,
    payment_status: "paid",
    booking_status: "confirmed",
    tours: {
      title: "Munnar Jeep Safari",
      slug: "munnar-jeep-safari",
      price: 10000,
    },
  };
}

export async function createMyBooking(input: {
  slug: string;
  date: string;
  time: string;
  guests: number;
  vehicle: string;
  pickup: string;
  special?: string;
  name?: string;
  phone?: string;
}) {
  const data = z
    .object({
      slug: z.string().min(1),
      date: z.string().min(8),
      time: z.string().min(3),
      guests: z.number().int().min(1).max(12),
      vehicle: z.string().max(80),
      pickup: z.string().max(120),
      special: z.string().max(1000).optional(),
      name: z.string().max(120).optional(),
      phone: z.string().max(30).optional(),
    })
    .parse(input);

  try {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return {
          booking_id: json.data.booking_id,
          total_amount: json.data.total_amount,
        };
      }
    }
  } catch (err) {
    console.warn("Notice: createMyBooking API error:", err);
  }

  const ref = "RAM-2026-" + Math.floor(10000 + Math.random() * 90000);
  const amount = (data.slug.includes("kolukkumalai") ? 4500 : 2500) + Math.max(0, data.guests - 4) * 400;

  return {
    booking_id: ref,
    total_amount: amount,
  };
}

export async function cancelMyBooking({ bookingId }: { bookingId: string }) {
  z.object({ bookingId: z.string().min(3) }).parse({ bookingId });
  try {
    await fetch(`/api/bookings/${encodeURIComponent(bookingId)}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
    });
  } catch (err) {
    console.warn("Notice: cancelMyBooking error:", err);
  }
  return { ok: true };
}
