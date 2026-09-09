import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reduce ? 0.3 : 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** A small jeep that drives across the screen when a section enters view. */
export function JeepDriveBy({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <motion.div
      aria-hidden
      className={className ?? "pointer-events-none relative h-8 overflow-hidden"}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.span
        className="absolute top-0 text-sand/70"
        variants={{ hidden: { x: "-15%", opacity: 0 }, shown: { x: "105%", opacity: 1 } }}
        transition={{ duration: 2.2, ease: "easeInOut" }}
      >
        <JeepMark />
      </motion.span>
      <span className="absolute top-6 left-0 h-px w-full bg-mist/15" />
    </motion.div>
  );
}

function JeepMark() {
  return (
    <svg viewBox="0 0 64 34" width={30} height={16} aria-hidden="true">
      <g fill="currentColor">
        <path d="M4 20h4l3-8h14l2 8h9l3-8h13l3 8h5a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a7 7 0 0 0-13 0H24a7 7 0 0 0-13 0H6a2 2 0 0 1-2-2v-5z" />
        <circle cx="17.5" cy="27" r="6" />
        <circle cx="46.5" cy="27" r="6" />
      </g>
    </svg>
  );
}
