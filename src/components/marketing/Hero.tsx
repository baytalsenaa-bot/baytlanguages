"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { WhatsAppButton } from "./WhatsAppButton";
import { FloatingGlyphs } from "./FloatingGlyphs";
import { flyIn, staggerContainer } from "@/lib/motion/tokens";
import { useReducedMotionSafe } from "@/lib/motion/useReducedMotionSafe";

export function Hero() {
  const t = useTranslations("home.hero");
  const item = useReducedMotionSafe(flyIn("up"));
  const container = useReducedMotionSafe(staggerContainer(0.14));

  return (
    <section className="relative overflow-hidden px-4 pt-20 pb-24 md:pt-32 md:pb-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(212,175,55,0.18),transparent)]"
      />
      <FloatingGlyphs />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="mx-auto max-w-3xl text-center"
      >
        <motion.p
          variants={item}
          className="text-sm font-medium uppercase tracking-widest text-brand-gold"
        >
          {t("eyebrow")}
        </motion.p>

        <motion.h1
          variants={item}
          className="mt-6 text-4xl font-semibold tracking-tight text-brand-parchment md:text-6xl"
        >
          {t("title")}
        </motion.h1>

        <motion.p variants={item} className="mx-auto mt-6 max-w-2xl text-lg text-brand-muted">
          {t("subtitle")}
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <WhatsAppButton />
          <Link
            href="/services"
            className="text-sm font-medium text-brand-parchment underline-offset-4 hover:underline"
          >
            {t("secondaryCta")}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
