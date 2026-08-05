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

/**
 * Bigger, springier version of fadeRiseIn/slideIn for hero-level moments that
 * should read as "flying in" rather than a subtle fade — used sparingly, not
 * for every element on a page.
 */
export function flyIn(direction: "up" | "down" | "start" | "end", dir: "ltr" | "rtl" = "ltr"): Variants {
  const offset =
    direction === "up"
      ? { y: 56 }
      : direction === "down"
        ? { y: -56 }
        : direction === "start"
          ? { x: dir === "rtl" ? 56 : -56 }
          : { x: dir === "rtl" ? -56 : 56 };

  return {
    hidden: { opacity: 0, ...offset, rotate: direction === "up" || direction === "down" ? 0 : -3 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      transition: { type: "spring", stiffness: 90, damping: 14, mass: 0.8 },
    },
  };
}

/** Continuous gentle bob + rotate for decorative elements — respects reduced motion by simply not being applied (callers should skip it via useReducedMotionSafe or a prefers-reduced-motion check). */
export function floatLoop(delay = 0): Transition {
  return {
    duration: 4 + delay,
    repeat: Infinity,
    repeatType: "mirror",
    ease: "easeInOut",
    delay,
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
