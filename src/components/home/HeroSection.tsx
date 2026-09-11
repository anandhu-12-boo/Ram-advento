import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { heroPoster, heroVideo, localHeroFallback } from "@/lib/media";
import { btnGhost, btnPrimary } from "@/lib/ui";

export function HeroSection({ ready }: { ready: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [posterSrc, setPosterSrc] = useState(heroPoster);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 1.08]);
  const contentY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -120]);
  const darken = useTransform(scrollYProgress, [0, 1], [0.45, 0.9]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative h-dvh min-h-[600px] w-full overflow-hidden"
      aria-label="Ram Adventure — Munnar jeep safari"
    >
      <motion.div
        className="absolute inset-0"
        style={{ scale }}
        initial={{ opacity: 0, scale: 1.06 }}
        animate={ready ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      >
        {videoFailed ? (
          <img
            className="h-full w-full object-cover object-[60%_center] sm:object-center"
            src={posterSrc}
            alt=""
            aria-hidden="true"
            onError={() => {
              if (posterSrc !== localHeroFallback) setPosterSrc(localHeroFallback);
            }}
          />
        ) : (
          <video
            className="h-full w-full object-cover object-[60%_center] sm:object-center"
            src={heroVideo}
            poster={posterSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            onError={() => setVideoFailed(true)}
          />
        )}
      </motion.div>

      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{
          opacity: darken,
          background:
            "linear-gradient(to top, var(--ink) 4%, color-mix(in oklab, var(--forest-deep) 70%, transparent) 45%, rgba(0,0,0,0.35))",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/35 to-transparent"
      />

      <motion.div
        className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-24 sm:justify-center sm:pb-0"
        style={{ y: contentY }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="eyebrow">
            Ram Adventure <span className="mx-2 text-mist/40">|</span> Munnar • Kerala
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.9rem,9vw,7rem)] text-mist">
            Adventure
            <br />
            begins where
            <br />
            <span className="text-sand">the road ends.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base text-mist/80 sm:text-lg">
            Discover Munnar through unforgettable jeep safaris, mountain trails and breathtaking
            landscapes.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/tours" className={btnPrimary}>
              Explore adventures
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/book" className={btnGhost}>
              Book your jeep
            </Link>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 text-mist/60 sm:block"
        animate={reduce ? {} : { y: [0, 10, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown size={26} />
      </motion.div>
    </section>
  );
}
