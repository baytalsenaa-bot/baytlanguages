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
  tone = "ink",
}: {
  eyebrow?: string;
  title: string;
  items: { title: string; description: string }[];
  columns?: 2 | 3;
  icons?: React.ReactNode[];
  tone?: "ink" | "surface";
}) {
  const header = useReducedMotionSafe(flyIn("up"));
  const item = useReducedMotionSafe(flyIn("up"));
  const container = useReducedMotionSafe(staggerContainer(0.1));

  const sectionTone = tone === "surface" ? "bg-brand-surface/40" : "";
  const cardTone =
    tone === "surface"
      ? "border-brand-border bg-brand-ink/40"
      : "border-brand-border bg-brand-surface";

  return (
    <section className={`px-4 py-20 ${sectionTone}`}>
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
              className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-brand-gold"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
              {eyebrow}
            </motion.p>
          )}
          <motion.h2
            variants={header}
            className="mt-4 text-3xl font-extrabold tracking-tight text-brand-parchment md:text-4xl"
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
              className={`rounded-xl border p-6 shadow-lg shadow-black/10 transition-shadow hover:shadow-brand-gold/10 ${cardTone}`}
            >
              {icons?.[index] && (
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
                  {icons[index]}
                </div>
              )}
              <h3 className="text-lg font-bold text-brand-parchment">{entry.title}</h3>
              <p className="mt-2 text-sm text-brand-muted">{entry.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
