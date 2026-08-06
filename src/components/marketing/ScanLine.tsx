"use client";

import { motion } from "motion/react";

/**
 * The brand's signature "scan line" sweep — reused wherever a certificate/QR
 * needs to visually resolve to a verified state (hero mockup, verify page).
 * Runs once per mount; pass `active={false}` to skip it entirely (reduced motion).
 */
export function ScanLine({ active, delay = 0 }: { active: boolean; delay?: number }) {
  if (!active) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 z-10 h-10 bg-gradient-to-b from-transparent via-brand-gold/40 to-transparent"
      initial={{ top: "-10%", opacity: 0 }}
      animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.1, ease: "easeInOut", delay }}
    />
  );
}
