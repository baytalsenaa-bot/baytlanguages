"use client";

import { Children, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ScanLine } from "@/components/marketing/ScanLine";
import { fadeRiseIn, staggerContainer } from "@/lib/motion/tokens";

type Phase = "loading" | "scanning" | "revealed";

export function VerificationReveal({
  header,
  children,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  const prefersReduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(prefersReduced ? "revealed" : "loading");

  useEffect(() => {
    if (prefersReduced) return;
    const t1 = setTimeout(() => setPhase("scanning"), 350);
    const t2 = setTimeout(() => setPhase("revealed"), 1450);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [prefersReduced]);

  return (
    <div>
      <div className="relative">
        {phase !== "revealed" && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-brand-ink/70 backdrop-blur-sm">
            {phase === "loading" ? (
              <motion.div
                className="h-9 w-9 rounded-full border-2 border-brand-gold/30 border-t-brand-gold"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <ScanLine active />
            )}
          </div>
        )}
        <motion.div
          initial={false}
          animate={{ opacity: phase === "revealed" ? 1 : 0.15 }}
          transition={{ duration: 0.4 }}
        >
          {header}
        </motion.div>
      </div>

      <motion.div
        initial="hidden"
        animate={phase === "revealed" ? "visible" : "hidden"}
        variants={staggerContainer(0.08)}
        className="mt-8 space-y-8"
      >
        {Children.map(children, (child, index) =>
          child ? (
            <motion.div key={index} variants={fadeRiseIn}>
              {child}
            </motion.div>
          ) : null,
        )}
      </motion.div>
    </div>
  );
}
