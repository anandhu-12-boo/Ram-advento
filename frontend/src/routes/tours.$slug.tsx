import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, Clock, MapPin, Star, Truck, Users, X } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SiteShell } from "@/components/SiteShell";
import { tours } from "@/lib/site-data";
import { btnPrimary, inr } from "@/lib/ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function TourDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const tour = tours.find((t) => t.slug === slug) || tours[0];

  useEffect(() => {
    if (tour) {
      document.title = `${tour.name} — ${tour.location} | Ram Adventure`;
    }
  }, [tour]);

  return (
    <SiteShell>
      <section className="relative flex min-h-[80vh] items-end overflow-hidden pt-28">
        <img
          src={tour.image}
          alt={tour.name}
          width={1200}
          height={900}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30"
        />
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-14">
          <p className="eyebrow">{tour.location}</p>
          <h1 className="mt-2 font-display text-[clamp(2.4rem,6vw,5rem)] text-mist">
            {tour.name}
          </h1>
          <p className="mt-3 max-w-xl text-lg text-mist/85">{tour.tagline}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1fr_360px]">
        <div className="space-y-14">
          <Reveal className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-sm border border-white/10 bg-forest-deep/50 p-4">
              <Clock size={18} className="text-sand" />
              <p className="mt-3 text-[0.65rem] tracking-widest text-mist/50 uppercase">Duration</p>
              <p className="font-semibold text-mist">{tour.duration}</p>
            </div>
            <div className="rounded-sm border border-white/10 bg-forest-deep/50 p-4">
              <Users size={18} className="text-sand" />
              <p className="mt-3 text-[0.65rem] tracking-widest text-mist/50 uppercase">Group</p>
              <p className="font-semibold text-mist">Up to {tour.maxGuests} guests</p>
            </div>
            <div className="rounded-sm border border-white/10 bg-forest-deep/50 p-4">
              <Truck size={18} className="text-sand" />
              <p className="mt-3 text-[0.65rem] tracking-widest text-mist/50 uppercase">Vehicle</p>
              <p className="font-semibold text-mist">{tour.vehicle}</p>
            </div>
            <div className="rounded-sm border border-white/10 bg-forest-deep/50 p-4">
              <MapPin size={18} className="text-sand" />
              <p className="mt-3 text-[0.65rem] tracking-widest text-mist/50 uppercase">Location</p>
              <p className="font-semibold text-mist">{tour.location}</p>
            </div>
          </Reveal>

          <Reveal>
            <h2 className="font-display text-3xl text-mist">About this trail</h2>
            <p className="mt-4 text-lg leading-relaxed text-mist/75">{tour.overview}</p>
          </Reveal>

          <Reveal>
            <h2 className="font-display text-3xl text-mist">Highlights</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 text-mist/80">
              {tour.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sand shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <h2 className="font-display text-3xl text-mist">Itinerary</h2>
            <div className="mt-6 space-y-6">
              {tour.itinerary.map((item, i) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-sand/40 text-xs font-bold text-sand">
                      {i + 1}
                    </span>
                    {i < tour.itinerary.length - 1 && (
                      <span className="mt-2 h-full w-px bg-white/10" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-xs font-bold tracking-widest text-sand uppercase">
                      {item.time}
                    </p>
                    <p className="mt-1 font-display text-xl text-mist">{item.title}</p>
                    <p className="mt-2 text-sm text-mist/70">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-sm border border-white/10 bg-forest-deep/50 p-6">
              <p className="font-display text-xl text-mist">Inclusions</p>
              <ul className="mt-4 space-y-2 text-sm text-mist/75">
                {tour.included.map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={16} className="mt-0.5 text-sand" /> {i}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-sm border border-white/10 bg-forest-deep/50 p-6">
              <p className="font-display text-xl text-mist">Exclusions</p>
              <ul className="mt-4 space-y-2 text-sm text-mist/75">
                {tour.excluded.map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <X size={16} className="mt-0.5 text-mist/40" /> {i}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal>
            <h2 className="font-display text-3xl text-mist">Pickup details</h2>
            <p className="mt-4 text-mist/75">{tour.pickup}</p>
          </Reveal>

          <Reveal>
            <h2 className="font-display text-3xl text-mist">Gallery</h2>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {tour.gallery.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${tour.name} photo ${i + 1}`}
                  loading="lazy"
                  width={1200}
                  height={900}
                  className="aspect-square w-full rounded-sm object-cover transition-transform duration-700 hover:scale-105"
                />
              ))}
            </div>
          </Reveal>

          <Reveal>
            <h2 className="font-display text-3xl text-mist">Reviews</h2>
            <div className="mt-5 rounded-sm border border-white/10 bg-forest-deep/50 p-6">
              <p className="flex items-center gap-2 font-display text-3xl text-sand">
                <Star size={20} fill="currentColor" /> {tour.rating}
                <span className="text-sm tracking-widest text-mist/50 uppercase">
                  from {tour.reviews} travellers
                </span>
              </p>
              <p className="mt-3 text-sm text-mist/75">
                "Our driver stopped at every place the light was right. We came back with photos we
                still cannot believe."
              </p>
            </div>
          </Reveal>

          <Reveal>
            <h2 className="font-display text-3xl text-mist">FAQs</h2>
            <Accordion type="single" collapsible className="mt-4">
              {tour.faqs.length > 0 && tour.faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-mist">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-mist/70">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>

        <aside className="h-max rounded-sm border border-white/10 bg-forest-deep/60 p-6 lg:sticky lg:top-28">
          <p className="eyebrow">Your adventure</p>
          <p className="mt-3 font-display text-4xl text-sand">
            {tour.price ? inr(tour.price) : "On request"}
          </p>
          <p className="mt-1 text-xs tracking-widest text-mist/50 uppercase">{tour.duration}</p>
          <Link to={`/book?tour=${tour.slug}`} className={`${btnPrimary} mt-6 w-full`}>
            Book this adventure
          </Link>
          <p className="mt-4 text-xs text-mist/60">
            Free pickup in Munnar town • Free reschedule for severe weather
          </p>
        </aside>
      </div>
    </SiteShell>
  );
}
