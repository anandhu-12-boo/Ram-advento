import { Link, createFileRoute, notFound } from "@tanstack/react-router";
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

export const Route = createFileRoute("/tours/$slug")({
  loader: ({ params }) => {
    const tour = tours.find((t) => t.slug === params.slug);
    if (!tour) throw notFound();
    return { tour };
  },
  component: TourDetail,
  head: ({ params, loaderData }) => {
    const tour = loaderData?.tour;
    const title = tour ? `${tour.name} — Munnar | Ram Adventure` : "Tour | Ram Adventure";
    const description = tour
      ? `${tour.tagline}. ${tour.duration} in ${tour.location}, from ${tour.price ? inr(tour.price) : "custom pricing"}.`
      : "Munnar jeep safari tour details.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/tours/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/tours/${params.slug}` }],
    };
  },
});

function TourDetail() {
  const { tour } = Route.useLoaderData();

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
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.4rem,7vw,5.4rem)] text-mist">
            {tour.name}
          </h1>
          <p className="mt-3 max-w-xl text-mist/75">{tour.tagline}</p>

          <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-[0.7rem] font-semibold tracking-[0.16em] text-mist/70 uppercase">
            <li className="flex items-center gap-2">
              <Clock size={14} className="text-sand" />
              {tour.duration}
            </li>
            <li className="flex items-center gap-2">
              <Truck size={14} className="text-sand" />
              {tour.vehicle}
            </li>
            <li className="flex items-center gap-2">
              <Users size={14} className="text-sand" />
              Max {tour.maxGuests}
            </li>
            <li className="flex items-center gap-2">
              <Star size={14} className="text-sand" />
              {tour.rating} ({tour.reviews})
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={14} className="text-sand" />
              {tour.location}
            </li>
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <p className="font-display text-4xl text-sand">
              {tour.price ? inr(tour.price) : "On request"}
            </p>
            <Link to="/book" search={{ tour: tour.slug }} className={btnPrimary}>
              Book this adventure
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[1fr_320px]">
        <div className="space-y-14">
          <Reveal>
            <h2 className="font-display text-3xl text-mist">Overview</h2>
            <p className="mt-4 text-mist/75">{tour.overview}</p>
          </Reveal>

          <Reveal>
            <h2 className="font-display text-3xl text-mist">Highlights</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {tour.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-sm text-mist/80">
                  <Check size={16} className="mt-0.5 shrink-0 text-sand" /> {h}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <h2 className="font-display text-3xl text-mist">Itinerary</h2>
            <ol className="mt-6 space-y-6 border-l border-sand/30 pl-6">
              {tour.itinerary.map((step) => (
                <li key={step.time} className="relative">
                  <span
                    aria-hidden
                    className="absolute top-2 -left-[1.9rem] h-2 w-2 rotate-45 bg-sand"
                  />
                  <p className="eyebrow">{step.time}</p>
                  <p className="mt-1 font-display text-2xl text-mist">{step.title}</p>
                  <p className="mt-1 text-sm text-mist/70">{step.detail}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal className="grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl text-mist">Included</h2>
              <ul className="mt-4 space-y-2 text-sm text-mist/80">
                {tour.included.map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={16} className="mt-0.5 text-sand" /> {i}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-3xl text-mist">Excluded</h2>
              <ul className="mt-4 space-y-2 text-sm text-mist/60">
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
              {tour.faqs.map((f, i) => (
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
          <Link to="/book" search={{ tour: tour.slug }} className={`${btnPrimary} mt-6 w-full`}>
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
