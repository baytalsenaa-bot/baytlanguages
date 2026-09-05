"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export function ServiceTicker({ label, items }: { label: string; items: string[] }) {
  const prefersReduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [prefersReduced, items.length]);

  return (
    <div className="flex items-center justify-center gap-2 text-sm text-brand-muted lg:justify-start">
      <span>{label}</span>
      <span className="relative inline-flex h-5 min-w-[11rem] items-center overflow-hidden text-start">
        <AnimatePresence mode="wait">
          <motion.span
            key={prefersReduced ? "static" : items[index]}
            initial={prefersReduced ? false : { y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={prefersReduced ? undefined : { y: -10, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute font-semibold text-brand-gold"
          >
            {items[prefersReduced ? 0 : index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}
