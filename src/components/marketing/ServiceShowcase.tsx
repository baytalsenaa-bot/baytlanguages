"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { flyIn, staggerContainer } from "@/lib/motion/tokens";
import { useReducedMotionSafe } from "@/lib/motion/useReducedMotionSafe";

export type ShowcaseItem = {
  slug: string | null;
  title: string;
  description: string;
  icon: ReactNode;
};

const ROTATE_MS = 3400;

export function ServiceShowcase({
  eyebrow,
  title,
  subtitle,
  cta,
  items,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  items: ShowcaseItem[];
}) {
  const header = useReducedMotionSafe(flyIn("up"));
  const container = useReducedMotionSafe(staggerContainer(0.1));
  const prefersReduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (prefersReduced || isPaused) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [prefersReduced, isPaused, items.length]);

  const current = items[index];

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p
            variants={header}
            className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-brand-gold"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
            {eyebrow}
          </motion.p>
          <motion.h2
            variants={header}
            className="mt-4 text-3xl font-extrabold tracking-tight text-brand-parchment md:text-4xl"
          >
            {title}
          </motion.h2>
          <motion.p variants={header} className="mt-4 text-brand-muted">
            {subtitle}
          </motion.p>
        </motion.div>

        <div
          className="relative mx-auto mt-12 max-w-xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.slug ?? "translation"}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-brand-gold/30 bg-brand-surface p-10 text-center shadow-2xl shadow-black/20"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
                {current.icon}
              </div>
              <h3 className="mt-6 text-2xl font-extrabold text-brand-parchment">
                {current.title}
              </h3>
              <p className="mx-auto mt-3 max-w-sm text-brand-muted">{current.description}</p>
              <Link
                href={current.slug ? `/services/${current.slug}` : "/services"}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-gold hover:text-brand-gold-soft"
              >
                {cta}
                <span aria-hidden>→</span>
              </Link>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-center gap-2">
            {items.map((entry, entryIndex) => (
              <button
                key={entry.slug ?? "translation"}
                type="button"
                onClick={() => setIndex(entryIndex)}
                aria-label={entry.title}
                className={`h-2 rounded-full transition-all ${
                  entryIndex === index ? "w-6 bg-brand-gold" : "w-2 bg-brand-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
