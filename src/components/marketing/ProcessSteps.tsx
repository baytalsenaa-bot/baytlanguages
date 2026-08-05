"use client";

import { motion } from "motion/react";
import { useLocale } from "next-intl";
import { flyIn, staggerContainer } from "@/lib/motion/tokens";
import { useReducedMotionSafe } from "@/lib/motion/useReducedMotionSafe";

export function ProcessSteps({
  eyebrow,
  title,
  steps,
}: {
  eyebrow: string;
  title: string;
  steps: { title: string; description: string }[];
}) {
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const header = useReducedMotionSafe(flyIn("up"));
  const container = useReducedMotionSafe(staggerContainer(0.15));
  const stepStart = useReducedMotionSafe(flyIn("start", dir));
  const stepUp = useReducedMotionSafe(flyIn("up"));

  return (
    <section className="border-y border-brand-border/60 bg-brand-surface/40 px-4 py-20">
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
            className="text-sm font-medium uppercase tracking-widest text-brand-gold"
          >
            {eyebrow}
          </motion.p>
          <motion.h2
            variants={header}
            className="mt-4 text-3xl font-semibold tracking-tight text-brand-parchment md:text-4xl"
          >
            {title}
          </motion.h2>
        </motion.div>

        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
          className="mt-14 grid gap-8 md:grid-cols-3"
        >
          {steps.map((step, index) => (
            <motion.li
              key={step.title}
              variants={index === 0 ? stepStart : stepUp}
              className="relative rounded-xl border border-brand-border/60 bg-brand-ink/40 p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-gold text-sm font-semibold text-brand-gold">
                {index + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-brand-parchment">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-brand-muted">{step.description}</p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
