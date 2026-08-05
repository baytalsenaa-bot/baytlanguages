"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { WhatsAppButton } from "./WhatsAppButton";
import { fadeRiseIn, staggerContainer } from "@/lib/motion/tokens";
import { useReducedMotionSafe } from "@/lib/motion/useReducedMotionSafe";

export function FinalCta() {
  const t = useTranslations("home.finalCta");
  const item = useReducedMotionSafe(fadeRiseIn);
  const container = useReducedMotionSafe(staggerContainer(0.1));

  return (
    <section className="relative overflow-hidden px-4 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[400px] bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(201,162,39,0.14),transparent)]"
      />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={container}
        className="mx-auto max-w-2xl text-center"
      >
        <motion.h2
          variants={item}
          className="text-3xl font-semibold tracking-tight text-brand-parchment md:text-4xl"
        >
          {t("title")}
        </motion.h2>
        <motion.p variants={item} className="mt-4 text-brand-muted">
          {t("subtitle")}
        </motion.p>
        <motion.div variants={item} className="mt-8 flex justify-center">
          <WhatsAppButton />
        </motion.div>
      </motion.div>
    </section>
  );
}
