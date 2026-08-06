"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { ShieldCheckIcon } from "@/components/marketing/icons";

export default function VerifyLookupPage() {
  const t = useTranslations("verify.lookup");
  const tc = useTranslations("common");
  const router = useRouter();
  const [code, setCode] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = code.trim().toUpperCase();
    if (!normalized) return;
    router.push(`/verify/${encodeURIComponent(normalized)}`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-brand-gold/40 bg-brand-gold/10 text-brand-gold">
          <ShieldCheckIcon className="h-6 w-6" />
        </div>
        <p className="mt-4 text-sm text-brand-muted">{tc("brand")}</p>
        <p className="mt-4 text-sm font-medium uppercase tracking-widest text-brand-gold">
          {t("eyebrow")}
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-brand-parchment">
          {t("title")}
        </h1>
        <p className="mt-4 text-sm text-brand-muted">{t("subtitle")}</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder={t("placeholder")}
            className="flex-1 rounded-md border border-brand-border bg-brand-surface px-4 py-3 text-center font-mono text-sm text-brand-parchment sm:text-start"
          />
          <button
            type="submit"
            className="rounded-md bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-ink hover:opacity-90"
          >
            {t("submit")}
          </button>
        </form>

        <Link
          href="/verify/sample"
          className="mt-4 inline-block text-sm text-brand-muted underline hover:text-brand-parchment"
        >
          {t("sampleCta")}
        </Link>

        <div className="mt-10 rounded-xl border border-brand-border bg-brand-surface p-5 text-start">
          <h2 className="text-sm font-semibold text-brand-parchment">{t("explainTitle")}</h2>
          <p className="mt-2 text-sm text-brand-muted">{t("explainBody")}</p>
          <p className="mt-3 text-xs text-brand-muted">{t("privacyNote")}</p>
        </div>
      </div>
    </main>
  );
}
