import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SiteShell } from "@/components/SiteShell";

export const authField =
  "mt-2 w-full rounded-sm border border-white/15 bg-ink/60 px-4 py-3 text-sm text-mist outline-none transition-colors placeholder:text-mist/35 focus:border-sand";
export const authLabel = "text-[0.66rem] font-semibold tracking-[0.2em] text-mist/60 uppercase";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <SiteShell>
      <section className="mx-auto flex max-w-lg flex-col px-6 pt-32 pb-28">
        <div className="text-center">
          <div className="flex justify-center">
            <BrandLogo size={88} interactive />
          </div>
          <h1 className="mt-6 font-display text-[clamp(2rem,5vw,3.2rem)] text-mist">{title}</h1>
          <p className="eyebrow mt-2">{subtitle}</p>
        </div>

        <div className="mt-10 rounded-sm border border-white/10 bg-forest-deep/50 p-7 sm:p-9">
          {children}
        </div>

        {footer ? <div className="mt-6 text-center text-sm text-mist/70">{footer}</div> : null}

        <Link
          to="/"
          className="mt-8 text-center text-xs tracking-[0.2em] text-mist/45 uppercase hover:text-sand"
        >
          Back to site
        </Link>
      </section>
    </SiteShell>
  );
}
