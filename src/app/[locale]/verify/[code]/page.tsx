import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { DownloadButton } from "./DownloadButton";
import { RevealSeal } from "./RevealSeal";

type VerificationView = {
  reference_code: string;
  status: "verified" | "revoked" | "expired";
  issued_at: string;
  pin_enabled: boolean;
  certificate_available: boolean;
  client_display_name: string;
  client_type: string;
  title: string;
  description: string | null;
  category: string;
  classification: string;
  original_language: string;
  translated_language: string;
  original_page_count: number;
  translated_page_count: number;
  requested_at: string | null;
  translation_started_at: string | null;
  translation_completed_at: string | null;
  review_completed_at: string | null;
  delivered_at: string | null;
  certification_number: string | null;
  current_version_number: number | null;
  current_sha256_hash: string | null;
};

type VersionHistoryRow = {
  version_number: number;
  sha256_hash: string;
  uploaded_at: string;
  supersedes_reason: string | null;
};

const statusStyles: Record<string, string> = {
  verified: "border-brand-gold text-brand-gold",
  revoked: "border-red-800 bg-red-950 text-red-300",
  expired: "border-amber-800 bg-amber-950 text-amber-300",
};

export default async function VerificationPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("verify");
  const normalizedCode = code.trim().toUpperCase();

  function formatDate(value: string | null) {
    if (!value) return "—";
    return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
      new Date(value),
    );
  }

  const supabase = await createClient();

  const { data: recordData } = await supabase
    .from("public_verification_view")
    .select("*")
    .eq("reference_code", normalizedCode)
    .maybeSingle();

  if (!recordData) {
    notFound();
  }

  const record = recordData as VerificationView;

  const { data: historyData } = await supabase
    .from("public_version_history_view")
    .select("*")
    .eq("reference_code", normalizedCode)
    .order("version_number", { ascending: false });

  const history = (historyData ?? []) as VersionHistoryRow[];

  const enumLabel = (group: "clientType" | "category" | "classification", value: string) =>
    t.has(`enums.${group}.${value}`) ? t(`enums.${group}.${value}` as never) : value;

  return (
    <main className="min-h-screen px-4 py-16">
      <div className="mx-auto max-w-2xl space-y-8">
        <RevealSeal>
          <header className="text-center">
            <p className="text-sm text-brand-muted">{t("brand")}</p>
            <div
              className={`mt-4 inline-flex items-center gap-2 rounded-full border px-5 py-1.5 text-sm font-semibold ${statusStyles[record.status]}`}
            >
              {t(`status.${record.status}` as never)}
            </div>
            <p className="mt-3 font-mono text-lg text-brand-parchment">
              {record.reference_code}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/verify/${record.reference_code}/qr`}
              alt="QR code linking to this verification page"
              width={160}
              height={160}
              className="mx-auto mt-4 rounded-lg border border-brand-border bg-white p-2"
            />
          </header>
        </RevealSeal>

        <section className="rounded-xl border border-brand-border bg-brand-surface p-6 shadow-lg shadow-black/10">
          <h1 className="text-xl font-bold text-brand-parchment">
            {record.title}
          </h1>
          {record.description && (
            <p className="mt-2 text-sm text-brand-muted">{record.description}</p>
          )}

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <Field label={t("fields.client")} value={record.client_display_name} />
            <Field
              label={t("fields.clientType")}
              value={enumLabel("clientType", record.client_type)}
            />
            <Field
              label={t("fields.category")}
              value={enumLabel("category", record.category)}
            />
            <Field
              label={t("fields.classification")}
              value={enumLabel("classification", record.classification)}
            />
            <Field label={t("fields.originalLanguage")} value={record.original_language} />
            <Field
              label={t("fields.translatedLanguage")}
              value={record.translated_language}
            />
            <Field
              label={t("fields.originalPages")}
              value={String(record.original_page_count)}
            />
            <Field
              label={t("fields.translatedPages")}
              value={String(record.translated_page_count)}
            />
            <Field label={t("fields.requested")} value={formatDate(record.requested_at)} />
            <Field
              label={t("fields.translationStarted")}
              value={formatDate(record.translation_started_at)}
            />
            <Field
              label={t("fields.translationCompleted")}
              value={formatDate(record.translation_completed_at)}
            />
            <Field
              label={t("fields.reviewCompleted")}
              value={formatDate(record.review_completed_at)}
            />
            <Field label={t("fields.delivered")} value={formatDate(record.delivered_at)} />
            <Field
              label={t("fields.certificationNumber")}
              value={record.certification_number ?? "—"}
            />
          </dl>
        </section>

        <section className="rounded-xl border border-brand-border bg-brand-surface p-6 shadow-lg shadow-black/10">
          <h2 className="text-sm font-semibold text-brand-parchment">
            {t("fileIntegrity")}
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Field
              label={t("currentVersion")}
              value={`v${record.current_version_number ?? 1}`}
            />
            <div>
              <dt className="text-brand-muted">{t("fingerprint")}</dt>
              <dd className="mt-1 break-all font-mono text-xs text-brand-muted">
                {record.current_sha256_hash}
              </dd>
            </div>
          </dl>
        </section>

        {record.status === "verified" && (
          <section className="space-y-4 rounded-xl border border-brand-border bg-brand-surface p-6 shadow-lg shadow-black/10 text-center">
            <DownloadButton
              code={record.reference_code}
              pinRequired={record.pin_enabled}
            />
            <div>
              <a
                href={`/api/verify/${record.reference_code}/certificate`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand-muted underline hover:text-brand-parchment"
              >
                {t("downloadCertificate")}
              </a>
            </div>
          </section>
        )}

        {history.length > 0 && (
          <section className="rounded-xl border border-brand-border bg-brand-surface p-6 shadow-lg shadow-black/10">
            <h2 className="text-sm font-semibold text-brand-parchment">
              {t("versionHistory")}
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              {history.map((version) => (
                <li
                  key={version.version_number}
                  className="border-t border-brand-border pt-3 first:border-t-0 first:pt-0"
                >
                  <p className="text-brand-parchment">
                    v{version.version_number} — {formatDate(version.uploaded_at)}
                  </p>
                  {version.supersedes_reason && (
                    <p className="text-brand-muted">{version.supersedes_reason}</p>
                  )}
                  <p className="mt-1 break-all font-mono text-xs text-brand-muted">
                    {version.sha256_hash}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="rounded-xl border border-brand-border bg-brand-surface p-6 shadow-lg shadow-black/10">
          <h2 className="text-sm font-semibold text-brand-parchment">
            {t("legalNoticeTitle")}
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-brand-muted">
            {t("legalNoticeBody")}
          </p>
        </section>

        <p className="text-center text-xs text-brand-muted">{t("issuedBy")}</p>
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
