/* eslint-disable @typescript-eslint/no-explicit-any -- Supabase joins are runtime-shaped. */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SiteShell } from "@/components/SiteShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyBooking } from "@/lib/account.functions";
import { downloadBookingSlip } from "@/lib/booking-slip";
import { resolveTourImage } from "@/lib/tour-images";
import { btnGhost, btnSmall, inr } from "@/lib/ui";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 border-b border-white/10 py-3">
      <dt className="text-mist/55">{label}</dt>
      <dd className="text-right text-mist">{value}</dd>
    </div>
  );
}

export default function BookingDetailPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [b, setB] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Booking details | Ram Adventure";
    if (bookingId) {
      getMyBooking({ bookingId })
        .then((res) => {
          setB(res);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [bookingId]);

  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-6 pt-32 pb-24">
        {loading ? (
          <Skeleton className="h-96 w-full" />
        ) : !b ? (
          <div className="rounded-sm border border-white/10 bg-forest-deep/40 p-10 text-center">
            <p className="text-mist/75">We could not find that booking.</p>
            <Link to="/my-account/bookings" className={`${btnGhost} mt-6`}>
              Back to my bookings
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="eyebrow">{b.booking_id}</p>
                <h1 className="mt-1 font-display text-4xl text-mist">{b.tours?.title}</h1>
              </div>
              <div className="flex gap-2">
                <StatusBadge value={b.payment_status} kind="payment" />
                <StatusBadge value={b.booking_status} />
              </div>
            </div>

            <div className="overflow-hidden rounded-sm border border-white/10 bg-forest-deep/50">
              {b.tours?.images?.[0] && (
                <img
                  src={resolveTourImage(b.tours.images[0])}
                  alt={b.tours?.title ?? "Tour"}
                  className="h-64 w-full object-cover"
                />
              )}
              <dl className="p-6 text-sm">
                <Row label="Booking Reference" value={b.booking_id} />
                <Row label="Customer Name" value={b.customer_name} />
                <Row label="Email" value={b.customer_email} />
                <Row label="Phone" value={b.customer_phone || "—"} />
                <Row label="Date" value={b.booking_date} />
                <Row label="Time Slot" value={b.time_slot} />
                <Row label="Guests" value={String(b.guests)} />
                <Row label="Vehicle" value={b.vehicle} />
                <Row label="Pickup Location" value={b.pickup_location} />
                <div className="flex justify-between gap-6 pt-4 font-display text-2xl text-sand">
                  <dt>Total Amount</dt>
                  <dd>{inr(b.total_amount)}</dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => downloadBookingSlip(b)}
                className={`${btnSmall} bg-sand text-forest-deep hover:bg-mist`}
              >
                Download Slip
              </button>
              <Link to="/my-account/bookings" className={btnGhost}>
                Back to my bookings
              </Link>
            </div>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
