/* eslint-disable @typescript-eslint/no-explicit-any -- Supabase joins are runtime-shaped. */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { AdminLayout, adminCard, adminLabel } from "@/components/admin/AdminLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { getAdminBooking, updateBookingStatus } from "@/lib/admin.functions";
import { inr } from "@/lib/ui";

export const Route = createFileRoute("/admin/bookings/$bookingId")({
  component: AdminBookingDetail,
  head: () => ({
    meta: [
      { title: "Booking detail | Admin | Ram Adventure" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function AdminBookingDetail() {
  const { bookingId } = Route.useParams();
  const fetchBooking = useServerFn(getAdminBooking);
  const changeStatus = useServerFn(updateBookingStatus);
  const queryClient = useQueryClient();
  const booking = useQuery({
    queryKey: ["admin-booking", bookingId],
    queryFn: () => fetchBooking({ data: { bookingId } }),
  });
  const mutation = useMutation({
    mutationFn: (bookingStatus: string) => changeStatus({ data: { bookingId, bookingStatus } }),
    onSuccess: async () => {
      toast.success("Booking status updated successfully.");
      await queryClient.invalidateQueries({ queryKey: ["admin-booking", bookingId] });
      await queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
  const row: any = booking.data;

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
      {booking.isLoading ? (
        <p className="mt-10 text-mist/60">Loading booking…</p>
      ) : !row ? (
        <p className="mt-10 text-mist/60">Booking not found.</p>
      ) : (
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className={adminCard}>
            <p className={adminLabel}>Customer</p>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-mist/50">Name</dt>
                <dd className="text-right text-mist">{row.customer_name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-mist/50">Email</dt>
                <dd className="text-right text-mist">{row.customer_email}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-mist/50">Phone</dt>
                <dd className="text-right text-mist">{row.customer_phone}</dd>
              </div>
            </dl>
          </div>
          <div className={adminCard}>
            <p className={adminLabel}>Adventure</p>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-mist/50">Tour</dt>
                <dd className="text-right text-mist">{row.tours?.title ?? "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-mist/50">Date / time</dt>
                <dd className="text-right text-mist">
                  {row.booking_date} · {row.time_slot}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-mist/50">Guests</dt>
                <dd className="text-right text-mist">{row.guests}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-mist/50">Vehicle</dt>
                <dd className="text-right text-mist">{row.vehicle}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-mist/50">Pickup</dt>
                <dd className="text-right text-mist">{row.pickup_location}</dd>
              </div>
            </dl>
          </div>
          <div className={adminCard}>
            <p className={adminLabel}>Payment</p>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-mist/50">Amount</dt>
                <dd className="text-right text-sand">{inr(row.total_amount ?? 0)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-mist/50">Payment status</dt>
                <dd>
                  <StatusBadge value={row.payment_status} kind="payment" />
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-mist/50">Payment ID</dt>
                <dd className="text-right text-mist">{row.payment_id ?? "Pending"}</dd>
              </div>
            </dl>
          </div>
          <div className={adminCard}>
            <p className={adminLabel}>Workflow</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["pending", "confirmed", "completed", "rescheduled", "cancelled"].map((option) => (
                <button
                  key={option}
                  type="button"
                  disabled={mutation.isPending || option === row.booking_status}
                  onClick={() => mutation.mutate(option)}
                  className={`rounded-sm border px-3 py-2 text-xs font-bold tracking-[0.12em] uppercase transition-colors ${option === row.booking_status ? "border-sand bg-sand text-forest-deep" : "border-white/15 text-mist/65 hover:border-sand hover:text-sand"}`}
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="mt-5 text-xs text-mist/45">
              Created {new Date(row.created_at).toLocaleString("en-IN")} · Updated{" "}
              {new Date(row.updated_at).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
