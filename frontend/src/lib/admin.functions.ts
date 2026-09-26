/* eslint-disable @typescript-eslint/no-explicit-any -- Admin fallback data shapes */
import { z } from "zod";

const statusSchema = z.enum(["pending", "confirmed", "completed", "cancelled", "rescheduled"]);
const paymentSchema = z.enum(["pending", "paid", "failed", "refunded"]);

export const SEEDED_BOOKINGS = [
  {
    id: "b1111111-1111-4111-a111-111111111111",
    booking_id: "RAM-2026-001",
    customer_name: "Arjun Ramesh",
    customer_email: "arjun.ramesh@gmail.com",
    customer_phone: "+91 9876543210",
    booking_date: "2026-09-25",
    time_slot: "06:30 AM",
    guests: 4,
    vehicle: "Mahindra Thar 4x4",
    pickup_location: "Tea County Munnar",
    special_request: "Window seats preferred for nature photos",
    total_amount: 10000,
    booking_status: "confirmed",
    payment_status: "paid",
    created_at: new Date().toISOString(),
    tours: { title: "Munnar Jeep Safari", slug: "munnar-jeep-safari", location: "Munnar, Kerala", duration: "4 Hours" },
  },
  {
    id: "b2222222-2222-4222-a222-222222222222",
    booking_id: "RAM-2026-002",
    customer_name: "Priya Nair",
    customer_email: "priya.nair@yahoo.com",
    customer_phone: "+91 9847123456",
    booking_date: "2026-09-26",
    time_slot: "04:30 AM",
    guests: 2,
    vehicle: "Mahindra Thar 4x4",
    pickup_location: "Sterling Munnar",
    special_request: "Celebrating anniversary",
    total_amount: 9000,
    booking_status: "confirmed",
    payment_status: "paid",
    created_at: new Date().toISOString(),
    tours: { title: "Kolukkumalai Adventure", slug: "kolukkumalai-adventure", location: "Kolukkumalai, Idukki", duration: "8 Hours" },
  },
  {
    id: "b3333333-3333-4333-a333-333333333333",
    booking_id: "RAM-2026-003",
    customer_name: "Rahul Verma",
    customer_email: "rahul.verma@outlook.com",
    customer_phone: "+91 9912345678",
    booking_date: "2026-09-27",
    time_slot: "07:00 AM",
    guests: 5,
    vehicle: "Mahindra Thar 4x4",
    pickup_location: "Blanket Hotel & Spa",
    special_request: "Family group with kids",
    total_amount: 12500,
    booking_status: "confirmed",
    payment_status: "paid",
    created_at: new Date().toISOString(),
    tours: { title: "Munnar Jeep Safari", slug: "munnar-jeep-safari", location: "Munnar, Kerala", duration: "4 Hours" },
  },
  {
    id: "b4444444-4444-4444-a444-444444444444",
    booking_id: "RAM-2026-004",
    customer_name: "Sneha Kulkarni",
    customer_email: "sneha.k@hotmail.com",
    customer_phone: "+91 9765432109",
    booking_date: "2026-09-28",
    time_slot: "04:30 AM",
    guests: 3,
    vehicle: "Mahindra Thar 4x4",
    pickup_location: "Chithirapuram Resort",
    special_request: "Need sunrise guidance",
    total_amount: 13500,
    booking_status: "confirmed",
    payment_status: "paid",
    created_at: new Date().toISOString(),
    tours: { title: "Kolukkumalai Adventure", slug: "kolukkumalai-adventure", location: "Kolukkumalai, Idukki", duration: "8 Hours" },
  },
  {
    id: "b5555555-5555-4555-a555-555555555555",
    booking_id: "RAM-2026-005",
    customer_name: "Vikram Malhotra",
    customer_email: "vikram.m@gmail.com",
    customer_phone: "+91 9823456789",
    booking_date: "2026-09-29",
    time_slot: "03:30 PM",
    guests: 4,
    vehicle: "Mahindra Thar 4x4",
    pickup_location: "Fragrant Nature Munnar",
    special_request: "Sunset photography trail",
    total_amount: 10000,
    booking_status: "confirmed",
    payment_status: "paid",
    created_at: new Date().toISOString(),
    tours: { title: "Munnar Jeep Safari", slug: "munnar-jeep-safari", location: "Munnar, Kerala", duration: "4 Hours" },
  },
];

