/* eslint-disable @typescript-eslint/no-explicit-any -- Supabase joins are runtime-shaped. */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { SiteShell } from "@/components/SiteShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { cancelMyBooking, listMyBookings } from "@/lib/account.functions";
import { resolveTourImage } from "@/lib/tour-images";
import { btnGhost, btnPrimary, btnSmall, inr } from "@/lib/ui";
import { downloadBookingSlip } from "@/lib/booking-slip";

export default function MyBookingsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      let data = await listMyBookings();
      try {
        const localRaw = localStorage.getItem("my_bookings");
        if (localRaw) {
          const localBookings = JSON.parse(localRaw);
          if (Array.isArray(localBookings) && localBookings.length > 0) {
            const serverIds = new Set(data.map((b: any) => b.booking_id));
            const newFromLocal = localBookings.filter((b: any) => !serverIds.has(b.booking_id));
            data = [...newFromLocal, ...data];
          }
        }
      } catch (err) {
        console.warn("Notice: local my_bookings parsing error:", err);
      }
      setRows(data);
    } catch (e) {
      console.warn("Notice: listMyBookings error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "My bookings | Ram Adventure";
    loadData();
  }, []);

  const handleCancel = async (bookingId: string) => {
    setCancelling(true);
    try {
      await cancelMyBooking({ bookingId });
      toast.success("Booking cancelled.");
      setConfirming(null);
      await loadData();
    } catch (e: any) {
      toast.error(e?.message || "Cancellation failed.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-6 pt-32 pb-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Your bookings</p>
            <h1 className="mt-2 font-display text-[clamp(2.2rem,6vw,4rem)] text-mist">
              My booked trails
            </h1>
          </div>
          <Link to="/book" className={btnPrimary}>
            Book new trail
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 space-y-4">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        ) : rows.length === 0 ? (
          <div className="mt-10 rounded-sm border border-white/10 bg-forest-deep/40 p-12 text-center">
            <p className="font-display text-2xl text-mist">No bookings found</p>
            <p className="mt-2 text-sm text-mist/65">You have not booked any safaris or tours yet.</p>
            <Link to="/tours" className={`${btnPrimary} mt-6`}>
              Browse tours
            </Link>
          </div>
        ) : (
          <ul className="mt-10 space-y-4">
            {rows.map((b) => (
              <li
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-6 rounded-sm border border-white/10 bg-forest-deep/55 p-6"
              >
                <div className="flex flex-wrap items-center gap-5">
                  <img
                    src={resolveTourImage(b.tours?.images?.[0])}
                    alt={b.tours?.title ?? "Tour"}
                    loading="lazy"
                    className="h-20 w-28 rounded-sm object-cover"
                  />
                  <div>
                    <p className="text-[0.62rem] font-bold tracking-[0.2em] text-sand uppercase">
                      {b.booking_id}
                    </p>
                    <p className="font-display text-2xl text-mist">{b.tours?.title}</p>
                    <p className="mt-1 text-sm text-mist/70">
                      {b.booking_date} · {b.time_slot} · {b.guests} guests · {b.pickup_location}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center">
                  <div className="text-right sm:mr-4">
                    <p className="font-display text-2xl text-sand">
                      {b.total_amount ? inr(b.total_amount) : "On call"}
                    </p>
                    <div className="mt-1 flex gap-2 justify-end">
                      <StatusBadge value={b.payment_status} kind="payment" />
                      <StatusBadge value={b.booking_status} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/my-account/bookings/${b.booking_id}`}
                      className={`${btnGhost} px-4 py-2 text-xs`}
                    >
                      Details
                    </Link>
                    <button
                      type="button"
                      onClick={() => downloadBookingSlip(b)}
                      className={`${btnGhost} px-4 py-2 text-xs`}
                    >
                      Receipt
                    </button>
                    {b.booking_status !== "cancelled" && (
                      <button
                        type="button"
                        onClick={() => setConfirming(b.booking_id)}
                        className={`${btnSmall} bg-destructive/20 text-destructive border-destructive/40 hover:bg-destructive/40`}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Cancellation confirmation modal */}
        {confirming && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4">
            <div className="max-w-md rounded-sm border border-white/10 bg-forest-deep p-6 text-center">
              <h3 className="font-display text-2xl text-mist">Cancel this booking?</h3>
              <p className="mt-2 text-sm text-mist/70">
                Are you sure you want to cancel booking <strong className="text-sand">{confirming}</strong>?
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setConfirming(null)}
                  className={btnGhost}
                  disabled={cancelling}
                >
                  Keep booking
                </button>
                <button
                  type="button"
                  onClick={() => handleCancel(confirming)}
                  disabled={cancelling}
                  className={`${btnPrimary} bg-destructive hover:bg-destructive/80`}
                >
                  {cancelling ? "Cancelling…" : "Yes, cancel"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
