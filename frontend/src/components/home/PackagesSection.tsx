import { Link } from "react-router-dom";
import { Clock, Star, Users } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { tours } from "@/lib/site-data";
import { btnPrimary, btnSmall, inr } from "@/lib/ui";

export function PackagesSection() {
  return (
    <section id="packages" className="bg-ink py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="eyebrow">Tour Packages</p>
          <h2 className="mt-4 font-display text-[clamp(2.1rem,5vw,4rem)] text-mist">
            Choose your trail
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {tours.map((t, i) => (
            <Reveal key={t.slug} delay={(i % 2) * 0.1}>
              <article className="group grid h-full overflow-hidden rounded-sm border border-white/10 bg-forest-deep/60 sm:grid-cols-[42%_1fr]">
                <div className="relative aspect-4/3 overflow-hidden sm:aspect-auto">
                  <img
                    src={t.image}
                    alt={t.name}
                    loading="lazy"
                    width={1200}
                    height={900}
                    className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-forest-deep/70" />
                </div>

                <div className="flex flex-col p-6">
                  <h3 className="font-display text-2xl text-mist">{t.name}</h3>
                  <p className="mt-1 text-sm text-mist/60">{t.tagline}</p>

                  <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.68rem] font-semibold tracking-[0.14em] text-mist/60 uppercase">
                    <li className="flex items-center gap-1.5">
                      <Clock size={13} className="text-sand" /> {t.duration}
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Users size={13} className="text-sand" /> Max {t.maxGuests}
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Star size={13} className="text-sand" /> {t.rating}
                    </li>
                  </ul>

                  <p className="mt-5 font-display text-3xl text-sand">
                    {t.price ? inr(t.price) : "On request"}
                    {t.price ? (
                      <span className="ml-2 text-[0.62rem] tracking-[0.2em] text-mist/50 uppercase">
                        starting from
                      </span>
                    ) : null}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-2 pt-6">
                    <Link to="/tours/$slug" params={{ slug: t.slug }} className={btnSmall}>
                      View details
                    </Link>
                    <Link to="/book" search={{ tour: t.slug }} className={btnSmall}>
                      Check availability
                    </Link>
                    <Link
                      to="/book"
                      search={{ tour: t.slug }}
                      className={`${btnPrimary} px-5 py-2 text-[0.68rem]`}
                    >
                      Book now
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
