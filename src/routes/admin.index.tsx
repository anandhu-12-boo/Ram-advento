/* eslint-disable @typescript-eslint/no-explicit-any -- Supabase joins are runtime-shaped. */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, CheckCircle2, Clock3, DollarSign, Map, Users, XCircle } from "lucide-react";
import { AdminLayout, adminCard, adminLabel } from "@/components/admin/AdminLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { getAdminOverview } from "@/lib/admin.functions";
import { inr } from "@/lib/ui";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Admin dashboard | Ram Adventure";
    getAdminOverview()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Notice: error loading admin overview:", err);
        setLoading(false);
      });
  }, []);

  const stats = data?.stats;
  const cards = [
    ["Total bookings", stats?.totalBookings ?? 0, CalendarCheck],
    ["Today's bookings", stats?.todayBookings ?? 0, Clock3],
    ["Pending", stats?.pending ?? 0, Clock3],
    ["Confirmed", stats?.confirmed ?? 0, CheckCircle2],
    ["Completed", stats?.completed ?? 0, CheckCircle2],
    ["Cancelled", stats?.cancelled ?? 0, XCircle],
    ["Customers", stats?.totalCustomers ?? 0, Users],
    ["Tours", stats?.totalTours ?? 0, Map],
    ["Total revenue", inr(stats?.totalRevenue ?? 0), DollarSign],
  ] as const;

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Ram Adventure / control room</p>
          <h1 className="mt-2 font-display text-[clamp(2.2rem,5vw,4rem)] text-mist">
            Good morning.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-mist/60">
            Live booking, customer and revenue signals from the connected data store.
          </p>
        </div>
        <Link
          to="/admin/bookings"
          className="rounded-sm bg-sand px-5 py-3 text-xs font-bold tracking-[0.16em] text-forest-deep uppercase hover:bg-mist"
        >
          Review bookings
        </Link>
      </div>
      <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([label, value, Icon]) => (
          <div key={label} className={adminCard}>
            <div className="flex items-center justify-between">
              <span className={adminLabel}>{label}</span>
              <Icon size={17} className="text-sand" />
            </div>
            <p className="mt-4 font-display text-3xl text-mist">
              {loading ? "—" : value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className={adminCard}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className={adminLabel}>Latest activity</p>
              <h2 className="mt-2 font-display text-2xl text-mist">Recent bookings</h2>
            </div>
            <Link
              to="/admin/bookings"
              className="text-xs font-bold tracking-[0.15em] text-sand uppercase hover:text-mist"
            >
              View all
            </Link>
          </div>
          <div className="mt-6 divide-y divide-white/10">
            {(data?.recent ?? []).map((booking: any) => (
              <div
                key={booking.id}
                className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="text-[0.6rem] tracking-[0.18em] text-sand uppercase">
                    {booking.booking_id}
                  </p>
                  <p className="mt-1 text-sm text-mist">
                    {booking.customer_name} · {booking.tours?.title ?? "Adventure"}
                  </p>
                  <p className="mt-1 text-xs text-mist/50">
                    {booking.booking_date} · {booking.guests} guests
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-mist/70">{inr(booking.total_amount ?? 0)}</span>
                  <StatusBadge value={booking.booking_status} />
                </div>
              </div>
            ))}
            {!loading && !(data?.recent ?? []).length && (
              <p className="py-6 text-sm text-mist/55">No bookings have arrived yet.</p>
            )}
          </div>
        </div>
        <div className={adminCard}>
          <p className={adminLabel}>Revenue pulse</p>
          <h2 className="mt-2 font-display text-2xl text-mist">Collected revenue</h2>
          <div className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between border-b border-white/10 pb-3">
              <span className="text-mist/55">Today</span>
              <span className="text-sand">{inr(stats?.revenueToday ?? 0)}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-3">
              <span className="text-mist/55">This week</span>
              <span className="text-sand">{inr(stats?.revenueWeek ?? 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mist/55">This month</span>
              <span className="text-sand">{inr(stats?.revenueMonth ?? 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
