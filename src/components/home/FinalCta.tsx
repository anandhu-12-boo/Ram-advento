import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { JeepGlyph, MountainGlyph } from "@/components/brand/JeepGlyph";
import { Reveal } from "@/components/Reveal";
import { heroPoster } from "@/lib/media";
import { btnGhost, btnPrimary } from "@/lib/ui";

export function FinalCta() {
  const reduce = useReducedMotion();

  return (
    <section id="book" className="relative flex min-h-[85vh] items-center overflow-hidden">
      <img
        src={heroPoster}
        alt="Munnar mountain range under monsoon clouds"
        loading="lazy"
        width={1200}
        height={670}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div aria-hidden className="absolute inset-0 bg-ink/75" />

      <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
        <Reveal>
          <div className="flex justify-center">
            <BrandLogo size={120} interactive />
          </div>
          <h2 className="mt-8 font-display text-[clamp(2.2rem,6vw,4.6rem)] text-mist">
            Ready to take the road less travelled?
          </h2>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/book" className={btnPrimary}>
              Book your adventure
            </Link>
            <Link to="/safari" className={btnGhost}>
              Explore Munnar
            </Link>
          </div>
        </Reveal>

        <div className="relative mx-auto mt-16 h-10 w-full max-w-md" aria-hidden>
          <span className="absolute top-7 left-0 h-px w-full bg-sand/30" />
          <span className="absolute -top-1 right-0 text-sand/70">
            <MountainGlyph size={34} />
          </span>
          <motion.span
            className="absolute top-2 left-0 text-sand"
            initial={{ x: 0 }}
            whileInView={reduce ? {} : { x: "calc(100% - 34px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 2.6, ease: "easeInOut" }}
            style={{ width: "100%" }}
          >
            <JeepGlyph size={30} />
          </motion.span>
        </div>
      </div>
    </section>
  );
}
