import { inr } from "@/lib/ui";

type SlipBooking = {
  booking_id: string;
  booking_date: string;
  time_slot: string;
  guests: number;
  vehicle?: string;
  pickup_location?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  special_request?: string;
  total_amount?: number;
  payment_status?: string;
  booking_status?: string;
  tours?: { title?: string; location?: string; duration?: string } | null;
};

/** Builds a plain-text booking slip and triggers a browser download. */
export function downloadBookingSlip(booking: SlipBooking) {
  const lines = [
    "RAM ADVENTURE — MUNNAR JEEP SAFARI & TOURS",
    "==========================================",
    `Booking reference : ${booking.booking_id}`,
    `Adventure         : ${booking.tours?.title ?? "-"}`,
    `Location          : ${booking.tours?.location ?? "Munnar, Kerala"}`,
    `Duration          : ${booking.tours?.duration ?? "-"}`,
    `Date              : ${booking.booking_date}`,
    `Time              : ${booking.time_slot}`,
    `Guests            : ${booking.guests}`,
    `Vehicle           : ${booking.vehicle || "-"}`,
    `Pickup            : ${booking.pickup_location || "-"}`,
    "",
    `Guest name        : ${booking.customer_name ?? "-"}`,
    `Email             : ${booking.customer_email ?? "-"}`,
    `Phone             : ${booking.customer_phone ?? "-"}`,
    `Special request   : ${booking.special_request || "-"}`,
    "",
    `Amount            : ${booking.total_amount ? inr(booking.total_amount) : "Quote on call"}`,
    `Payment status    : ${(booking.payment_status ?? "pending").toUpperCase()}`,
    `Booking status    : ${(booking.booking_status ?? "pending").toUpperCase()}`,
    "",
    "Please carry this reference and a valid ID on the day of your trip.",
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${booking.booking_id}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}
