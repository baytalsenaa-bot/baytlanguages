"use client";

import { motion } from "motion/react";
import { scaleReveal } from "@/lib/motion/tokens";
import { useReducedMotionSafe } from "@/lib/motion/useReducedMotionSafe";

export function RevealSeal({ children }: { children: React.ReactNode }) {
  const variants = useReducedMotionSafe(scaleReveal);

  return (
    <motion.div initial="hidden" animate="visible" variants={variants}>
      {children}
    </motion.div>
  );
}
