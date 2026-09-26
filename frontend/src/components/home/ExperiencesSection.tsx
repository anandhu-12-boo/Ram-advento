import { Compass, HeartHandshake, LifeBuoy, Mountain, ShieldCheck, Truck } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { jeepImage, whyCards } from "@/lib/site-data";

const icons = [Compass, ShieldCheck, Mountain, HeartHandshake, Truck, LifeBuoy];

export function ExperiencesSection() {
  return (
    <section id="experiences" className="relative overflow-hidden bg-forest-deep py-24">
      <img
        src={jeepImage}
        alt=""
        aria-hidden
        loading="lazy"
        width={1400}
        height={900}
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-ink via-forest-deep/85 to-ink"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="eyebrow">Why Ram Adventure</p>
          <h2 className="mt-4 max-w-2xl font-display text-[clamp(2.1rem,5vw,4rem)] text-mist">
            Experiences built by people of the high range
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {whyCards.map((c, i) => {
            const Icon = icons[i] ?? Compass;
            return (
              <Reveal key={c.title} delay={(i % 3) * 0.07}>
                <div className="h-full bg-ink/80 p-8 transition-colors duration-300 hover:bg-forest/60">
                  <Icon size={26} className="text-sand" />
                  <h3 className="mt-5 font-display text-2xl text-mist">{c.title}</h3>
                  <p className="mt-2 text-sm text-mist/70">{c.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
