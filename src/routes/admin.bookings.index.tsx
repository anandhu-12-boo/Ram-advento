/* eslint-disable @typescript-eslint/no-explicit-any -- Supabase joins are runtime-shaped. */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { AdminLayout, adminCard, adminLabel } from "@/components/admin/AdminLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { listAdminBookings, updateBookingStatus } from "@/lib/admin.functions";
import { inr } from "@/lib/ui";

export const Route = createFileRoute("/admin/bookings/")({
  component: AdminBookings,
  head: () => ({
    meta: [{ title: "Bookings | Admin | Ram Adventure" }, { name: "robots", content: "noindex" }],
  }),
});

const transitions: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "rescheduled", "cancelled"],
  rescheduled: ["confirmed", "cancelled"],
  completed: [],
  cancelled: [],
};

function AdminBookings() {
  const fetchBookings = useServerFn(listAdminBookings);
  const mutateStatus = useServerFn(updateBookingStatus);
  const queryClient = useQueryClient();
  const bookings = useQuery({ queryKey: ["admin-bookings"], queryFn: () => fetchBookings() });
  const status = useMutation({
    mutationFn: (input: { bookingId: string; bookingStatus: string }) => mutateStatus(input),
    onSuccess: async () => {
      toast.success("Booking status updated successfully.");
      await queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (error: Error) => toast.error(error.message || "Could not update booking status."),
  });

  return (
    <AdminLayout>
      <div>
        <p className="eyebrow">Operations / reservations</p>
        <h1 className="mt-2 font-display text-[clamp(2.2rem,5vw,4rem)] text-mist">Bookings.</h1>
        <p className="mt-2 text-sm text-mist/60">
          Every status change is validated and persisted server-side before this list refreshes.
        </p>
      </div>
      <div className={`${adminCard} mt-10 overflow-hidden p-0`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="border-b border-white/10 bg-black/10">
              <tr>
                {[
                  "Booking",
                  "Customer",
                  "Tour",
                  "Date",
                  "Guests",
                  "Amount",
                  "Payment",
                  "Status",
                  "Action",
                ].map((heading) => (
                  <th key={heading} className={`${adminLabel} px-5 py-4`}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {(bookings.data ?? []).map((booking: any) => {
                const options = transitions[booking.booking_status] ?? [];
                return (
                  <tr key={booking.id} className="align-top">
                    <td className="px-5 py-4">
                      <Link
                        to="/admin/bookings/$bookingId"
                        params={{ bookingId: booking.booking_id }}
                        className="font-semibold text-sand hover:text-mist"
                      >
                        {booking.booking_id}
                      </Link>
                      <p className="mt-1 text-xs text-mist/45">
                        {new Date(booking.created_at).toLocaleDateString("en-IN")}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-mist">
                      {booking.customer_name}
                      <p className="text-xs text-mist/45">{booking.customer_email}</p>
                    </td>
                    <td className="px-5 py-4 text-mist/75">{booking.tours?.title ?? "—"}</td>
                    <td className="px-5 py-4 text-mist/75">
                      {booking.booking_date}
                      <p className="text-xs text-mist/45">{booking.time_slot}</p>
                    </td>
                    <td className="px-5 py-4 text-mist/75">{booking.guests}</td>
                    <td className="px-5 py-4 text-sand">{inr(booking.total_amount ?? 0)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge value={booking.payment_status} kind="payment" />
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge value={booking.booking_status} />
                    </td>
                    <td className="px-5 py-4">
                      {options.length ? (
                        <select
                          aria-label={`Update ${booking.booking_id}`}
                          value=""
                          disabled={status.isPending}
                          onChange={(e) => {
                            if (e.target.value)
                              status.mutate({
                                bookingId: booking.booking_id,
                                bookingStatus: e.target.value,
                              });
                          }}
                          className="rounded-sm border border-white/15 bg-ink px-2 py-2 text-xs text-mist"
                        >
                          <option value="">Update</option>
                          {options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-xs text-mist/35">Final</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!bookings.isLoading && !(bookings.data ?? []).length && (
          <p className="p-8 text-center text-sm text-mist/55">No bookings yet.</p>
        )}
      </div>
    </AdminLayout>
  );
}
