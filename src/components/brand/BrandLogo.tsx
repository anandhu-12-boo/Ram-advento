import { motion, useReducedMotion } from "framer-motion";
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

  return (
    <motion.span
      className={cn("relative inline-block shrink-0", className)}
      style={{ width: size, height: size }}
      whileHover={interactive && !reduce ? { scale: 1.06, rotate: -3 } : undefined}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      {interactive && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{ boxShadow: "0 0 30px 4px color-mix(in oklab, var(--sand) 45%, transparent)" }}
        />
      )}
      <img
        src={brandLogo}
        alt="Ram Adventure — Munnar Jeep Safari 4x4 badge"
        width={size}
        height={size}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full select-none object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.55)]"
      />
    </motion.span>
  );
}
