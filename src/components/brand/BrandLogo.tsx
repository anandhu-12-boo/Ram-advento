"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { brandLogo } from "@/lib/media";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** pixel size of the circular mark */
  size?: number;
  /** enable hover micro-interaction */
  interactive?: boolean;
  priority?: boolean;
};

export function BrandLogo({ className, size = 48, interactive = false, priority = false }: Props) {
  const reduce = useReducedMotion();
  const [src, setSrc] = useState(brandLogo);

  return (
    <motion.span
      className={cn(
        "group/logo relative inline-block shrink-0 overflow-hidden rounded-full",
        className,
      )}
      style={{ width: size, height: size }}
      {...(interactive && !reduce ? { whileHover: { scale: 1.06, rotate: -3 } } : {})}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      <img
        src={src}
        alt="Ram Adventure — Munnar Jeep Safari 4x4 badge"
        width={size}
        height={size}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full scale-[1.1] select-none object-cover"
        onError={() => {
          if (src !== "/favicon.png") setSrc("/favicon.png");
        }}
      />
      {interactive && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover/logo:opacity-100"
          style={{
            boxShadow: "inset 0 0 24px 2px color-mix(in oklab, var(--sand) 55%, transparent)",
          }}
        />
      )}
    </motion.span>
  );
}
