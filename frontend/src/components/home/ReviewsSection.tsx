import { Star } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { reviews } from "@/lib/site-data";

export function ReviewsSection() {
  return (
    <section id="reviews" className="bg-ink py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="eyebrow">Reviews</p>
          <h2 className="mt-4 font-display text-[clamp(2.1rem,5vw,4rem)] text-mist">
            5000+ travellers, one trail at a time
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={(i % 4) * 0.07}>
              <figure className="flex h-full flex-col rounded-sm border border-white/10 bg-forest-deep/50 p-6">
                <div className="flex gap-1 text-sand" aria-label={`${r.rating} out of 5`}>
                  {Array.from({ length: r.rating }).map((_, k) => (
                    <Star key={k} size={14} fill="currentColor" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm text-mist/80">"{r.text}"</blockquote>
                <figcaption className="mt-5 text-[0.68rem] font-semibold tracking-[0.18em] text-mist/55 uppercase">
                  {r.name} • {r.from}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
