"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { JeepGlyph, MountainGlyph } from "@/components/brand/JeepGlyph";
import { brandLogo, heroPoster, heroVideo } from "@/lib/media";

const MIN_DURATION = 800;
const MAX_DURATION = 1500;

/** Preload the critical homepage assets, resolving on error too so we never stall. */
function preloadAssets(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  const safe = (src?: string) => (src && src.trim().length ? src : "");

  const image = (src?: string) =>
    new Promise<void>((resolve) => {
      const next = safe(src);
      if (!next) {
        resolve();
        return;
      }

      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = next;
    });

  const video = (src?: string) =>
    new Promise<void>((resolve) => {
      const next = safe(src);
      if (!next) {
        resolve();
        return;
      }

      try {
        const el = document.createElement("video");
        el.preload = "metadata";
        el.muted = true;
        el.onloadedmetadata = () => resolve();
        el.onerror = () => resolve();
        el.src = next;
      } catch {
        resolve();
      }
    });

  return Promise.all([image(brandLogo), image(heroPoster), video(heroVideo)]).then(() => undefined);
}

/**
 * Cinematic intro: dark forest screen -> logo scale-in + light sweep -> "Preparing your
 * adventure" -> jeep driving along a road line -> logo lifts toward the navbar.
 */
export function IntroLoader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let finished = false;
    const start = Date.now();

    const finish = () => {
      if (finished) return;
      finished = true;
      setVisible(false);
      onDoneRef.current();
    };

    if (reduce) {
      const quick = window.setTimeout(finish, 200);
      return () => window.clearTimeout(quick);
    }

    // Hard safety net: never leave the visitor stuck on the loading screen.
    const failsafe = window.setTimeout(finish, MAX_DURATION);
    let minTimer: number | undefined;

    void preloadAssets().then(() => {
      const remaining = Math.max(0, MIN_DURATION - (Date.now() - start));
      minTimer = window.setTimeout(finish, remaining);
    });

    return () => {
      window.clearTimeout(failsafe);
      if (minTimer) window.clearTimeout(minTimer);
    };
  }, [reduce]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-ink"
          style={{
            background:
              "radial-gradient(circle at 50% 45%, color-mix(in oklab, var(--forest-deep) 90%, black), var(--ink) 70%)",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          role="status"
          aria-live="polite"
          aria-label="Preparing your adventure"
        >
          <motion.div
            className="intro-logo relative"
            exit={reduce ? { opacity: 0 } : { scale: 0.8, y: "-38vh", opacity: 0 }}
            transition={{ duration: reduce ? 0.3 : 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <BrandLogo size={168} priority />
            <span
              aria-hidden
              className="intro-sweep pointer-events-none absolute inset-0 rounded-full"
              style={{
                background:
                  "linear-gradient(105deg, transparent 35%, color-mix(in oklab, white 65%, transparent) 50%, transparent 65%)",
                mixBlendMode: "screen",
              }}
            />
          </motion.div>

          <p className="eyebrow intro-rise mt-8">Preparing your adventure</p>

          <div className="intro-rise mt-8 w-[min(300px,70vw)]">
            <div className="flex justify-center text-mountain">
              <MountainGlyph size={48} />
            </div>

            <div className="relative mt-3 h-8" aria-hidden>
              <span className="absolute top-5 left-0 h-px w-full bg-sand/25" />
              <span className="intro-road absolute top-5 left-0 h-px bg-sand" />
              <span className="intro-jeep absolute top-0 left-0 text-sand">
                <JeepGlyph size={30} />
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
