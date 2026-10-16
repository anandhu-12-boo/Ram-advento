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

function formatAmount(amount?: number) {
  return amount ? `INR ${amount.toLocaleString("en-IN")}` : "Quote on call";
}

/** Builds a customer booking ticket and triggers a PDF download. */
export async function downloadBookingSlip(booking: SlipBooking) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  pdf.setFillColor(16, 42, 31);
  pdf.rect(0, 0, pageWidth, 54, "F");
  pdf.setTextColor(249, 246, 240);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text("RAM ADVENTURE", margin, 23);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text("JEEP SAFARI & TOUR BOOKING TICKET", margin, 32);
  pdf.setTextColor(214, 192, 154);
  pdf.setFont("helvetica", "bold");
  pdf.text(`REFERENCE  ${booking.booking_id}`, pageWidth - margin, 23, { align: "right" });
  pdf.setTextColor(40, 50, 44);

  let y = 68;
  const section = (title: string) => {
    if (y + 16 > 278) {
      pdf.addPage();
      y = 20;
    }
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(31, 77, 53);
    pdf.text(title.toUpperCase(), margin, y);
    y += 7;
    pdf.setDrawColor(214, 192, 154);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 7;
  };
  const row = (label: string, value: string) => {
    const wrapped = pdf.splitTextToSize(value || "-", contentWidth - 46) as string[];
    const rowHeight = Math.max(8, wrapped.length * 5 + 3);
    if (y + rowHeight > 278) {
      pdf.addPage();
      y = 20;
    }
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(95, 101, 96);
    pdf.text(label, margin, y);
    pdf.setTextColor(30, 35, 31);
    pdf.text(wrapped, margin + 46, y);
    y += rowHeight;
  };

  section("Adventure details");
  row("Tour", booking.tours?.title ?? "-");
  row("Location", booking.tours?.location ?? "Kerala");
  row("Duration", booking.tours?.duration ?? "-");
  row("Date", booking.booking_date);
  row("Time", booking.time_slot);
  row("Guests", String(booking.guests));
  row("Vehicle", booking.vehicle || "-");
  row("Pickup location", booking.pickup_location || "-");

  y += 3;
  section("Guest details");
  row("Name", booking.customer_name || "-");
  row("Email", booking.customer_email || "-");
  row("Phone", booking.customer_phone || "-");
  row("Special request", booking.special_request || "None");

  y += 3;
  section("Payment & booking status");
  row("Amount", formatAmount(booking.total_amount));
  row("Payment", (booking.payment_status ?? "pending").toUpperCase());
  row("Booking", (booking.booking_status ?? "pending").toUpperCase());

  y += 8;
  if (y + 32 > 278) {
    pdf.addPage();
    y = 20;
  }
  pdf.setFillColor(243, 239, 230);
  pdf.roundedRect(margin, y, contentWidth, 21, 2, 2, "F");
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(55, 62, 56);
  pdf.text(
    pdf.splitTextToSize(
      "Please keep this ticket and your booking reference for your trip. Contact Ram Adventure if any booking details need correction.",
      contentWidth - 12,
    ),
    margin + 6,
    y + 8,
  );

  pdf.save(`ram-adventure-${booking.booking_id}.pdf`);
}
