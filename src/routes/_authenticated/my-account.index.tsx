import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CalendarCheck, CheckCircle2, XCircle, Ticket } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { listMyBookings } from "@/lib/account.functions";
import { resolveTourImage } from "@/lib/tour-images";
import { btnGhost, btnPrimary, inr } from "@/lib/ui";

export const Route = createFileRoute("/_authenticated/my-account/")({
  component: MyAccountPage,
  head: () => ({
    meta: [
      { title: "My account | Ram Adventure" },
      { name: "description", content: "Your Ram Adventure trips, bookings and trip status." },
      { property: "og:title", content: "My account | Ram Adventure" },
      { property: "og:description", content: "Track your Munnar adventures." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function MyAccountPage() {
  const { displayName } = useAuth();
  const fetchBookings = useServerFn(listMyBookings);
  const bookings = useQuery({ queryKey: ["my-bookings"], queryFn: () => fetchBookings() });

  const rows = (bookings.data ?? []) as any[];
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = rows.filter(
    (b) => b.booking_date >= today && !["cancelled", "completed"].includes(b.booking_status),
  );
  const completed = rows.filter((b) => b.booking_status === "completed");
  const cancelled = rows.filter((b) => b.booking_status === "cancelled");

  const stats = [
    { label: "Total bookings", value: rows.length, icon: Ticket },
    { label: "Upcoming trips", value: upcoming.length, icon: CalendarCheck },
    { label: "Completed trips", value: completed.length, icon: CheckCircle2 },
    { label: "Cancelled", value: cancelled.length, icon: XCircle },
  ];

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-6 pt-32 pb-24">
        <p className="eyebrow">Your trail log</p>
        <h1 className="mt-3 font-display text-[clamp(2.2rem,6vw,4rem)] text-mist">
          Welcome, {displayName}
        </h1>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-sm border border-white/10 bg-forest-deep/50 p-6">
              <s.icon size={20} className="text-sand" />
              <p className="mt-4 font-display text-4xl text-mist">
                {bookings.isLoading ? <Skeleton className="h-9 w-12" /> : s.value}
              </p>
              <p className="mt-1 text-[0.62rem] font-semibold tracking-[0.2em] text-mist/55 uppercase">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-3xl text-mist">Upcoming adventures</h2>
          <Link to="/my-account/bookings" className={btnGhost}>
            All bookings
          </Link>
        </div>

        {bookings.isLoading ? (
          <div className="mt-6 space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : upcoming.length === 0 ? (
          <div className="mt-6 rounded-sm border border-white/10 bg-forest-deep/40 p-8 text-center">
            <p className="text-mist/75">No upcoming trips yet.</p>
            <Link to="/tours" className={`${btnPrimary} mt-6`}>
              Browse adventures
            </Link>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {upcoming.map((b) => (
              <li key={b.id}>
                <Link
                  to="/my-account/bookings/$bookingId"
                  params={{ bookingId: b.booking_id }}
                  className="flex flex-wrap items-center gap-5 rounded-sm border border-white/10 bg-forest-deep/50 p-4 transition-colors hover:border-sand/60"
                >
                  <img
                    src={resolveTourImage(b.tours?.images?.[0])}
                    alt={b.tours?.title ?? "Tour"}
                    loading="lazy"
                    className="h-20 w-28 rounded-sm object-cover"
                  />
                  <div className="min-w-40 flex-1">
                    <p className="text-[0.6rem] tracking-[0.2em] text-sand uppercase">{b.booking_id}</p>
                    <p className="font-display text-2xl text-mist">{b.tours?.title}</p>
                    <p className="text-sm text-mist/60">
                      {b.booking_date} · {b.time_slot} · {b.guests} guests
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-display text-2xl text-sand">
                      {b.total_amount ? inr(b.total_amount) : "On call"}
                    </span>
                    <div className="flex gap-2">
                      <StatusBadge value={b.payment_status} kind="payment" />
                      <StatusBadge value={b.booking_status} />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </SiteShell>
  );
}
