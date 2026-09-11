import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { forestPoster, forestVideo, valleyImage } from "@/lib/media";
import { stats } from "@/lib/site-data";
import { btnGhost } from "@/lib/ui";

export function AboutMunnar() {
  return (
    <section id="about" className="relative -mt-24 bg-ink pt-32 pb-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">About Munnar</p>
          <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,4rem)] text-mist">
            We don't just show you Munnar.
            <br />
            <span className="text-sand">We take you into it.</span>
          </h2>
          <p className="mt-6 max-w-xl text-mist/75">
            Thirteen hundred metres above the sea, the high range is a country of tea, cloud and
            forest. Ram Adventure was built by drivers born on these hills — the ones who know which
            trail clears the mist first and where the elephants cross at dusk.
          </p>
          <ul className="mt-7 grid gap-3 text-sm text-mist/80 sm:grid-cols-2">
            {[
              "Experienced drivers",
              "Local knowledge",
              "Adventure routes",
              "Customer-first service",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rotate-45 bg-sand" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <Link to="/about" className={`${btnGhost} mt-9`}>
            Our story
          </Link>
        </Reveal>

        <Reveal delay={0.15} className="relative">
          <div className="relative overflow-hidden rounded-sm border border-white/10">
            <video
              className="aspect-4/3 w-full object-cover"
              src={forestVideo}
              poster={forestPoster}
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              aria-label="Mist rolling over the Munnar forest"
            />
          </div>
          <img
            src={valleyImage}
            alt="Munnar valley village with terraced fields at sunrise"
            loading="lazy"
            width={640}
            height={360}
            className="absolute -bottom-10 -left-6 hidden w-1/2 rounded-sm border border-white/15 object-cover shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] sm:block"
          />
        </Reveal>
      </div>

      <div className="mx-auto mt-24 max-w-7xl px-6">
        <div className="trail-divider" />
        <dl className="grid grid-cols-2 gap-8 py-10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <dt className="font-display text-4xl text-sand sm:text-5xl">{s.value}</dt>
              <dd className="mt-2 text-[0.7rem] font-semibold tracking-[0.24em] text-mist/60 uppercase">
                {s.label}
              </dd>
            </Reveal>
          ))}
        </dl>
        <div className="trail-divider" />
      </div>
    </section>
  );
}
