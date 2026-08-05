"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { flyIn, staggerContainer, microHover } from "@/lib/motion/tokens";
import { useReducedMotionSafe } from "@/lib/motion/useReducedMotionSafe";

type FaqItem = { question: string; answer: string };

export function FaqAccordion({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: FaqItem[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const header = useReducedMotionSafe(flyIn("up"));
  const item = useReducedMotionSafe(flyIn("up"));
  const container = useReducedMotionSafe(staggerContainer(0.06));

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
          className="text-center"
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
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
          className="mt-12 divide-y divide-brand-border rounded-xl border border-brand-border bg-brand-surface shadow-lg shadow-black/10"
        >
          {items.map((entry, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div key={entry.question} variants={item}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-brand-parchment">
                    {entry.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={microHover}
                    className="flex-shrink-0 text-2xl leading-none text-brand-red"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-brand-muted">
                        {entry.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
