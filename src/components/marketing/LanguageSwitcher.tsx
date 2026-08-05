"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const nativeNames: Record<string, string> = {
  en: "English",
  ar: "العربية",
  zh: "中文",
};

export function LanguageSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="relative inline-flex items-center gap-1 rounded-full border border-brand-border p-1 text-xs">
      <span className="sr-only">{t("language")}</span>
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => router.replace(pathname, { locale: loc })}
          className={`rounded-full px-3 py-1 font-medium transition-colors ${
            loc === locale
              ? "bg-brand-gold text-brand-ink"
              : "text-brand-muted hover:text-brand-parchment"
          }`}
          aria-current={loc === locale}
        >
          {nativeNames[loc]}
        </button>
      ))}
    </div>
  );
}
