import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { JeepGlyph, MountainGlyph } from "@/components/brand/JeepGlyph";

const SESSION_KEY = "ram-adventure-intro-played";

/**
 * Cinematic intro: black screen -> logo scale-in + light sweep -> mountain +
 * animated road with travelling jeep -> logo lifts toward the navbar.
 */
export function IntroLoader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const duration = reduce ? 500 : 2300;
    const timer = window.setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      onDone();
    }, duration);
    return () => window.clearTimeout(timer);
  }, [onDone, reduce]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
          style={{
            background:
              "radial-gradient(circle at 50% 45%, color-mix(in oklab, var(--forest-deep) 90%, black), var(--ink) 70%)",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          aria-live="polite"
          aria-label="Preparing your adventure"
        >
          <motion.div
            className="relative"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { scale: 0.22, y: "-38vh", opacity: 0 }}
            transition={{ duration: reduce ? 0.3 : 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <BrandLogo size={168} priority />
            {!reduce && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 35%, color-mix(in oklab, white 65%, transparent) 50%, transparent 65%)",
                  mixBlendMode: "screen",
                }}
                initial={{ x: "-120%" }}
                animate={{ x: "120%" }}
                transition={{ duration: 1.1, delay: 0.5, ease: "easeInOut" }}
              />
            )}
          </motion.div>

          {!reduce && (
            <motion.div
              className="mt-10 w-[min(300px,70vw)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <motion.div
                className="flex justify-center text-mountain"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <MountainGlyph size={56} />
              </motion.div>

              <div className="relative mt-3 h-6">
                <motion.span
                  className="absolute top-4 left-0 h-px bg-sand/50"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.75, duration: 0.7, ease: "easeOut" }}
                />
                <motion.span
                  className="absolute top-0 text-sand"
                  initial={{ x: 0, opacity: 0 }}
                  animate={{ x: "calc(100% - 30px)", opacity: 1 }}
                  transition={{ delay: 1.05, duration: 1, ease: "easeInOut" }}
                >
                  <JeepGlyph size={30} />
                </motion.span>
              </div>
            </motion.div>
          )}

          <motion.p
            className="eyebrow mt-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduce ? 0.1 : 1.5, duration: 0.5 }}
          >
            Preparing your adventure
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function hasPlayedIntro() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}
