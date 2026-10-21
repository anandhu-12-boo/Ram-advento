import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  Map,
  Users,
  BarChart3,
  MessageSquare,
  Mail,
  LogOut,
  KeyRound,
} from "lucide-react";
import { useEffect } from "react";
import { SiteShell } from "@/components/SiteShell";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const links = [
  ["Dashboard", "/admin", LayoutDashboard],
  ["Bookings", "/admin/bookings", CalendarCheck],
  ["Tours", "/admin/tours", Map],
  ["Availability", "/admin/availability", CalendarCheck],
  ["Customers", "/admin/customers", Users],
  ["Revenue", "/admin/revenue", BarChart3],
  ["Reviews", "/admin/reviews", MessageSquare],
  ["Enquiries", "/admin/enquiries", Mail],
  ["Settings", "/admin/settings", KeyRound],
] as const;

export function AdminLayout({ children }: { children: ReactNode }) {
  const { loading, isAdmin, displayName } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/login?redirect=/admin", { replace: true });
    }
  }, [isAdmin, loading, navigate]);

  if (loading || !isAdmin) {
    return (
      <SiteShell hideFooter hideMobileBookingBar>
        <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6 pt-24 text-center">
          <div>
            <BrandLogo size={82} priority />
            <p className="eyebrow mt-6">Checking access</p>
            <h1 className="mt-3 font-display text-3xl text-mist">Preparing the control room…</h1>
          </div>
        </section>
      </SiteShell>
    );
  }

  const signOut = async () => {
    localStorage.removeItem("admin_session");
    localStorage.removeItem("user_session");
    localStorage.removeItem("user_token");
    try {
      await supabase.auth.signOut();
    } catch {
      // Supabase optional
    }
    navigate("/login", { replace: true });
  };

  return (
    <SiteShell hideFooter hideMobileBookingBar>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pt-32 pb-24 sm:px-6 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-sm border border-white/10 bg-forest-deep/60 p-5 lg:sticky lg:top-28">
          <div className="flex items-center gap-3 border-b border-white/10 pb-5">
            <BrandLogo size={46} priority />
            <div>
              <p className="font-display text-lg text-mist">Ram Adventure</p>
              <p className="text-[0.6rem] font-bold tracking-[0.18em] text-sand uppercase">
                Admin console
              </p>
            </div>
          </div>
          <nav className="mt-5 space-y-1" aria-label="Admin navigation">
            {links.map(([label, to, Icon]) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-mist/65 transition-colors hover:bg-sand/10 hover:text-sand"
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="truncate text-xs text-mist/55">Signed in as {displayName}</p>
            <button
              type="button"
              onClick={signOut}
              className="mt-4 flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-mist/60 uppercase hover:text-sand"
            >
              <LogOut size={14} /> Log out
            </button>
          </div>
        </aside>
        <div className="min-w-0">{children}</div>
      </section>
    </SiteShell>
  );
}

export const adminCard = "rounded-sm border border-white/10 bg-forest-deep/55 p-5";
export const adminLabel = "text-[0.62rem] font-bold tracking-[0.18em] text-mist/50 uppercase";
export const adminInput =
  "w-full rounded-sm border border-white/15 bg-ink/60 px-3 py-2.5 text-sm text-mist outline-none focus:border-sand";
