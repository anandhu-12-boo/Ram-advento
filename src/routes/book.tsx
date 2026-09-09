import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { JeepGlyph } from "@/components/brand/JeepGlyph";
import { SiteShell } from "@/components/SiteShell";
import { pickupPoints, tours, vehicles } from "@/lib/site-data";
import { btnGhost, btnPrimary, inr } from "@/lib/ui";
import { cn } from "@/lib/utils";

const searchSchema = z.object({ tour: z.string().optional() });

export const Route = createFileRoute("/book")({
  validateSearch: (search) => searchSchema.parse(search),
  component: BookPage,
  head: () => ({
    meta: [
      { title: "Book a Munnar Jeep Safari | Ram Adventure" },
      {
        name: "description",
        content:
          "Book your Munnar jeep safari in a few steps — pick your date, guests, jeep and pickup point, and confirm your adventure.",
      },
      { property: "og:title", content: "Book a Munnar Jeep Safari | Ram Adventure" },
      {
        property: "og:description",
        content: "Date, guests, jeep, pickup, details, payment. Your adventure in six steps.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/book" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/book" }],
  }),
});

const steps = ["Date", "Guests", "Vehicle", "Pickup", "Details", "Payment"] as const;

const field =
  "mt-2 w-full rounded-sm border border-white/15 bg-ink/60 px-4 py-3 text-sm text-mist outline-none transition-colors placeholder:text-mist/35 focus:border-sand";
const label = "text-[0.66rem] font-semibold tracking-[0.2em] text-mist/60 uppercase";

function BookPage() {
  const { tour: tourSlug } = Route.useSearch();
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const [step, setStep] = useState(0);
  const [tourId, setTourId] = useState(tourSlug ?? tours[0]!.slug);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("06:30");
  const [guests, setGuests] = useState(2);
  const [vehicle, setVehicle] = useState(vehicles[0]!.id);
  const [pickup, setPickup] = useState(pickupPoints[0]!);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const tour = useMemo(() => tours.find((t) => t.slug === tourId) ?? tours[0]!, [tourId]);
  const amount = tour.price ? tour.price + Math.max(0, guests - 4) * 400 : 0;

  const canContinue = () => {
    if (step === 0) return Boolean(date);
    if (step === 4) return name.trim().length > 1 && phone.trim().length > 6 && /.+@.+\..+/.test(email);
    return true;
  };

  const next = () => {
    if (!canContinue()) {
      setError(step === 0 ? "Pick a date for your adventure." : "Please complete your details.");
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const confirm = () => {
    const bookingId = `RA${Date.now().toString().slice(-6)}`;
    navigate({
      to: "/booking-confirmed",
      search: {
        id: bookingId,
        tour: tour.slug,
        date,
        time,
        guests,
        vehicle,
        pickup,
        amount,
      },
    });
  };

  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-6 pt-32 pb-24">
        <div className="text-center">
          <div className="flex justify-center">
            <BrandLogo size={92} interactive />
          </div>
          <h1 className="mt-6 font-display text-[clamp(2.2rem,6vw,4rem)] text-mist">Your adventure</h1>
          <p className="eyebrow mt-2">Six steps to the trail</p>
        </div>

        {/* Jeep step tracker */}
        <div className="relative mt-14">
          <div className="flex items-end justify-between">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-1 flex-col items-center gap-2">
                <span
                  className={cn(
                    "text-[0.6rem] font-bold tracking-[0.18em] uppercase transition-colors",
                    i <= step ? "text-sand" : "text-mist/35",
                  )}
                >
                  {s}
                </span>
                <span
                  className={cn(
                    "h-2 w-2 rotate-45 transition-colors",
                    i <= step ? "bg-sand" : "bg-mist/25",
                  )}
                />
              </div>
            ))}
          </div>
          <div className="relative mt-2 h-px w-full bg-mist/20">
            <motion.span
              className="absolute -top-4 text-sand"
              animate={{ left: `calc(${(step / (steps.length - 1)) * 100}% - 15px)` }}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 90, damping: 18 }}
            >
              <JeepGlyph size={30} />
            </motion.span>
          </div>
        </div>

        <div className="mt-12 rounded-sm border border-white/10 bg-forest-deep/50 p-7 sm:p-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: reduce ? 0 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: reduce ? 0 : -24 }}
              transition={{ duration: 0.35 }}
            >
              {step === 0 && (
                <div className="space-y-6">
                  <div>
                    <label className={label} htmlFor="tour">Adventure</label>
                    <select id="tour" className={field} value={tourId} onChange={(e) => setTourId(e.target.value)}>
                      {tours.map((t) => (
                        <option key={t.slug} value={t.slug} className="bg-ink">
                          {t.name} — {t.duration}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className={label} htmlFor="date">Select date</label>
                      <input id="date" type="date" className={field} value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div>
                      <label className={label} htmlFor="time">Start time</label>
                      <input id="time" type="time" className={field} value={time} onChange={(e) => setTime(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <label className={label}>Guests</label>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGuests(g)}
                        className={cn(
                          "h-12 w-12 rounded-sm border font-display text-xl transition-colors",
                          guests === g
                            ? "border-sand bg-sand text-forest-deep"
                            : "border-white/15 text-mist hover:border-sand",
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-mist/60">
                    Groups above eight travel as a jeep convoy — we arrange extra vehicles.
                  </p>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-3 sm:grid-cols-3">
                  {vehicles.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVehicle(v.id)}
                      className={cn(
                        "rounded-sm border p-5 text-left transition-colors",
                        vehicle === v.id ? "border-sand bg-sand/10" : "border-white/15 hover:border-sand/60",
                      )}
                    >
                      <p className="font-display text-xl text-mist">{v.name}</p>
                      <p className="mt-1 text-xs tracking-widest text-sand uppercase">{v.seats}</p>
                      <p className="mt-2 text-sm text-mist/65">{v.note}</p>
                    </button>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-2 sm:grid-cols-2">
                  {pickupPoints.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPickup(p)}
                      className={cn(
                        "rounded-sm border px-4 py-3 text-left text-sm transition-colors",
                        pickup === p ? "border-sand bg-sand/10 text-mist" : "border-white/15 text-mist/75 hover:border-sand/60",
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {step === 4 && (
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={label} htmlFor="cname">Full name</label>
                    <input id="cname" className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Anand A" />
                  </div>
                  <div>
                    <label className={label} htmlFor="cphone">Phone / WhatsApp</label>
                    <input id="cphone" className={field} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 …" />
                  </div>
                  <div>
                    <label className={label} htmlFor="cemail">Email</label>
                    <input id="cemail" type="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
                  </div>
                </div>
              )}

              {step === 5 && (
                <div>
                  <p className="eyebrow">Review & pay</p>
                  <dl className="mt-5 divide-y divide-white/10 text-sm">
                    {[
                      ["Tour", tour.name],
                      ["Date", date || "—"],
                      ["Time", time],
                      ["Guests", String(guests)],
                      ["Vehicle", vehicles.find((v) => v.id === vehicle)?.name ?? "—"],
                      ["Pickup", pickup],
                      ["Guest", name || "—"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-6 py-3">
                        <dt className="text-mist/55">{k}</dt>
                        <dd className="text-right text-mist">{v}</dd>
                      </div>
                    ))}
                    <div className="flex justify-between gap-6 py-4">
                      <dt className="text-mist/55">Amount</dt>
                      <dd className="font-display text-2xl text-sand">
                        {amount ? inr(amount) : "Quote on call"}
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-2 text-xs text-mist/55">
                    Payment is collected on confirmation. Online card/UPI payment can be switched on
                    once a payment provider is connected.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {error && <p className="mt-5 text-sm text-destructive">{error}</p>}

          <div className="mt-9 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className={cn(btnGhost, "px-5 py-2.5 text-[0.68rem] disabled:opacity-30")}
            >
              <ArrowLeft size={14} /> Back
            </button>

            {step < steps.length - 1 ? (
              <button type="button" onClick={next} className={btnPrimary}>
                Continue <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <button type="button" onClick={confirm} className={btnPrimary}>
                Confirm adventure <Check size={15} />
              </button>
            )}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
