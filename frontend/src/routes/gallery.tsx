import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import { galleryCategories, galleryItems } from "@/lib/site-data";
import { forestPoster } from "@/lib/media";
import { cn } from "@/lib/utils";

export default function GalleryPage() {
  const [active, setActive] = useState<string>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    document.title = "Munnar Photo Gallery | Ram Adventure";
  }, []);

  const items = galleryItems.filter((i) => active === "All" || i.category === active);

  return (
    <SiteShell>
      <PageHero eyebrow="Gallery" title="The high range, frame by frame" image={forestPoster} />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-wrap gap-2">
          {galleryCategories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={cn(
                "rounded-sm border px-4 py-2 text-[0.68rem] font-bold tracking-[0.16em] uppercase transition-colors",
                active === c
                  ? "border-sand bg-sand text-forest-deep"
                  : "border-white/15 text-mist/70 hover:border-sand hover:text-sand",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 columns-2 gap-4 lg:columns-3 [&>*]:mb-4">
          {items.map((item, i) => (
            <button
              key={`${item.location}-${i}`}
              type="button"
              onClick={() => setLightbox(i)}
              className="group relative block w-full overflow-hidden rounded-sm focus-visible:ring-2 focus-visible:ring-sand focus-visible:outline-none"
            >
              <img
                src={item.src}
                alt={`${item.category} — ${item.location}`}
                loading="lazy"
                width={1200}
                height={900}
                className={cn(
                  "w-full object-cover transition-transform duration-[900ms] group-hover:scale-110",
                  item.tall ? "aspect-3/4" : "aspect-4/3",
                )}
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-ink/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <span className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="text-[0.62rem] font-semibold tracking-[0.2em] text-mist uppercase">
                  {item.location}
                </span>
                <span className="text-[0.62rem] font-bold tracking-[0.24em] text-sand uppercase">
                  View
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {lightbox !== null && items[lightbox] && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Close photo"
              className="absolute top-6 right-6 rounded-sm border border-white/20 p-2 text-mist hover:border-sand hover:text-sand"
            >
              <X size={20} />
            </button>
            <motion.img
              src={items[lightbox].src}
              alt={`${items[lightbox].category} — ${items[lightbox].location}`}
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              className="max-h-[85vh] w-auto max-w-full rounded-sm object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </SiteShell>
  );
}
