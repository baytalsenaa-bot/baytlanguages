"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { flyIn, scaleReveal, staggerContainer } from "@/lib/motion/tokens";
import { useReducedMotionSafe } from "@/lib/motion/useReducedMotionSafe";

export function VerificationTeaser() {
  const t = useTranslations("home.verification");
  const prefersReduced = useReducedMotion();
  const item = useReducedMotionSafe(flyIn("up"));
  const seal = useReducedMotionSafe(scaleReveal);
  const container = useReducedMotionSafe(staggerContainer(0.12));

  return (
    <section className="px-4 py-20">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={container}
        className="mx-auto flex max-w-5xl flex-col items-center gap-10 rounded-2xl border border-brand-border bg-brand-surface px-6 py-14 text-center md:flex-row md:text-start"
      >
        <motion.div variants={seal} className="relative flex-shrink-0">
          {!prefersReduced && (
            <motion.div
              aria-hidden
              className="absolute inset-[-10px] rounded-full border-2 border-dashed border-brand-gold/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            />
          )}
          <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-brand-gold text-brand-gold">
            <ShieldCheckIcon />
          </div>
        </motion.div>

        <div>
          <motion.p
            variants={item}
            className="text-sm font-medium uppercase tracking-widest text-brand-gold"
          >
            {t("eyebrow")}
          </motion.p>
          <motion.h2
            variants={item}
            className="mt-4 text-3xl font-semibold tracking-tight text-brand-parchment md:text-4xl"
          >
            {t("title")}
          </motion.h2>
          <motion.p variants={item} className="mt-4 max-w-xl text-brand-muted">
            {t("description")}
          </motion.p>
          <motion.div variants={item} className="mt-6">
            <Link
              href="/verify"
              className="inline-flex items-center gap-2 rounded-full border border-brand-gold px-6 py-3 text-sm font-semibold text-brand-gold hover:bg-brand-gold/10"
            >
              {t("cta")}
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width={44} height={44} fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path
        d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"
        strokeLinejoin="round"
      />
      <path d="M9 12.5l2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
