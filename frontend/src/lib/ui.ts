export const btnPrimary =
  "group inline-flex items-center justify-center gap-2 rounded-sm bg-sand px-7 py-3.5 text-[0.75rem] font-bold tracking-[0.2em] text-forest-deep uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-mist hover:shadow-[0_14px_36px_-12px_color-mix(in_oklab,var(--sand)_75%,transparent)] focus-visible:ring-2 focus-visible:ring-sand focus-visible:outline-none";

export const btnGhost =
  "group inline-flex items-center justify-center gap-2 rounded-sm border border-mist/35 px-7 py-3.5 text-[0.75rem] font-bold tracking-[0.2em] text-mist uppercase backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-sand hover:text-sand focus-visible:ring-2 focus-visible:ring-sand focus-visible:outline-none";

export const btnSmall =
  "inline-flex items-center justify-center gap-1.5 rounded-sm border border-sand/40 px-4 py-2 text-[0.68rem] font-bold tracking-[0.16em] text-sand uppercase transition-colors hover:bg-sand hover:text-forest-deep";

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
