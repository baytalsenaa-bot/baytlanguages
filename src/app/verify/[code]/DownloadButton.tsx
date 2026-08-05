"use client";

import { useState, type FormEvent } from "react";

export function DownloadButton({
  code,
  pinRequired,
}: {
  code: string;
  pinRequired: boolean;
}) {
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
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "This document is not available for download.");
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

  if (showPinInput) {
    return (
      <form onSubmit={handlePinSubmit} className="flex flex-col items-center gap-2">
        {error && <p className="text-sm text-red-300">{error}</p>}
        <div className="flex gap-2">
          <input
            type="password"
            inputMode="numeric"
            placeholder="Enter PIN"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            className="w-32 rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
            autoFocus
          />
          <button
            type="submit"
            disabled={isSubmitting || pin.length === 0}
            className="rounded-md bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 disabled:opacity-50"
          >
            {isSubmitting ? "Checking…" : "Unlock"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {error && <p className="text-sm text-red-300">{error}</p>}
      <button
        type="button"
        onClick={handleClick}
        disabled={isSubmitting}
        className="rounded-md bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 disabled:opacity-50"
      >
        {isSubmitting ? "Preparing…" : "Download translated document"}
      </button>
    </div>
  );
}
