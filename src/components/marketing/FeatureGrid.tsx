"use client";

import { motion } from "motion/react";
import { flyIn, staggerContainer, microHover } from "@/lib/motion/tokens";
import { useReducedMotionSafe } from "@/lib/motion/useReducedMotionSafe";

export function FeatureGrid({
  eyebrow,
  title,
  items,
  columns = 2,
  icons,
}: {
  eyebrow?: string;
  title: string;
  items: { title: string; description: string }[];
  columns?: 2 | 3;
  icons?: React.ReactNode[];
}) {
  const header = useReducedMotionSafe(flyIn("up"));
  const item = useReducedMotionSafe(flyIn("up"));
  const container = useReducedMotionSafe(staggerContainer(0.1));

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
          {eyebrow && (
            <motion.p
              variants={header}
              className="text-sm font-medium uppercase tracking-widest text-brand-gold"
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.h2
            variants={header}
            className="mt-4 text-3xl font-semibold tracking-tight text-brand-parchment md:text-4xl"
          >
            {title}
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
          className={`mt-14 grid gap-6 ${columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}
        >
          {items.map((entry, index) => (
            <motion.div
              key={entry.title}
              variants={item}
              whileHover={{ y: -4 }}
              transition={microHover}
              className="rounded-xl border border-brand-border bg-brand-surface p-6"
            >
              {icons?.[index] && (
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/40 text-brand-gold">
                  {icons[index]}
                </div>
              )}
              <h3 className="text-lg font-semibold text-brand-parchment">{entry.title}</h3>
              <p className="mt-2 text-sm text-brand-muted">{entry.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
