"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { JeepGlyph, MountainGlyph } from "@/components/brand/JeepGlyph";

/** Vertical scroll progress: a jeep drives from the mountain down to the destination. */
export function JeepScrollRail() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const y = useTransform(smooth, [0, 1], ["0%", "100%"]);
  const trail = useTransform(smooth, [0, 1], ["0%", "100%"]);

  if (reduce) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-1/2 right-4 z-40 hidden -translate-y-1/2 flex-col items-center gap-2 xl:flex"
    >
      <MountainGlyph size={22} className="text-sand/60" />
      <div className="relative h-56 w-px bg-mist/20">
        <motion.span className="absolute top-0 left-0 w-px bg-sand" style={{ height: trail }} />
        <motion.span className="absolute -left-3.5 text-sand" style={{ y, top: 0 }}>
          <JeepGlyph size={26} />
        </motion.span>
      </div>
      <span className="h-1.5 w-1.5 rounded-full bg-sand/70" />
    </div>
  );
}
