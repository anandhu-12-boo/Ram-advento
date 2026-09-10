import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", to: "/" },
  { label: "Jeep Safari", to: "/safari" },
  { label: "Tours", to: "/tours" },
  { label: "Packages", to: "/tours", hash: "packages" },
  { label: "Gallery", to: "/gallery" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

function AccountLinks({ stacked = false }: { stacked?: boolean }) {
  const { user, isAdmin, displayName } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  };

  const cls = stacked
    ? "block border-b border-white/5 py-3 font-display text-2xl text-mist"
    : "text-[0.78rem] font-semibold tracking-[0.16em] text-mist/80 uppercase transition-colors hover:text-sand";

  if (!user) {
    return (
      <Link to="/login" className={cls}>
        Login
      </Link>
    );
  }

  return (
    <>
      {!stacked && (
        <span className="text-[0.78rem] font-semibold tracking-[0.16em] text-sand/80 uppercase">
          {displayName}
        </span>
      )}
      <Link to="/my-account/bookings" className={cls}>
        My bookings
      </Link>
      {isAdmin && (
        <Link to="/my-account" className={cls}>
          My account
        </Link>
      )}
      <button type="button" onClick={signOut} className={cls}>
        Logout
      </button>
    </>
  );
}


export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "glass-dark border-b border-white/10 py-2" : "py-4",
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6" aria-label="Main">
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group flex items-center gap-3 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-sand"
        >
          <BrandLogo interactive priority size={scrolled ? 42 : 54} />
          <span className="hidden leading-none sm:block">
            <span className="font-display block text-xl tracking-wide text-mist">RAM ADVENTURE</span>
            <span className="block text-[0.6rem] font-semibold tracking-[0.28em] text-sand/80">
              MUNNAR • KERALA
            </span>
          </span>
        </Link>

        <ul className="ml-auto hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                to={l.to}
                {...(("hash" in l && l.hash) ? { hash: l.hash } : {})}
                className="relative text-[0.78rem] font-semibold tracking-[0.16em] text-mist/80 uppercase transition-colors hover:text-sand after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-sand after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto hidden shrink-0 items-center gap-5 lg:ml-6 lg:flex">
          <AccountLinks />
          <Link
            to="/book"
            className="rounded-sm bg-sand px-5 py-2.5 text-[0.72rem] font-bold tracking-[0.2em] text-forest-deep uppercase transition-all duration-300 hover:bg-mist"
          >
            Book Now
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="ml-auto rounded-sm border border-white/15 p-2.5 text-mist transition-colors hover:border-sand hover:text-sand lg:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="glass-dark overflow-hidden lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 py-4">
              {links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    {...(("hash" in l && l.hash) ? { hash: l.hash } : {})}
                    className="block border-b border-white/5 py-3 font-display text-2xl text-mist"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function MobileBookingBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 glass-dark p-3 lg:hidden">
      <Link
        to="/book"
        className="block rounded-sm bg-sand py-3 text-center text-[0.75rem] font-bold tracking-[0.22em] text-forest-deep uppercase"
      >
        Book your adventure
      </Link>
    </div>
  );
}
