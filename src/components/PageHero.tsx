import { motion, useReducedMotion } from "framer-motion";

export function PageHero({
  eyebrow,
  title,
  text,
  image,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  image: string;
}) {
  const reduce = useReducedMotion();
  return (
    <section className="relative flex min-h-[62vh] items-end overflow-hidden pt-28">
      <motion.img
        src={image}
        alt=""
        aria-hidden
        width={1400}
        height={900}
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: reduce ? 1 : 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
      <div className="relative mx-auto w-full max-w-7xl px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.4rem,7vw,5.4rem)] text-mist">
            {title}
          </h1>
          {text && <p className="mt-5 max-w-xl text-mist/75">{text}</p>}
        </motion.div>
      </div>
    </section>
  );
}
