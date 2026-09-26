import { z } from "zod";

export async function getMyAccount() {
  return {
    profile: { name: "Ram Tours Customer", email: "customer@ramtours.com", phone: "+91 9876543210" },
    roles: ["customer"],
    isAdmin: false,
  };
}

export async function updateMyProfile(input: { name: string; phone: string }) {
  const data = z.object({ name: z.string().min(2).max(120), phone: z.string().max(30) }).parse(input);
  return { ok: true, name: data.name, phone: data.phone };
}

export async function listMyBookings() {
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
  const list = await listMyBookings();
  const found = list.find((b) => b.booking_id === bookingId);
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

  const ref = "RAM-2026-" + Math.floor(10000 + Math.random() * 90000);
  const amount = (data.slug.includes("kolukkumalai") ? 4500 : 2500) + Math.max(0, data.guests - 4) * 400;

  return {
    booking_id: ref,
    total_amount: amount,
  };
}

export async function cancelMyBooking({ bookingId }: { bookingId: string }) {
  z.object({ bookingId: z.string().min(3) }).parse({ bookingId });
  return { ok: true };
}

