"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { microHover } from "@/lib/motion/tokens";

export function WhatsAppButton({
  variant = "solid",
  className = "",
}: {
  variant?: "solid" | "outline";
  className?: string;
}) {
  const t = useTranslations("common");
  const href = getWhatsAppUrl(t("whatsappMessage"));

  const base =
    "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors";
  const styles =
    variant === "solid"
      ? "bg-brand-gold text-brand-ink hover:bg-brand-gold-soft"
      : "border border-brand-gold text-brand-gold hover:bg-brand-gold/10";

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${styles} ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={microHover}
    >
      <WhatsAppIcon />
      {t("whatsapp")}
    </motion.a>
  );
}

export function WhatsAppIcon({ className }: { className?: string } = {}) {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.94.56 3.75 1.53 5.28L2 22l4.96-1.6a9.83 9.83 0 0 0 5.08 1.4h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.06h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.1 1 1.02-3.02-.2-.31a8.15 8.15 0 0 1-1.26-4.5c0-4.52 3.68-8.2 8.2-8.2 2.2 0 4.26.85 5.81 2.4a8.14 8.14 0 0 1 2.4 5.8c0 4.52-3.68 8.15-8.18 8.15Zm4.5-6.13c-.25-.12-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.12-.16.24-.64.8-.78.96-.15.16-.29.18-.54.06-1.47-.73-2.44-1.31-3.41-2.96-.26-.44.26-.41.74-1.36.08-.16.04-.3-.03-.42-.08-.12-.55-1.33-.76-1.82-.2-.48-.4-.42-.56-.42-.14 0-.31-.02-.47-.02-.16 0-.42.06-.64.3-.23.24-.87.85-.87 2.07 0 1.22.89 2.4 1.02 2.56.13.16 1.74 2.65 4.22 3.61 2.09.81 2.09.54 2.47.5.38-.02 1.22-.5 1.4-.98.17-.48.17-.9.12-.98-.05-.08-.19-.14-.44-.26Z" />
    </svg>
  );
}
