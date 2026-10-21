import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { JeepScrollRail } from "@/components/JeepScrollRail";
import { MobileBookingBar, Navbar } from "@/components/Navbar";

export function SiteShell({
  children,
  hideFooter = false,
  hideMobileBookingBar = false,
}: {
  children: ReactNode;
  hideFooter?: boolean;
  hideMobileBookingBar?: boolean;
}) {
  return (
    <div className="min-h-dvh bg-ink">
      <Navbar />
      <JeepScrollRail />
      <main>{children}</main>
      {!hideFooter && <Footer />}
      {!hideMobileBookingBar && <MobileBookingBar />}
    </div>
  );
}
