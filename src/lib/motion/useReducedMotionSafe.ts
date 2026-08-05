"use client";

import { useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";

/**
 * Wraps a variants object so that when the user prefers reduced motion, transforms
 * collapse to opacity-only with a near-zero duration — defined once here rather than
 * per component, so "controlled" motion stays enforceable in review.
 */
export function useReducedMotionSafe(variants: Variants): Variants {
  const prefersReduced = useReducedMotion();

  if (!prefersReduced) return variants;

  const stripped: Variants = {};
  for (const [key, value] of Object.entries(variants)) {
    if (typeof value === "object" && value !== null) {
      stripped[key] = {
        opacity: "opacity" in value ? value.opacity : undefined,
        transition: { duration: 0.01 },
      };
    }
  }
  return stripped;
}
