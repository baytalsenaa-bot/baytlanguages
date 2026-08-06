import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ShieldCheckIcon } from "@/components/marketing/icons";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function SampleVerificationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("verify");
  const enumLabel = (group: "clientType" | "category" | "classification", value: string) =>
    t.has(`enums.${group}.${value}`) ? t(`enums.${group}.${value}` as never) : value;

  const sample = {
    reference_code: "BL-7K9X2Q4M",
    client_display_name: "A**** H.",
    client_type: "individual",
    title: "Marriage Certificate",
    category: "government",
    classification: "certified",
    original_language: "Arabic",
    translated_language: "English",
    original_page_count: 2,
    translated_page_count: 2,
    version: 1,
    sha256_hash:
      "3b1f2e8d9c6a4f7e1d0b8c5a2f9e6d3c1b0a7f4e9d2c8b5a1f0e3d6c9b2a5f8e",
  };

  return (
    <main className="min-h-screen px-4 py-16">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="rounded-md border border-brand-gold/40 bg-brand-gold/10 px-4 py-2 text-center text-xs font-medium uppercase tracking-widest text-brand-gold">
          {t("sampleBanner")}
        </div>

        <header className="text-center">
          <p className="text-sm text-brand-muted">{t("brand")}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-gold px-5 py-1.5 text-sm font-semibold text-brand-gold">
            <ShieldCheckIcon className="h-4 w-4" />
            {t("status.verified")}
          </div>
          <p className="mt-3 font-mono text-lg text-brand-parchment">
            {sample.reference_code}
          </p>
        </header>

        <section className="rounded-xl border border-brand-border bg-brand-surface p-6 shadow-lg shadow-black/10">
          <h1 className="text-xl font-bold text-brand-parchment">{sample.title}</h1>
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <Field label={t("fields.client")} value={sample.client_display_name} />
            <Field
              label={t("fields.clientType")}
              value={enumLabel("clientType", sample.client_type)}
            />
            <Field
              label={t("fields.category")}
              value={enumLabel("category", sample.category)}
            />
            <Field
              label={t("fields.classification")}
              value={enumLabel("classification", sample.classification)}
            />
            <Field label={t("fields.originalLanguage")} value={sample.original_language} />
            <Field label={t("fields.translatedLanguage")} value={sample.translated_language} />
            <Field label={t("fields.originalPages")} value={String(sample.original_page_count)} />
            <Field
              label={t("fields.translatedPages")}
              value={String(sample.translated_page_count)}
            />
          </dl>
        </section>

        <section className="rounded-xl border border-brand-border bg-brand-surface p-6 shadow-lg shadow-black/10">
          <h2 className="text-sm font-semibold text-brand-parchment">{t("fileIntegrity")}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Field label={t("currentVersion")} value={`v${sample.version}`} />
            <div>
              <dt className="text-brand-muted">{t("fingerprint")}</dt>
              <dd className="mt-1 break-all font-mono text-xs text-brand-muted">
                {sample.sha256_hash}
              </dd>
            </div>
          </dl>
        </section>

        <p className="text-center text-xs text-brand-muted">{t("sampleFooter")}</p>
      </div>
    </main>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-brand-muted">{label}</dt>
      <dd className="mt-0.5 text-brand-parchment">{value}</dd>
    </div>
  );
}
