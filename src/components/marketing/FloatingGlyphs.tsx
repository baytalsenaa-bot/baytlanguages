"use client";

import { motion, useReducedMotion } from "motion/react";

type Glyph = {
  text: string;
  top: string;
  side: "start" | "end";
  offset: string;
  size: "sm" | "md";
  delay: number;
};

const glyphs: Glyph[] = [
  { text: "Hello", top: "8%", side: "start", offset: "2%", size: "md", delay: 0 },
  { text: "مرحبا", top: "18%", side: "end", offset: "4%", size: "md", delay: 0.6 },
  { text: "你好", top: "62%", side: "start", offset: "6%", size: "sm", delay: 1.1 },
  { text: "Bonjour", top: "72%", side: "end", offset: "0%", size: "sm", delay: 0.3 },
  { text: "Certified", top: "40%", side: "start", offset: "-4%", size: "sm", delay: 1.6 },
  { text: "已验证", top: "4%", side: "end", offset: "22%", size: "sm", delay: 2.1 },
];

export function FloatingGlyphs() {
  const prefersReduced = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {glyphs.map((glyph, index) => (
        <motion.span
          key={glyph.text}
          className={`absolute rounded-full border border-brand-gold/30 bg-brand-surface/70 font-mono text-brand-gold/70 backdrop-blur-sm ${
            glyph.size === "md" ? "px-4 py-1.5 text-sm" : "px-3 py-1 text-xs"
          }`}
          style={{
            top: glyph.top,
            [glyph.side === "start" ? "insetInlineStart" : "insetInlineEnd"]: glyph.offset,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            prefersReduced
              ? { opacity: 0.8, scale: 1 }
              : {
                  opacity: 0.8,
                  scale: 1,
                  y: [0, -14, 0],
                }
          }
          transition={
            prefersReduced
              ? { duration: 0.6, delay: glyph.delay }
              : {
                  opacity: { duration: 0.6, delay: glyph.delay },
                  scale: { duration: 0.6, delay: glyph.delay },
                  y: {
                    duration: 5 + index * 0.4,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                    delay: glyph.delay,
                  },
                }
          }
        >
          {glyph.text}
        </motion.span>
      ))}
    </div>
  );
}
