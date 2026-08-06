"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { WhatsAppButton } from "./WhatsAppButton";
import { FloatingGlyphs } from "./FloatingGlyphs";
import { CertificateMockup } from "./CertificateMockup";
import { flyIn, staggerContainer } from "@/lib/motion/tokens";
import { useReducedMotionSafe } from "@/lib/motion/useReducedMotionSafe";

export function Hero() {
  const t = useTranslations("home.hero");
  const item = useReducedMotionSafe(flyIn("up"));
  const mockupItem = useReducedMotionSafe(flyIn("end"));
  const container = useReducedMotionSafe(staggerContainer(0.14));

  return (
    <section className="relative overflow-hidden px-4 pt-20 pb-16 md:pt-32 md:pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(212,175,55,0.18),transparent)]"
      />
      <FloatingGlyphs />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="text-center lg:text-start">
          <motion.p
            variants={item}
            className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-brand-gold lg:justify-start"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
            {t("eyebrow")}
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-6 text-4xl font-extrabold tracking-tight text-brand-parchment md:text-6xl"
          >
            {t("title")}
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-2xl text-lg text-brand-muted lg:mx-0"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
          >
            <WhatsAppButton />
            <Link
              href="/verify"
              className="text-sm font-medium text-brand-parchment underline-offset-4 hover:underline"
            >
              {t("secondaryCta")}
            </Link>
          </motion.div>
        </div>

        <motion.div variants={mockupItem} className="hidden lg:block">
          <CertificateMockup />
        </motion.div>
      </motion.div>

      <motion.p
        initial="hidden"
        animate="visible"
        variants={item}
        className="mx-auto mt-16 max-w-xl text-center text-sm italic text-brand-muted"
      >
        {t("transitionTagline")}
      </motion.p>
    </section>
  );
}
