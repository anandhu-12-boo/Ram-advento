import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Download, MessageCircle, Ticket } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { JeepGlyph, MountainGlyph } from "@/components/brand/JeepGlyph";
import { SiteShell } from "@/components/SiteShell";
import { heroPoster } from "@/lib/media";
import { contact, tours, vehicles } from "@/lib/site-data";
import { btnGhost, btnPrimary, inr } from "@/lib/ui";

export default function BookingConfirmedPage() {
  const [searchParams] = useSearchParams();
  const reduce = useReducedMotion();

  useEffect(() => {
    document.title = "Adventure Confirmed | Ram Adventure Munnar";
  }, []);

  const s = {
    id: searchParams.get("id") || "RA000000",
    tour: searchParams.get("tour") || "munnar-jeep-safari",
    date: searchParams.get("date") || "",
    time: searchParams.get("time") || "",
    guests: Number(searchParams.get("guests") || "2"),
    vehicle: searchParams.get("vehicle") || "thar",
    pickup: searchParams.get("pickup") || "Munnar Town",
    amount: Number(searchParams.get("amount") || "0"),
  };

  const tour = tours.find((t) => t.slug === s.tour) ?? tours[0]!;
  const vehicleName = vehicles.find((v) => v.id === s.vehicle)?.name ?? s.vehicle;

  const rows: [string, string][] = [
    ["Booking ID", s.id],
    ["Tour", tour.name],
    ["Date", s.date || "To be confirmed"],
    ["Time", s.time || "—"],
    ["Guests", String(s.guests)],
    ["Vehicle", vehicleName],
    ["Pickup location", s.pickup],
    ["Amount", s.amount ? inr(s.amount) : "Quote on call"],
    ["Payment status", s.amount ? "Confirmed on pickup" : "Pending quote"],
  ];

  const whatsappText = encodeURIComponent(
    `Hi Ram Adventure, my booking ${s.id} for ${tour.name} on ${s.date} is confirmed.`,
  );

  const downloadBooking = () => {
    const body = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
    const blob = new Blob([`RAM ADVENTURE — Booking confirmation\n\n${body}\n`], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ram-adventure-${s.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <SiteShell>
      <section className="relative flex min-h-dvh items-center overflow-hidden pt-28 pb-20">
        <img
          src={heroPoster}
          alt="Munnar mountains"
          width={1200}
          height={670}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-ink/85" />

        <div className="relative mx-auto w-full max-w-2xl px-6 text-center">
          <motion.div
            className="flex justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <BrandLogo size={124} interactive />
          </motion.div>

          <h1 className="mt-8 font-display text-[clamp(2.2rem,7vw,4.6rem)] text-mist">
            Adventure confirmed
          </h1>
          <p className="mt-3 text-mist/75">Your Munnar adventure is officially booked.</p>

          <div className="relative mx-auto mt-10 h-10 w-full max-w-sm" aria-hidden>
            <span className="absolute top-7 left-0 h-px w-full bg-sand/30" />
            <span className="absolute -top-1 right-0 text-sand/70">
              <MountainGlyph size={34} />
            </span>
            <motion.span
              className="absolute top-2 left-0 w-full text-sand"
              initial={{ x: 0 }}
              animate={reduce ? {} : { x: "calc(100% - 34px)" }}
              transition={{ duration: 2.4, ease: "easeInOut", delay: 0.5 }}
            >
              <JeepGlyph size={30} />
            </motion.span>
          </div>

          <dl className="mt-10 divide-y divide-white/10 rounded-sm border border-white/10 bg-forest-deep/70 p-6 text-left text-sm">
            {rows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 py-3">
                <dt className="text-mist/55">{k}</dt>
                <dd className="text-right text-mist">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={downloadBooking} className={btnPrimary}>
              <Download size={15} /> Download booking
            </button>
            <Link to="/my-account/bookings" className={btnGhost}>
              <Ticket size={15} /> View my bookings
            </Link>
            <a
              href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}?text=${whatsappText}`}
              target="_blank"
              rel="noreferrer"
              className={btnGhost}
            >
              <MessageCircle size={15} /> WhatsApp confirmation
            </a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
