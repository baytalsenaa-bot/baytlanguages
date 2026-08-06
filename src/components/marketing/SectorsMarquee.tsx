"use client";

import { motion, useReducedMotion } from "motion/react";
import { flyIn, staggerContainer } from "@/lib/motion/tokens";
import { useReducedMotionSafe } from "@/lib/motion/useReducedMotionSafe";
import {
  GovBuildingIcon,
  BriefcaseIcon,
  ConstructionIcon,
  BoltIcon,
  SignalIcon,
  FactoryIcon,
} from "./icons";

const sectorIcons = [
  GovBuildingIcon,
  BriefcaseIcon,
  ConstructionIcon,
  BoltIcon,
  SignalIcon,
  FactoryIcon,
];

function SectorBadge({ label, index, keyPrefix }: { label: string; index: number; keyPrefix: string }) {
  const Icon = sectorIcons[index % sectorIcons.length];
  return (
    <div
      key={`${keyPrefix}-${label}`}
      className="flex flex-shrink-0 items-center gap-3 rounded-full border border-brand-border bg-brand-surface px-6 py-3"
    >
      <span className="text-brand-gold">
        <Icon className="h-5 w-5" />
      </span>
      <span className="whitespace-nowrap text-sm font-medium text-brand-parchment">
        {label}
      </span>
    </div>
  );
}

export function SectorsMarquee({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: string[];
}) {
  const prefersReduced = useReducedMotion();
  const header = useReducedMotionSafe(flyIn("up"));
  const container = useReducedMotionSafe(staggerContainer(0.1));

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p
            variants={header}
            className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-brand-gold"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
            {eyebrow}
          </motion.p>
          <motion.h2
            variants={header}
            className="mt-4 text-3xl font-extrabold tracking-tight text-brand-parchment md:text-4xl"
          >
            {title}
          </motion.h2>
        </motion.div>
      </div>

      <div className="relative mt-12 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 start-0 z-10 w-16 bg-gradient-to-r from-brand-ink to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 end-0 z-10 w-16 bg-gradient-to-l from-brand-ink to-transparent" />

        {prefersReduced ? (
          <div className="flex flex-wrap justify-center gap-4 px-4">
            {items.map((label, index) => (
              <SectorBadge key={label} label={label} index={index} keyPrefix="static" />
            ))}
          </div>
        ) : (
          <motion.div
            className="flex gap-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          >
            <div className="flex gap-4">
              {items.map((label, index) => (
                <SectorBadge key={`a-${label}`} label={label} index={index} keyPrefix="a" />
              ))}
            </div>
            <div aria-hidden="true" className="flex gap-4">
              {items.map((label, index) => (
                <SectorBadge key={`b-${label}`} label={label} index={index} keyPrefix="b" />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
