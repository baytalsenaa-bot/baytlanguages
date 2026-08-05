"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  clientTypeValues,
  visibilityModeValues,
  documentCategoryValues,
  translationClassificationValues,
} from "@/lib/validations/document";

const inputClass =
  "w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100";
const labelClass = "block text-sm text-neutral-400 mb-1";
const fieldClass = "space-y-1";

export default function NewDocumentPage() {
  const router = useRouter();
  const [pinEnabled, setPinEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ referenceCode: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/admin/documents", {
      method: "POST",
      body: formData,
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Something went wrong. Please try again.");
      return;
    }

    const body = (await response.json()) as { referenceCode: string };
    setResult(body);
  }

  if (result) {
    return (
      <div className="max-w-lg">
        <h1 className="text-xl font-semibold">Document published</h1>
        <p className="mt-2 text-neutral-400">
          Verification reference code:
        </p>
        <p className="mt-1 rounded-md border border-neutral-700 bg-neutral-900 px-4 py-3 font-mono text-lg text-neutral-100">
          {result.referenceCode}
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/documents")}
            className="rounded-md bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900"
          >
            Back to documents
          </button>
          <button
            type="button"
            onClick={() => setResult(null)}
            className="rounded-md border border-neutral-700 px-3 py-2 text-sm text-neutral-100"
          >
            Add another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      <h1 className="text-xl font-semibold">New document</h1>

      {error && (
        <p className="rounded-md bg-red-950 px-3 py-2 text-sm text-red-300">{error}</p>
      )}

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-neutral-300">Client</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className={fieldClass}>
            <label className={labelClass} htmlFor="clientPublicName">
              Client name
            </label>
            <input
              id="clientPublicName"
              name="clientPublicName"
              required
              className={inputClass}
            />
          </div>
          <div className={fieldClass}>
            <label className={labelClass} htmlFor="clientType">
              Client type
            </label>
            <select id="clientType" name="clientType" className={inputClass} defaultValue="individual">
              {clientTypeValues.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className={fieldClass}>
            <label className={labelClass} htmlFor="clientVisibilityMode">
              Name visibility on certificate
            </label>
            <select
              id="clientVisibilityMode"
              name="clientVisibilityMode"
              className={inputClass}
              defaultValue="masked"
            >
              {visibilityModeValues.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-neutral-300">Document</h2>
        <div className={fieldClass}>
          <label className={labelClass} htmlFor="title">
            Title
          </label>
          <input id="title" name="title" required className={inputClass} />
        </div>
        <div className={fieldClass}>
          <label className={labelClass} htmlFor="description">
            Description
          </label>
          <textarea id="description" name="description" rows={3} className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className={fieldClass}>
            <label className={labelClass} htmlFor="category">
              Category
            </label>
            <select id="category" name="category" className={inputClass} defaultValue="legal">
              {documentCategoryValues.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className={fieldClass}>
            <label className={labelClass} htmlFor="classification">
              Classification
            </label>
            <select
              id="classification"
              name="classification"
              className={inputClass}
              defaultValue="certified"
            >
              {translationClassificationValues.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className={fieldClass}>
            <label className={labelClass} htmlFor="originalLanguage">
              Original language
            </label>
            <input
              id="originalLanguage"
              name="originalLanguage"
              required
              placeholder="e.g. fr"
              className={inputClass}
            />
          </div>
          <div className={fieldClass}>
            <label className={labelClass} htmlFor="translatedLanguage">
              Translated language
            </label>
            <input
              id="translatedLanguage"
              name="translatedLanguage"
              required
              placeholder="e.g. ar"
              className={inputClass}
            />
          </div>
          <div className={fieldClass}>
            <label className={labelClass} htmlFor="originalPageCount">
              Original page count
            </label>
            <input
              id="originalPageCount"
              name="originalPageCount"
              type="number"
              min={1}
              required
              className={inputClass}
            />
          </div>
          <div className={fieldClass}>
            <label className={labelClass} htmlFor="translatedPageCount">
              Translated page count
            </label>
            <input
              id="translatedPageCount"
              name="translatedPageCount"
              type="number"
              min={1}
              required
              className={inputClass}
            />
          </div>
          <div className={fieldClass}>
            <label className={labelClass} htmlFor="certificationNumber">
              Certification number
            </label>
            <input id="certificationNumber" name="certificationNumber" className={inputClass} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-neutral-300">Timeline</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className={fieldClass}>
            <label className={labelClass} htmlFor="requestedAt">
              Requested
            </label>
            <input id="requestedAt" name="requestedAt" type="date" className={inputClass} />
          </div>
          <div className={fieldClass}>
            <label className={labelClass} htmlFor="translationStartedAt">
              Translation started
            </label>
            <input
              id="translationStartedAt"
              name="translationStartedAt"
              type="date"
              className={inputClass}
            />
          </div>
          <div className={fieldClass}>
            <label className={labelClass} htmlFor="translationCompletedAt">
              Translation completed
            </label>
            <input
              id="translationCompletedAt"
              name="translationCompletedAt"
              type="date"
              className={inputClass}
            />
          </div>
          <div className={fieldClass}>
            <label className={labelClass} htmlFor="reviewCompletedAt">
              Review completed
            </label>
            <input
              id="reviewCompletedAt"
              name="reviewCompletedAt"
              type="date"
              className={inputClass}
            />
          </div>
          <div className={fieldClass}>
            <label className={labelClass} htmlFor="deliveredAt">
              Delivered
            </label>
            <input id="deliveredAt" name="deliveredAt" type="date" className={inputClass} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-neutral-300">Internal</h2>
        <div className={fieldClass}>
          <label className={labelClass} htmlFor="internalNotes">
            Internal notes (never shown publicly)
          </label>
          <textarea id="internalNotes" name="internalNotes" rows={3} className={inputClass} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-neutral-300">Security</h2>
        <label className="flex items-center gap-2 text-sm text-neutral-300">
          <input
            type="checkbox"
            name="pinEnabled"
            value="true"
            checked={pinEnabled}
            onChange={(event) => setPinEnabled(event.target.checked)}
          />
          Require a PIN to download the translated file
        </label>
        {pinEnabled && (
          <div className={fieldClass}>
            <label className={labelClass} htmlFor="pin">
              PIN (4–8 digits)
            </label>
            <input
              id="pin"
              name="pin"
              inputMode="numeric"
              pattern="\d{4,8}"
              required={pinEnabled}
              className={inputClass}
            />
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-neutral-300">Translated file</h2>
        <div className={fieldClass}>
          <label className={labelClass} htmlFor="file">
            PDF file
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept="application/pdf"
            required
            className={inputClass}
          />
        </div>
      </section>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 disabled:opacity-50"
      >
        {isSubmitting ? "Publishing…" : "Publish document"}
      </button>
    </form>
  );
}
