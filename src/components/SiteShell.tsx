import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { JeepScrollRail } from "@/components/JeepScrollRail";
import { MobileBookingBar, Navbar } from "@/components/Navbar";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-ink">
      <Navbar />
      <JeepScrollRail />
      <main>{children}</main>
      <Footer />
      <MobileBookingBar />
    </div>
  );
}
