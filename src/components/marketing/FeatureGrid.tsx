"use client";

import { motion } from "motion/react";
import { fadeRiseIn, staggerContainer } from "@/lib/motion/tokens";
import { useReducedMotionSafe } from "@/lib/motion/useReducedMotionSafe";

export function FeatureGrid({
  eyebrow,
  title,
  items,
  columns = 2,
}: {
  eyebrow?: string;
  title: string;
  items: { title: string; description: string }[];
  columns?: 2 | 3;
}) {
  const item = useReducedMotionSafe(fadeRiseIn);
  const container = useReducedMotionSafe(staggerContainer(0.08));

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
              variants={item}
              className="text-sm font-medium uppercase tracking-widest text-brand-gold"
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.h2
            variants={item}
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
          {items.map((entry) => (
            <motion.div
              key={entry.title}
              variants={item}
              className="rounded-xl border border-brand-border bg-brand-surface p-6"
            >
              <h3 className="text-lg font-semibold text-brand-parchment">{entry.title}</h3>
              <p className="mt-2 text-sm text-brand-muted">{entry.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
