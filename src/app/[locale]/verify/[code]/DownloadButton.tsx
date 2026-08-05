"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

export function DownloadButton({
  code,
  pinRequired,
}: {
  code: string;
  pinRequired: boolean;
}) {
  const t = useTranslations("verify");
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestDownload(pinValue?: string) {
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/verify/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, pin: pinValue }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setError(t("notAvailable"));
      return;
    }

    const body = (await response.json()) as { url: string };
    window.location.href = body.url;
  }

  function handleClick() {
    if (pinRequired) {
      setShowPinInput(true);
      return;
    }
    void requestDownload();
  }

  function handlePinSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void requestDownload(pin);
  }

  const buttonClass =
    "rounded-md bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90 disabled:opacity-50";

  if (showPinInput) {
    return (
      <form onSubmit={handlePinSubmit} className="flex flex-col items-center gap-2">
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-2">
          <input
            type="password"
            inputMode="numeric"
            placeholder={t("enterPin")}
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            className="w-32 rounded-md border border-brand-border bg-brand-surface px-3 py-2 text-sm text-brand-parchment"
            autoFocus
          />
          <button type="submit" disabled={isSubmitting || pin.length === 0} className={buttonClass}>
            {t("unlock")}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="button" onClick={handleClick} disabled={isSubmitting} className={buttonClass}>
        {t("download")}
      </button>
    </div>
  );
}
