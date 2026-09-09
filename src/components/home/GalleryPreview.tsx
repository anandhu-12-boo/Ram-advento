import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { galleryItems } from "@/lib/site-data";
import { btnGhost } from "@/lib/ui";

export function GalleryPreview() {
  return (
    <section id="gallery" className="bg-forest-deep py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Gallery</p>
            <h2 className="mt-4 font-display text-[clamp(2.1rem,5vw,4rem)] text-mist">
              Frames from the high range
            </h2>
          </div>
          <Link to="/gallery" className={btnGhost}>
            View full gallery
          </Link>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {galleryItems.slice(0, 8).map((item, i) => (
            <Reveal key={`${item.location}-${i}`} delay={(i % 4) * 0.06}>
              <div className="group relative overflow-hidden rounded-sm">
                <img
                  src={item.src}
                  alt={`${item.category} — ${item.location}`}
                  loading="lazy"
                  width={1200}
                  height={900}
                  className="aspect-square w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-ink/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute bottom-3 left-3 text-[0.62rem] font-semibold tracking-[0.18em] text-mist uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {item.location}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
