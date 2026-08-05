import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DownloadButton } from "./DownloadButton";

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

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const statusStyles: Record<string, string> = {
  verified: "bg-emerald-950 text-emerald-300 border-emerald-800",
  revoked: "bg-red-950 text-red-300 border-red-800",
  expired: "bg-amber-950 text-amber-300 border-amber-800",
};

const statusLabels: Record<string, string> = {
  verified: "✓ Verified",
  revoked: "Revoked",
  expired: "Expired",
};

export default async function VerificationPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const normalizedCode = code.trim().toUpperCase();

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

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-12 text-neutral-100">
      <div className="mx-auto max-w-2xl space-y-8">
        <header className="text-center">
          <p className="text-sm text-neutral-500">
            Bayt Languages — Digital Translation Verification
          </p>
          <div
            className={`mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium ${statusStyles[record.status]}`}
          >
            {statusLabels[record.status]}
          </div>
          <p className="mt-3 font-mono text-lg text-neutral-300">
            {record.reference_code}
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/verify/${record.reference_code}/qr`}
            alt="QR code linking to this verification page"
            width={160}
            height={160}
            className="mx-auto mt-4 rounded-lg border border-neutral-800 bg-white p-2"
          />
        </header>

        <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <h1 className="text-xl font-semibold">{record.title}</h1>
          {record.description && (
            <p className="mt-2 text-sm text-neutral-400">{record.description}</p>
          )}

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <Field label="Client" value={record.client_display_name} />
            <Field label="Client type" value={record.client_type} />
            <Field label="Document category" value={record.category} />
            <Field label="Classification" value={record.classification} />
            <Field label="Original language" value={record.original_language} />
            <Field label="Translated language" value={record.translated_language} />
            <Field label="Original pages" value={String(record.original_page_count)} />
            <Field
              label="Translated pages"
              value={String(record.translated_page_count)}
            />
            <Field label="Requested" value={formatDate(record.requested_at)} />
            <Field
              label="Translation started"
              value={formatDate(record.translation_started_at)}
            />
            <Field
              label="Translation completed"
              value={formatDate(record.translation_completed_at)}
            />
            <Field
              label="Review completed"
              value={formatDate(record.review_completed_at)}
            />
            <Field label="Delivered" value={formatDate(record.delivered_at)} />
            <Field
              label="Certification number"
              value={record.certification_number ?? "—"}
            />
          </dl>
        </section>

        <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="text-sm font-semibold text-neutral-300">File integrity</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Field
              label="Current version"
              value={`v${record.current_version_number ?? 1}`}
            />
            <div>
              <dt className="text-neutral-500">SHA-256 fingerprint</dt>
              <dd className="mt-1 break-all font-mono text-xs text-neutral-400">
                {record.current_sha256_hash}
              </dd>
            </div>
          </dl>
        </section>

        {record.status === "verified" && (
          <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-center space-y-4">
            <DownloadButton
              code={record.reference_code}
              pinRequired={record.pin_enabled}
            />
            <div>
              <a
                href={`/api/verify/${record.reference_code}/certificate`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-400 underline hover:text-neutral-200"
              >
                Download verification certificate (PDF)
              </a>
            </div>
          </section>
        )}

        {history.length > 0 && (
          <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-sm font-semibold text-neutral-300">
              Version history
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              {history.map((version) => (
                <li
                  key={version.version_number}
                  className="border-t border-neutral-800 pt-3 first:border-t-0 first:pt-0"
                >
                  <p className="text-neutral-300">
                    v{version.version_number} — {formatDate(version.uploaded_at)}
                  </p>
                  {version.supersedes_reason && (
                    <p className="text-neutral-500">{version.supersedes_reason}</p>
                  )}
                  <p className="mt-1 break-all font-mono text-xs text-neutral-500">
                    {version.sha256_hash}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="text-sm font-semibold text-neutral-300">Legal notice</h2>
          <p className="mt-2 text-xs leading-relaxed text-neutral-500">
            This certificate confirms that the document described above was
            translated and issued by Bayt Languages. This verification page and its
            contents are provided for the sole purpose of confirming the
            authenticity of the translation. Any alteration of the translated
            document invalidates this verification. For questions regarding this
            certificate, please contact Bayt Languages directly.
          </p>
        </section>

        <p className="text-center text-xs text-neutral-600">
          Issued by Bayt Languages
        </p>
      </div>
    </main>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-neutral-500">{label}</dt>
      <dd className="mt-0.5 text-neutral-200">{value}</dd>
    </div>
  );
}
