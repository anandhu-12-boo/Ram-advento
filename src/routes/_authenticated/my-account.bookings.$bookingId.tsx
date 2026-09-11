/* eslint-disable @typescript-eslint/no-explicit-any -- Supabase joins are runtime-shaped. */
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SiteShell } from "@/components/SiteShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyBooking } from "@/lib/account.functions";
import { downloadBookingSlip } from "@/lib/booking-slip";
import { resolveTourImage } from "@/lib/tour-images";
import { btnGhost, btnSmall, inr } from "@/lib/ui";

export const Route = createFileRoute("/_authenticated/my-account/bookings/$bookingId")({
  component: BookingDetailPage,
  head: () => ({
    meta: [
      { title: "Booking details | Ram Adventure" },
      { name: "description", content: "Full details of your Ram Adventure booking." },
      { property: "og:title", content: "Booking details | Ram Adventure" },
      { property: "og:description", content: "Your trip, pickup and payment details." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 border-b border-white/10 py-3">
      <dt className="text-mist/55">{label}</dt>
      <dd className="text-right text-mist">{value}</dd>
    </div>
  );
}

function BookingDetailPage() {
  const { bookingId } = Route.useParams();
  const fetchBooking = useServerFn(getMyBooking);
  const query = useQuery({
    queryKey: ["my-booking", bookingId],
    queryFn: () => fetchBooking({ data: { bookingId } }),
  });

  const b = query.data as any;

  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-6 pt-32 pb-24">
        {query.isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : !b ? (
          <div className="rounded-sm border border-white/10 bg-forest-deep/40 p-10 text-center">
            <p className="text-mist/75">We could not find that booking.</p>
            <Link to="/my-account/bookings" className={`${btnGhost} mt-6`}>
              Back to my bookings
            </Link>
          </div>
        ) : (
          <>
            <div className="relative overflow-hidden rounded-sm border border-white/10">
              <img
                src={resolveTourImage(b.tours?.images?.[0])}
                alt={b.tours?.title ?? "Tour"}
                className="h-56 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
              <div className="absolute bottom-5 left-6 flex items-center gap-4">
                <BrandLogo size={54} />
                <div>
                  <p className="text-[0.6rem] tracking-[0.24em] text-sand uppercase">
                    {b.booking_id}
                  </p>
                  <p className="font-display text-3xl text-mist">{b.tours?.title}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <StatusBadge value={b.payment_status} kind="payment" />
              <StatusBadge value={b.booking_status} />
            </div>

            <dl className="mt-8 text-sm">
              <Row label="Adventure" value={b.tours?.title ?? "-"} />
              <Row label="Location" value={b.tours?.location ?? "Munnar, Kerala"} />
              <Row label="Duration" value={b.tours?.duration ?? "-"} />
              <Row label="Date" value={b.booking_date} />
              <Row label="Time" value={b.time_slot} />
              <Row label="Guests" value={String(b.guests)} />
              <Row label="Vehicle" value={b.vehicle || b.tours?.vehicle || "-"} />
              <Row label="Pickup" value={b.pickup_location || "-"} />
              <Row label="Special request" value={b.special_request || "-"} />
              <Row label="Guest name" value={b.customer_name} />
              <Row label="Email" value={b.customer_email} />
              <Row label="Phone" value={b.customer_phone || "-"} />
              <Row label="Booked on" value={new Date(b.created_at).toLocaleString()} />
              <div className="flex justify-between gap-6 py-4">
                <dt className="text-mist/55">Amount</dt>
                <dd className="font-display text-3xl text-sand">
                  {b.total_amount ? inr(b.total_amount) : "Quote on call"}
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-2">
              <button type="button" className={btnSmall} onClick={() => downloadBookingSlip(b)}>
                Download booking
              </button>
              <Link to="/my-account/bookings" className={btnSmall}>
                All bookings
              </Link>
            </div>
          </>
        )}
      </section>
    </SiteShell>
  );
}
