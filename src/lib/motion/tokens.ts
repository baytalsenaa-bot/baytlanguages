import type { Transition, Variants } from "motion/react";

export const durations = {
  instant: 0.1,
  fast: 0.2,
  base: 0.35,
  slow: 0.6,
  reveal: 0.8,
};

export const easings = {
  standard: [0.22, 1, 0.36, 1] as const,
  enter: [0.16, 1, 0.3, 1] as const,
  exit: [0.7, 0, 0.84, 0] as const,
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.base, ease: easings.standard },
  },
};

export const fadeRiseIn: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slow, ease: easings.enter },
  },
};

/**
 * Logical "start"/"end" direction, resolved to an actual x offset by the caller
 * based on the current `dir` — never hardcode a literal left/right sign, since
 * that reads backwards in RTL.
 */
export function slideIn(direction: "start" | "end", dir: "ltr" | "rtl"): Variants {
  const sign = direction === "start" ? -1 : 1;
  const resolved = dir === "rtl" ? -sign : sign;
  return {
    hidden: { opacity: 0, x: resolved * 24 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: durations.slow, ease: easings.enter },
    },
  };
}

export const scaleReveal: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.reveal, ease: easings.enter },
  },
};

export function staggerContainer(childDelay = 0.08): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: childDelay },
    },
  };
}

export const microHover: Transition = {
  duration: durations.instant,
  ease: easings.standard,
};
