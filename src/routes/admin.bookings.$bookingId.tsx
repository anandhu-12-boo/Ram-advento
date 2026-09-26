/* eslint-disable @typescript-eslint/no-explicit-any -- Supabase joins are runtime-shaped. */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { AdminLayout, adminCard, adminLabel } from "@/components/admin/AdminLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { getAdminBooking, updateBookingStatus } from "@/lib/admin.functions";
import { inr } from "@/lib/ui";

export default function AdminBookingDetailPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [row, setRow] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!bookingId) return;
    setLoading(true);
    try {
      const res = await getAdminBooking({ bookingId });
      setRow(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Booking detail | Admin | Ram Adventure";
    loadData();
  }, [bookingId]);

  const handleStatusChange = async (bookingStatus: string) => {
    if (!bookingId) return;
    try {
      await updateBookingStatus({ bookingId, bookingStatus });
      toast.success("Booking status updated successfully.");
      await loadData();
    } catch (e: any) {
      toast.error(e?.message || "Could not update status.");
    }
  };

  return (
    <AdminLayout>
      <Link
        to="/admin/bookings"
        className="text-xs font-bold tracking-[0.16em] text-sand uppercase hover:text-mist"
      >
        ← All bookings
      </Link>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Booking detail</p>
          <h1 className="mt-2 font-display text-[clamp(2.2rem,5vw,4rem)] text-mist">{bookingId}</h1>
        </div>
        {row && <StatusBadge value={row.booking_status} />}
      </div>
      {loading ? (
        <p className="mt-10 text-mist/60">Loading booking…</p>
      ) : !row ? (
        <p className="mt-10 text-mist/60">Booking not found.</p>
      ) : (
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className={`${adminCard} space-y-4`}>
            <h2 className="font-display text-2xl text-mist">Customer & Trip Information</h2>
            <dl className="divide-y divide-white/10 text-sm">
              <div className="flex justify-between py-3">
                <dt className={adminLabel}>Customer Name</dt>
                <dd className="text-mist">{row.customer_name}</dd>
              </div>
              <div className="flex justify-between py-3">
                <dt className={adminLabel}>Email</dt>
                <dd className="text-mist">{row.customer_email}</dd>
              </div>
              <div className="flex justify-between py-3">
                <dt className={adminLabel}>Phone</dt>
                <dd className="text-mist">{row.customer_phone || "—"}</dd>
              </div>
              <div className="flex justify-between py-3">
                <dt className={adminLabel}>Tour Package</dt>
                <dd className="text-mist">{row.tours?.title}</dd>
              </div>
              <div className="flex justify-between py-3">
                <dt className={adminLabel}>Booking Date</dt>
                <dd className="text-mist">{row.booking_date}</dd>
              </div>
              <div className="flex justify-between py-3">
                <dt className={adminLabel}>Time Slot</dt>
                <dd className="text-mist">{row.time_slot}</dd>
              </div>
              <div className="flex justify-between py-3">
                <dt className={adminLabel}>Guests</dt>
                <dd className="text-mist">{row.guests}</dd>
              </div>
              <div className="flex justify-between py-3">
                <dt className={adminLabel}>Vehicle</dt>
                <dd className="text-mist">{row.vehicle || "Standard Thar"}</dd>
              </div>
              <div className="flex justify-between py-3">
                <dt className={adminLabel}>Pickup Location</dt>
                <dd className="text-mist">{row.pickup_location || "Munnar Town"}</dd>
              </div>
              <div className="flex justify-between py-3 font-display text-xl text-sand">
                <dt>Total Amount</dt>
                <dd>{inr(row.total_amount ?? 0)}</dd>
              </div>
            </dl>
          </div>

          <div className="space-y-6">
            <div className={adminCard}>
              <p className={adminLabel}>Update Status</p>
              <div className="mt-4 flex flex-col gap-2">
                {["confirmed", "completed", "cancelled", "rescheduled"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(st)}
                    disabled={row.booking_status === st}
                    className="rounded-sm border border-white/15 py-2.5 text-xs font-bold tracking-widest text-mist uppercase transition-colors hover:border-sand hover:text-sand disabled:opacity-40"
                  >
                    Mark as {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
