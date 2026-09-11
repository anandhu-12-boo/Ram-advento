/* eslint-disable @typescript-eslint/no-explicit-any -- Supabase result rows are runtime-shaped. */
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AdminLayout, adminCard, adminLabel } from "@/components/admin/AdminLayout";
import {
  getAdminOverview,
  listAdminTours,
  listAvailability,
  listCustomers,
  listAdminReviews,
  listEnquiries,
} from "@/lib/admin.functions";
import { inr } from "@/lib/ui";

export type AdminResource =
  "tours" | "availability" | "customers" | "revenue" | "reviews" | "enquiries";

export function AdminResourcePage({
  resource,
  title,
  description,
}: {
  resource: AdminResource;
  title: string;
  description: string;
}) {
  const overviewFn = useServerFn(getAdminOverview);
  const toursFn = useServerFn(listAdminTours);
  const availabilityFn = useServerFn(listAvailability);
  const customersFn = useServerFn(listCustomers);
  const reviewsFn = useServerFn(listAdminReviews);
  const enquiriesFn = useServerFn(listEnquiries);
  const query = useQuery({
    queryKey: ["admin-resource", resource],
    queryFn: () =>
      ({
        tours: toursFn,
        availability: availabilityFn,
        customers: customersFn,
        revenue: overviewFn,
        reviews: reviewsFn,
        enquiries: enquiriesFn,
      })[resource](),
  });
  const rows: any = query.data;

  return (
    <AdminLayout>
      <p className="eyebrow">Operations / live data</p>
      <h1 className="mt-2 font-display text-[clamp(2.2rem,5vw,4rem)] text-mist">{title}.</h1>
      <p className="mt-2 max-w-2xl text-sm text-mist/60">{description}</p>
      {query.isError && (
        <p className="mt-8 rounded-sm border border-red-300/20 bg-red-950/30 p-4 text-sm text-red-100">
          Could not load this module. Check your admin session and database connection.
        </p>
      )}
      <div className="mt-10 grid gap-4">
        {resource === "revenue" ? (
          <Revenue data={rows} />
        ) : (
          <Rows resource={resource} data={rows} />
        )}
      </div>
    </AdminLayout>
  );
}

function Revenue({ data }: { data: any }) {
  const s = data?.stats;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[
        ["Today", s?.revenueToday],
        ["This week", s?.revenueWeek],
        ["This month", s?.revenueMonth],
        ["Total", s?.totalRevenue],
      ].map(([label, value]) => (
        <div key={label} className={adminCard}>
          <p className={adminLabel}>{label} revenue</p>
          <p className="mt-4 font-display text-3xl text-sand">{inr(value ?? 0)}</p>
        </div>
      ))}
    </div>
  );
}

function Rows({ resource, data }: { resource: AdminResource; data: any }) {
  const rows = Array.isArray(data) ? data : [];
  return (
    <div className={`${adminCard} overflow-x-auto p-0`}>
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-white/10">
          <tr>
            {(resource === "tours"
              ? ["Tour", "Location", "Price", "Guests", "Live"]
              : resource === "availability"
                ? ["Tour", "Date", "Time", "Total", "Booked", "Available"]
                : resource === "customers"
                  ? ["Customer", "Email", "Bookings", "Completed", "Spent"]
                  : resource === "reviews"
                    ? ["Author", "Tour", "Rating", "Approved", "Date"]
                    : ["Name", "Email", "Message", "Status", "Date"]
            ).map((h) => (
              <th key={h} className={`${adminLabel} px-5 py-4`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {rows.map((row: any) => (
            <tr key={row.id} className="text-mist/75">
              {resource === "tours" && (
                <>
                  <td className="px-5 py-4 text-mist">{row.title}</td>
                  <td className="px-5 py-4">{row.location}</td>
                  <td className="px-5 py-4 text-sand">{inr(row.price ?? 0)}</td>
                  <td className="px-5 py-4">{row.max_guests}</td>
                  <td className="px-5 py-4">{row.available ? "Active" : "Paused"}</td>
                </>
              )}
              {resource === "availability" && (
                <>
                  <td className="px-5 py-4 text-mist">{row.tours?.title ?? "—"}</td>
                  <td className="px-5 py-4">{row.date}</td>
                  <td className="px-5 py-4">{row.time_slot}</td>
                  <td className="px-5 py-4">{row.total_slots}</td>
                  <td className="px-5 py-4">{row.booked_slots}</td>
                  <td className="px-5 py-4 text-sand">{row.available_slots}</td>
                </>
              )}
              {resource === "customers" && (
                <>
                  <td className="px-5 py-4 text-mist">{row.name}</td>
                  <td className="px-5 py-4">{row.email}</td>
                  <td className="px-5 py-4">{row.totalBookings}</td>
                  <td className="px-5 py-4">{row.completed}</td>
                  <td className="px-5 py-4 text-sand">{inr(row.totalSpent ?? 0)}</td>
                </>
              )}
              {resource === "reviews" && (
                <>
                  <td className="px-5 py-4 text-mist">{row.author_name}</td>
                  <td className="px-5 py-4">{row.tours?.title ?? "—"}</td>
                  <td className="px-5 py-4 text-sand">{row.rating}/5</td>
                  <td className="px-5 py-4">{row.approved ? "Approved" : "Pending"}</td>
                  <td className="px-5 py-4">
                    {new Date(row.created_at).toLocaleDateString("en-IN")}
                  </td>
                </>
              )}
              {resource === "enquiries" && (
                <>
                  <td className="px-5 py-4 text-mist">{row.name}</td>
                  <td className="px-5 py-4">{row.email}</td>
                  <td className="max-w-sm px-5 py-4">{row.message}</td>
                  <td className="px-5 py-4">{row.status}</td>
                  <td className="px-5 py-4">
                    {new Date(row.created_at).toLocaleDateString("en-IN")}
                  </td>
                </>
              )}
            </tr>
          ))}{" "}
        </tbody>
      </table>
      {!queryLength(rows) && (
        <p className="p-8 text-center text-sm text-mist/55">No records yet.</p>
      )}
    </div>
  );
}
function queryLength(data: any) {
  return Array.isArray(data) ? data.length : 0;
}
