/* eslint-disable @typescript-eslint/no-explicit-any -- Supabase joins are runtime-shaped. */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { AdminLayout, adminCard, adminLabel } from "@/components/admin/AdminLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { listAdminBookings, updateBookingStatus } from "@/lib/admin.functions";
import { inr } from "@/lib/ui";

const transitions: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "rescheduled", "cancelled"],
  rescheduled: ["confirmed", "cancelled"],
  completed: [],
  cancelled: [],
};

export default function AdminBookingsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      let data = await listAdminBookings();
      try {
        const localRaw = localStorage.getItem("my_bookings");
        if (localRaw) {
          const localBookings = JSON.parse(localRaw);
          if (Array.isArray(localBookings) && localBookings.length > 0) {
            const rowIds = new Set(data.map((b: any) => b.booking_id));
            const newFromLocal = localBookings.filter((b: any) => !rowIds.has(b.booking_id));
            data = [...newFromLocal, ...data];
          }
        }
      } catch (err) {
        console.warn("Notice: Local booking merge in admin panel skipped.", err);
      }
      setRows(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Bookings | Admin | Ram Adventure";
    loadData();
  }, []);

  const handleStatusChange = async (bookingId: string, bookingStatus: string) => {
    try {
      await updateBookingStatus({ bookingId, bookingStatus });
      toast.success("Booking status updated successfully.");
      await loadData();
    } catch (e: any) {
      toast.error(e?.message || "Could not update booking status.");
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Operations / Bookings</p>
          <h1 className="mt-2 font-display text-[clamp(2.2rem,5vw,4rem)] text-mist">
            Bookings desk.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-mist/60">
            Monitor, confirm, reschedule and complete customer adventure reservations.
          </p>
        </div>
      </div>

      <div className="mt-10 overflow-hidden rounded-sm border border-white/10 bg-forest-deep/50">
        {loading ? (
          <p className="p-8 text-center text-sm text-mist/60">Loading bookings…</p>
        ) : rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-mist/60">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-white/10 bg-forest-deep/80">
                <tr>
                  <th className={`${adminLabel} px-5 py-4`}>Booking ID</th>
                  <th className={`${adminLabel} px-5 py-4`}>Customer</th>
                  <th className={`${adminLabel} px-5 py-4`}>Tour</th>
                  <th className={`${adminLabel} px-5 py-4`}>Date & Time</th>
                  <th className={`${adminLabel} px-5 py-4`}>Guests</th>
                  <th className={`${adminLabel} px-5 py-4`}>Amount</th>
                  <th className={`${adminLabel} px-5 py-4`}>Status</th>
                  <th className={`${adminLabel} px-5 py-4`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {rows.map((b: any) => {
                  const allowed = transitions[b.booking_status] ?? [];
                  return (
                    <tr key={b.id} className="text-mist/75 hover:bg-white/5">
                      <td className="px-5 py-4 font-mono text-xs font-bold text-sand">
                        <Link to={`/admin/bookings/${b.booking_id}`} className="hover:underline">
                          {b.booking_id}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-mist">{b.customer_name}</p>
                        <p className="text-xs text-mist/50">{b.customer_email}</p>
                      </td>
                      <td className="px-5 py-4 text-mist">{b.tours?.title ?? "—"}</td>
                      <td className="px-5 py-4">
                        <p>{b.booking_date}</p>
                        <p className="text-xs text-mist/50">{b.time_slot}</p>
                      </td>
                      <td className="px-5 py-4">{b.guests}</td>
                      <td className="px-5 py-4 font-semibold text-sand">
                        {inr(b.total_amount ?? 0)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge value={b.booking_status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {allowed.map((nextStatus) => (
                            <button
                              key={nextStatus}
                              type="button"
                              onClick={() => handleStatusChange(b.booking_id, nextStatus)}
                              className="rounded-sm border border-white/15 px-2.5 py-1 text-[0.65rem] font-bold tracking-widest text-mist uppercase transition-colors hover:border-sand hover:text-sand"
                            >
                              Mark {nextStatus}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
