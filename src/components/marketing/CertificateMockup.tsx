"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { ScanLine } from "./ScanLine";
import { ShieldCheckIcon, QrCodeIcon } from "./icons";

const SAMPLE_REFERENCE = "BL-7K9X2Q4M";

export function CertificateMockup() {
  const t = useTranslations("home.hero");
  const tv = useTranslations("verify");
  const prefersReduced = useReducedMotion();
  const [verified, setVerified] = useState(!!prefersReduced);

  useEffect(() => {
    if (prefersReduced) return;
    const timer = setTimeout(() => setVerified(true), 1200);
    return () => clearTimeout(timer);
  }, [prefersReduced]);

  return (
    <div className="relative mx-auto w-full max-w-sm rotate-1 overflow-hidden rounded-2xl border border-brand-gold/30 bg-brand-surface p-6 shadow-2xl shadow-black/30">
      <ScanLine active={!prefersReduced && !verified} />

      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-brand-gold">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
          {t("mockupEyebrow")}
        </p>
        <ShieldCheckIcon className="h-5 w-5 text-brand-gold" />
      </div>

      <div className="mt-6 space-y-3">
        <FieldRow label={tv("fields.client")} value="A**** H." delay={0.1} verified={verified} />
        <FieldRow
          label={t("mockupReferenceLabel")}
          value={SAMPLE_REFERENCE}
          delay={0.2}
          verified={verified}
          mono
        />
        <FieldRow
          label={tv("fields.classification")}
          value={tv("enums.classification.certified")}
          delay={0.3}
          verified={verified}
        />
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-brand-border/60 pt-4">
        <motion.div
          initial={false}
          animate={{ opacity: verified ? 1 : 0, scale: verified ? 1 : 0.85 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-1.5 rounded-full border border-brand-gold/50 bg-brand-gold/10 px-3 py-1"
        >
          <ShieldCheckIcon className="h-3.5 w-3.5 text-brand-gold" />
          <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-gold">
            {tv("status.verified")}
          </span>
        </motion.div>
        <QrCodeIcon className="h-10 w-10 text-brand-parchment/80" />
      </div>
    </div>
  );
}

function FieldRow({
  label,
  value,
  delay,
  verified,
  mono,
}: {
  label: string;
  value: string;
  delay: number;
  verified: boolean;
  mono?: boolean;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: verified ? 1 : 0.35, y: verified ? 0 : 4 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1], delay: verified ? delay : 0 }}
      className="flex items-center justify-between gap-4 text-sm"
    >
      <span className="text-brand-muted">{label}</span>
      <span className={`text-brand-parchment ${mono ? "font-mono tracking-wide" : ""}`}>
        {value}
      </span>
    </motion.div>
  );
}
