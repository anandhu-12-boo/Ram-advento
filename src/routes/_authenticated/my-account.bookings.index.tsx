import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { SiteShell } from "@/components/SiteShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { cancelMyBooking, listMyBookings } from "@/lib/account.functions";
import { resolveTourImage } from "@/lib/tour-images";
import { btnGhost, btnPrimary, btnSmall, inr } from "@/lib/ui";
import { downloadBookingSlip } from "@/lib/booking-slip";

export const Route = createFileRoute("/_authenticated/my-account/bookings/")({
  component: MyBookingsPage,
  head: () => ({
    meta: [
      { title: "My bookings | Ram Adventure" },
      { name: "description", content: "All your Ram Adventure bookings and their current status." },
      { property: "og:title", content: "My bookings | Ram Adventure" },
      { property: "og:description", content: "Track every Munnar trip you have booked." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function MyBookingsPage() {
  const queryClient = useQueryClient();
  const fetchBookings = useServerFn(listMyBookings);
  const cancelFn = useServerFn(cancelMyBooking);
  const [confirming, setConfirming] = useState<string | null>(null);

  const bookings = useQuery({ queryKey: ["my-bookings"], queryFn: () => fetchBookings() });

  const cancel = useMutation({
    mutationFn: (bookingId: string) => cancelFn({ data: { bookingId } }),
    onSuccess: async () => {
      toast.success("Booking cancelled.");
      setConfirming(null);
      await queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows = (bookings.data ?? []) as any[];

  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-6 pt-32 pb-24">
        <p className="eyebrow">Your bookings</p>
        <h1 className="mt-3 font-display text-[clamp(2.2rem,6vw,3.6rem)] text-mist">My bookings</h1>

        {bookings.isLoading ? (
          <div className="mt-10 space-y-3">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : rows.length === 0 ? (
          <div className="mt-10 rounded-sm border border-white/10 bg-forest-deep/40 p-10 text-center">
            <p className="text-mist/75">You have no bookings yet.</p>
            <Link to="/tours" className={`${btnPrimary} mt-6`}>
              Find an adventure
            </Link>
          </div>
        ) : (
          <ul className="mt-10 space-y-5">
            {rows.map((b) => (
              <li key={b.id} className="rounded-sm border border-white/10 bg-forest-deep/50 p-5">
                <div className="flex flex-wrap gap-5">
                  <img
                    src={resolveTourImage(b.tours?.images?.[0])}
                    alt={b.tours?.title ?? "Tour"}
                    loading="lazy"
                    className="h-28 w-40 rounded-sm object-cover"
                  />
                  <div className="min-w-48 flex-1">
                    <p className="text-[0.6rem] tracking-[0.2em] text-sand uppercase">{b.booking_id}</p>
                    <p className="font-display text-2xl text-mist">{b.tours?.title}</p>
                    <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm text-mist/70 sm:grid-cols-2">
                      <div>Date: {b.booking_date}</div>
                      <div>Time: {b.time_slot}</div>
                      <div>Guests: {b.guests}</div>
                      <div>Vehicle: {b.vehicle || b.tours?.vehicle}</div>
                      <div className="sm:col-span-2">Pickup: {b.pickup_location}</div>
                    </dl>
                  </div>
                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    <span className="font-display text-3xl text-sand">
                      {b.total_amount ? inr(b.total_amount) : "Quote on call"}
                    </span>
                    <div className="flex gap-2">
                      <StatusBadge value={b.payment_status} kind="payment" />
                      <StatusBadge value={b.booking_status} />
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                  <Link
                    to="/my-account/bookings/$bookingId"
                    params={{ bookingId: b.booking_id }}
                    className={btnSmall}
                  >
                    View details
                  </Link>
                  <button type="button" className={btnSmall} onClick={() => downloadBookingSlip(b)}>
                    Download booking
                  </button>
                  {!["cancelled", "completed"].includes(b.booking_status) &&
                    (confirming === b.booking_id ? (
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-mist/70">Cancel this trip?</span>
                        <button
                          type="button"
                          disabled={cancel.isPending}
                          onClick={() => cancel.mutate(b.booking_id)}
                          className={`${btnSmall} border-red-400/50 text-red-200`}
                        >
                          {cancel.isPending ? "Cancelling…" : "Yes, cancel"}
                        </button>
                        <button type="button" onClick={() => setConfirming(null)} className={btnSmall}>
                          Keep it
                        </button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirming(b.booking_id)}
                        className={`${btnSmall} border-red-400/40 text-red-200`}
                      >
                        Cancel booking
                      </button>
                    ))}
                </div>
              </li>
            ))}
          </ul>
        )}

        <Link to="/my-account" className={`${btnGhost} mt-12`}>
          Back to account
        </Link>
      </section>
    </SiteShell>
  );
}
