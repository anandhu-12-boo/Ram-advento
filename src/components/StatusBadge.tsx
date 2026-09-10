import { cn } from "@/lib/utils";

const bookingStyles: Record<string, string> = {
  pending: "border-amber-400/40 bg-amber-400/15 text-amber-200",
  confirmed: "border-emerald-400/40 bg-emerald-400/15 text-emerald-200",
  completed: "border-sky-400/40 bg-sky-400/15 text-sky-200",
  cancelled: "border-red-400/40 bg-red-400/15 text-red-200",
  rescheduled: "border-violet-400/40 bg-violet-400/15 text-violet-200",
};

const paymentStyles: Record<string, string> = {
  pending: "border-amber-400/40 bg-amber-400/15 text-amber-200",
  paid: "border-emerald-400/40 bg-emerald-400/15 text-emerald-200",
  failed: "border-red-400/40 bg-red-400/15 text-red-200",
  refunded: "border-sky-400/40 bg-sky-400/15 text-sky-200",
};

const enquiryStyles: Record<string, string> = {
  new: "border-amber-400/40 bg-amber-400/15 text-amber-200",
  contacted: "border-sky-400/40 bg-sky-400/15 text-sky-200",
  resolved: "border-emerald-400/40 bg-emerald-400/15 text-emerald-200",
};

export function StatusBadge({
  value,
  kind = "booking",
  className,
}: {
  value: string;
  kind?: "booking" | "payment" | "enquiry";
  className?: string;
}) {
  const map = kind === "payment" ? paymentStyles : kind === "enquiry" ? enquiryStyles : bookingStyles;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[0.6rem] font-bold tracking-[0.16em] uppercase",
        map[value] ?? "border-white/20 bg-white/10 text-mist",
        className,
      )}
    >
      {value}
    </span>
  );
}
