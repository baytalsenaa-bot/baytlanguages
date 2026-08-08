"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function prepareSession() {
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const code = new URLSearchParams(window.location.search).get("code");

      if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (sessionError) {
          setError(sessionError.message);
          return;
        }
        window.history.replaceState(null, "", window.location.pathname);
        setIsReady(true);
        return;
      }

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setError(exchangeError.message);
          return;
        }
        window.history.replaceState(null, "", window.location.pathname);
        setIsReady(true);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setIsReady(true);
        return;
      }

      setError("This password reset link is invalid or has expired. Please request a new one.");
    }

    prepareSession();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setIsSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/admin/login");
    }, 1500);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm space-y-4 rounded-lg border border-neutral-800 bg-neutral-900 p-8">
        <h1 className="text-lg font-semibold text-neutral-100">Set a new password</h1>

        {error && (
          <p className="rounded-md bg-red-950 px-3 py-2 text-sm text-red-300">{error}</p>
        )}

        {success && (
          <p className="rounded-md bg-emerald-950 px-3 py-2 text-sm text-emerald-300">
            Password updated. Redirecting to sign in…
          </p>
        )}

        {!success && isReady && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm text-neutral-400">
                New password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-sm text-neutral-400">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900 disabled:opacity-50"
            >
              {isSubmitting ? "Updating…" : "Update password"}
            </button>
          </form>
        )}

        {!success && !isReady && !error && (
          <p className="text-sm text-neutral-400">Verifying your reset link…</p>
        )}
      </div>
    </main>
  );
}