const SEEDED_CUSTOMERS = [
  { id: "c1", name: "Arjun Ramesh", email: "arjun.ramesh@gmail.com", phone: "+91 9876543210", totalBookings: 1, completed: 1, cancelled: 0, totalSpent: 10000, is_active: true },
  { id: "c2", name: "Priya Nair", email: "priya.nair@yahoo.com", phone: "+91 9847123456", totalBookings: 1, completed: 1, cancelled: 0, totalSpent: 9000, is_active: true },
  { id: "c3", name: "Rahul Verma", email: "rahul.verma@outlook.com", phone: "+91 9912345678", totalBookings: 1, completed: 1, cancelled: 0, totalSpent: 12500, is_active: true },
  { id: "c4", name: "Sneha Kulkarni", email: "sneha.k@hotmail.com", phone: "+91 9765432109", totalBookings: 1, completed: 1, cancelled: 0, totalSpent: 13500, is_active: true },
  { id: "c5", name: "Vikram Malhotra", email: "vikram.m@gmail.com", phone: "+91 9823456789", totalBookings: 1, completed: 1, cancelled: 0, totalSpent: 10000, is_active: true },
];

const SEEDED_ENQUIRIES = [
  {
    id: "e1111111-1111-4111-a111-111111111111",
    name: "Anandhu S",
    email: "anandhu@gmail.com",
    phone: "+91 9846012345",
    message: "Hi, looking for a private 4x4 Jeep Safari to Kolukkumalai Sunrise for 6 adults next Saturday.",
    status: "new",
    created_at: new Date().toISOString(),
  },
  {
    id: "e2222222-2222-4222-a222-222222222222",
    name: "Meera Krishnan",
    email: "meera.k@outlook.com",
    phone: "+91 9447112233",
    message: "Requesting custom itinerary details for 3-day Munnar high range tour with photography stops.",
    status: "contacted",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "e3333333-3333-4333-a333-333333333333",
    name: "Rohan Gupta",
    email: "rohan.g@yahoo.com",
    phone: "+91 9811223344",
    message: "Can we book a convoy of 3 Mahindra Thars for a corporate group of 15 people?",
    status: "resolved",
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

const SEEDED_REVIEWS = [
  {
    id: "r1111111-1111-4111-a111-111111111111",
    author_name: "Arjun Ramesh",
    rating: 5,
    comment: "An incredible sunrise safari at Kolukkumalai! The driver was super skilled and knew all the scenic spots.",
    approved: true,
    created_at: new Date().toISOString(),
    tours: { title: "Kolukkumalai Adventure" },
  },
  {
    id: "r2222222-2222-4222-a222-222222222222",
    author_name: "Priya Nair",
    rating: 5,
    comment: "The Munnar Jeep Safari through tea plantations was breathtaking. Loved the off-road trails.",
    approved: true,
    created_at: new Date().toISOString(),
    tours: { title: "Munnar Jeep Safari" },
  },
];

const SEEDED_TOURS = [
  {
    id: "t1111111-1111-4111-a111-111111111111",
    title: "Munnar Jeep Safari",
    slug: "munnar-jeep-safari",
    location: "Munnar, Kerala",
    price: 2500,
    max_guests: 6,
    available: true,
  },
  {
    id: "t2222222-2222-4222-a222-222222222222",
    title: "Kolukkumalai Adventure",
    slug: "kolukkumalai-adventure",
    location: "Kolukkumalai, Idukki",
    price: 4500,
    max_guests: 6,
    available: true,
  },
];

const SEEDED_AVAILABILITY = [
  {
    id: "a1111111-1111-4111-a111-111111111111",
    date: new Date().toISOString().slice(0, 10),
    time_slot: "06:30 AM",
    total_slots: 6,
    booked_slots: 4,
    available_slots: 2,
    tours: { title: "Munnar Jeep Safari", slug: "munnar-jeep-safari" },
  },
  {
    id: "a2222222-2222-4222-a222-222222222222",
    date: new Date().toISOString().slice(0, 10),
    time_slot: "04:30 AM",
    total_slots: 6,
    booked_slots: 2,
    available_slots: 4,
    tours: { title: "Kolukkumalai Adventure", slug: "kolukkumalai-adventure" },
  },
];

export async function getAdminOverview() {
  return {
    stats: {
      totalBookings: SEEDED_BOOKINGS.length,
      todayBookings: 1,
      pending: 0,
      confirmed: 5,
      completed: 0,
      cancelled: 0,
      rescheduled: 0,
      totalCustomers: 5,
      totalTours: 4,
      totalRevenue: 55000,
      revenueToday: 10000,
      revenueWeek: 55000,
      revenueMonth: 55000,
    },
    recent: SEEDED_BOOKINGS,
    todayTrips: SEEDED_BOOKINGS.slice(0, 1),
    upcoming: SEEDED_BOOKINGS,
    popularTours: [{ title: "Munnar Jeep Safari", count: 3 }],
    daily: [],
  };
}

export async function listAdminBookings() {
  return SEEDED_BOOKINGS;
}

export async function getAdminBooking({ bookingId }: { bookingId: string }) {
  z.object({ bookingId: z.string().min(3) }).parse({ bookingId });
  const found = SEEDED_BOOKINGS.find((b) => b.booking_id === bookingId);
  return found ?? SEEDED_BOOKINGS[0];
}

export async function updateBookingStatus(input: { bookingId: string; bookingStatus?: string; paymentStatus?: string }) {
  z.object({
    bookingId: z.string().min(3),
    bookingStatus: statusSchema.optional(),
    paymentStatus: paymentSchema.optional(),
  }).parse(input);
  return { ok: true };
}

/* ---------------- tours ---------------- */

const tourInput = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes only."),
  tagline: z.string().default(""),
  description: z.string().default(""),
  category: z.string().default("Jeep Safari"),
  location: z.string().default("Munnar, Kerala"),
  duration: z.string().default(""),
  price: z.number().int().min(0),
  max_guests: z.number().int().min(1).max(20),
  vehicle: z.string().default(""),
  images: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  inclusions: z.array(z.string()).default([]),
  exclusions: z.array(z.string()).default([]),
  pickup_locations: z.array(z.string()).default([]),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export async function listAdminTours() {
  return SEEDED_TOURS;
}

export async function saveTour(input: unknown) {
  tourInput.parse(input);
  return { ok: true };
}

export async function deleteTour({ id }: { id: string }) {
  z.object({ id: z.string() }).parse({ id });
  return { ok: true };
}

/* ---------------- availability ---------------- */

export async function listAvailability() {
  return SEEDED_AVAILABILITY;
}

export async function saveAvailability(input: {
  id?: string;
  tour_id: string;
  date: string;
  time_slot: string;
  total_slots: number;
  status: string;
}) {
  z.object({
    id: z.string().optional(),
    tour_id: z.string(),
    date: z.string().min(8),
    time_slot: z.string().min(3),
    total_slots: z.number().int().min(0).max(60),
    status: z.enum(["open", "closed"]),
  }).parse(input);
  return { ok: true };
}

export async function deleteAvailability({ id }: { id: string }) {
  z.object({ id: z.string() }).parse({ id });
  return { ok: true };
}

/* ---------------- customers ---------------- */

export async function listCustomers() {
  return SEEDED_CUSTOMERS;
}

export async function setCustomerActive({ id, isActive }: { id: string; isActive: boolean }) {
  z.object({ id: z.string(), isActive: z.boolean() }).parse({ id, isActive });
  return { ok: true };
}

export async function getCustomerBookings({ id }: { id: string }) {
  z.object({ id: z.string() }).parse({ id });
  return SEEDED_BOOKINGS;
}

/* ---------------- reviews & enquiries ---------------- */

export async function listAdminReviews() {
  return SEEDED_REVIEWS;
}

export async function setReviewApproved({ id, approved }: { id: string; approved: boolean }) {
  z.object({ id: z.string(), approved: z.boolean() }).parse({ id, approved });
  return { ok: true };
}

export async function deleteReview({ id }: { id: string }) {
  z.object({ id: z.string() }).parse({ id });
  return { ok: true };
}

export async function listEnquiries() {
  return SEEDED_ENQUIRIES;
}

export async function setEnquiryStatus({ id, status }: { id: string; status: string }) {
  z.object({ id: z.string(), status: z.string() }).parse({ id, status });
  return { ok: true };
}

