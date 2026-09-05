"use client";

import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { flyIn, staggerContainer, microHover } from "@/lib/motion/tokens";
import { useReducedMotionSafe } from "@/lib/motion/useReducedMotionSafe";

type CategoryCard = { slug: string; title: string; shortDescription: string };

export function ServiceCategoriesGrid({
  eyebrow,
  title,
  subtitle,
  cta,
  categories,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  categories: CategoryCard[];
}) {
  const header = useReducedMotionSafe(flyIn("up"));
  const item = useReducedMotionSafe(flyIn("up"));
  const container = useReducedMotionSafe(staggerContainer(0.08));

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
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
          <motion.p variants={header} className="mt-4 text-brand-muted">
            {subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
          className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((category) => (
            <motion.div key={category.slug} variants={item}>
              <Link
                href={`/services/${category.slug}`}
                className="group flex h-full flex-col rounded-xl border border-brand-border bg-brand-surface p-6 shadow-lg shadow-black/10 transition-[box-shadow,border-color] hover:border-brand-gold/50 hover:shadow-brand-gold/10"
              >
                <h3 className="text-lg font-bold text-brand-parchment">{category.title}</h3>
                <p className="mt-2 flex-1 text-sm text-brand-muted">
                  {category.shortDescription}
                </p>
                <motion.span
                  whileHover={{ x: 2 }}
                  transition={microHover}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-gold"
                >
                  {cta}
                  <span aria-hidden>→</span>
                </motion.span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
