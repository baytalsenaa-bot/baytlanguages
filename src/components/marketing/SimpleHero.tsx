"use client";

import { motion } from "motion/react";
import { flyIn, staggerContainer } from "@/lib/motion/tokens";
import { useReducedMotionSafe } from "@/lib/motion/useReducedMotionSafe";

export function SimpleHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  const item = useReducedMotionSafe(flyIn("up"));
  const container = useReducedMotionSafe(staggerContainer(0.1));

  return (
    <section className="px-4 pt-20 pb-16 md:pt-28">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="mx-auto max-w-2xl text-center"
      >
        <motion.p
          variants={item}
          className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-brand-gold"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
          {eyebrow}
        </motion.p>
        <motion.h1
          variants={item}
          className="mt-4 text-4xl font-extrabold tracking-tight text-brand-parchment md:text-5xl"
        >
          {title}
        </motion.h1>
        <motion.p variants={item} className="mx-auto mt-6 max-w-xl text-brand-muted">
          {subtitle}
        </motion.p>
      </motion.div>
    </section>
  );
}
