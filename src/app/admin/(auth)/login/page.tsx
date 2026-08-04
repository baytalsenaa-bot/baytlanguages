"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (signInError) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg border border-neutral-800 bg-neutral-900 p-8"
      >
        <h1 className="text-lg font-semibold text-neutral-100">
          Bayt Languages — Admin
        </h1>

        {error && (
          <p className="rounded-md bg-red-950 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm text-neutral-400">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm text-neutral-400">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900 disabled:opacity-50"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
