import { Link } from "react-router-dom";
import { Clock, MapPin } from "lucide-react";
import { JeepDriveBy, Reveal } from "@/components/Reveal";
import { destinations } from "@/lib/site-data";
import { btnSmall, inr } from "@/lib/ui";

export function SafariSection({ limit }: { limit?: number }) {
  const list = limit ? destinations.slice(0, limit) : destinations;

  return (
    <section id="destinations" className="bg-forest-deep py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="eyebrow">Jeep Safari</p>
          <h2 className="mt-4 max-w-3xl font-display text-[clamp(2.1rem,5vw,4rem)] text-mist">
            Explore Munnar beyond the ordinary
          </h2>
          <p className="mt-5 max-w-2xl text-mist/75">
            Leave the usual roads behind and discover the hidden beauty of Munnar with our
            experienced local drivers.
          </p>
        </Reveal>

        <JeepDriveBy className="pointer-events-none relative mt-10 h-8 overflow-hidden" />

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((d, i) => (
            <Reveal key={d.slug} delay={(i % 3) * 0.08}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-white/10 bg-ink/60">
                <div className="relative aspect-4/3 overflow-hidden">
                  <img
                    src={d.image}
                    alt={`${d.name}, Munnar`}
                    loading="lazy"
                    width={1200}
                    height={900}
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                  <span className="absolute top-3 right-3 rounded-sm bg-ink/70 px-2.5 py-1 text-[0.62rem] font-bold tracking-[0.16em] text-sand uppercase">
                    from {inr(d.price)}
                  </span>
                </div>

                <div className="relative flex flex-1 flex-col p-5">
                  <h3 className="font-display text-2xl text-mist">{d.name}</h3>
                  <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.68rem] font-semibold tracking-[0.14em] text-mist/55 uppercase">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-sand" /> {d.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-sand" /> {d.duration}
                    </span>
                  </p>
                  <p className="mt-3 flex-1 text-sm text-mist/70">{d.blurb}</p>
                  <div className="mt-5">
                    <Link to="/safari" hash={d.slug} className={btnSmall}>
                      Explore
                    </Link>
                  </div>
                  <JeepDriveBy className="pointer-events-none absolute right-0 bottom-1 left-0 h-6 overflow-hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
