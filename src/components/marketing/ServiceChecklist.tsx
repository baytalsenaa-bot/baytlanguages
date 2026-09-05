"use client";

import { motion } from "motion/react";
import { flyIn, staggerContainer } from "@/lib/motion/tokens";
import { useReducedMotionSafe } from "@/lib/motion/useReducedMotionSafe";

export function ServiceChecklist({ items }: { items: string[] }) {
  const item = useReducedMotionSafe(flyIn("up"));
  const container = useReducedMotionSafe(staggerContainer(0.05));

  return (
    <motion.ul
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={container}
      className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2"
    >
      {items.map((entry) => (
        <motion.li
          key={entry}
          variants={item}
          className="flex items-start gap-3 rounded-lg border border-brand-border bg-brand-surface px-4 py-3"
        >
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-gold" />
          <span className="text-sm text-brand-parchment">{entry}</span>
        </motion.li>
      ))}
    </motion.ul>
  );
}
