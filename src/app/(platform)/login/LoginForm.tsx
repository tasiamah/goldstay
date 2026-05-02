"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

// Default cooldown surfaced to the user when the auth provider tells
// us they've hit the email-OTP rate limit. The Supabase default
// window is 60 seconds per email; we err slightly longer in the copy
// so a quick retry isn't met with the same error.
const DEFAULT_RATE_LIMIT_SECONDS = 90;

type FormError = {
  // amber for "throttled, try again shortly", red for everything else.
  // Keeps the rate-limit message from looking like a security failure.
  tone: "warn" | "error";
  message: string;
  // When set, we count down a per-second readout below the message.
  retryAtMs?: number;
};

export function LoginForm({ next }: { next?: string }) {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<FormError | null>(null);
  const [sent, setSent] = useState(false);
  const [, forceTick] = useState(0);

  // Tick once a second only while a retry countdown is active. Cheap
  // enough; we tear down as soon as it expires so we're not running
  // an idle interval on the page.
  useEffect(() => {
    if (!error?.retryAtMs) return;
    const id = setInterval(() => forceTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [error?.retryAtMs]);

  const retrySecondsLeft = error?.retryAtMs
    ? Math.max(0, Math.ceil((error.retryAtMs - Date.now()) / 1000))
    : 0;
  const cooldownActive = retrySecondsLeft > 0;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (cooldownActive) return;
    setPending(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const redirectTo = new URL(
      `/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ""}`,
      window.location.origin,
    ).toString();

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    setPending(false);
    if (signInError) {
      setError(translateAuthError(signInError));
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        Check your inbox at <strong>{email}</strong>. The sign-in link expires
        in 60 minutes.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-stone-700">Email</span>
        <input
          type="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 shadow-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
        />
      </label>

      <button
        type="submit"
        disabled={pending || cooldownActive}
        className="inline-flex w-full items-center justify-center rounded-md bg-stone-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
      >
        {pending
          ? "Sending link..."
          : cooldownActive
            ? `Try again in ${retrySecondsLeft}s`
            : "Email me a sign-in link"}
      </button>

      {error ? (
        <ErrorBlock
          tone={error.tone}
          message={error.message}
          retrySecondsLeft={cooldownActive ? retrySecondsLeft : 0}
        />
      ) : null}
    </form>
  );
}

function ErrorBlock({
  tone,
  message,
  retrySecondsLeft,
}: {
  tone: "warn" | "error";
  message: string;
  retrySecondsLeft: number;
}) {
  const cls =
    tone === "warn"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : "border-red-200 bg-red-50 text-red-800";
  return (
    <div className={`rounded-md border px-3 py-2 text-sm ${cls}`}>
      <p>{message}</p>
      {retrySecondsLeft > 0 ? (
        <p className="mt-1 text-xs opacity-80">
          You can request another link in{" "}
          <span className="font-medium tabular-nums">
            {retrySecondsLeft}s
          </span>
          .
        </p>
      ) : null}
    </div>
  );
}

// Maps Supabase auth errors to user-facing copy. The two cases that
// matter to keep humane:
//   * Rate limit — looks like the system is broken if we just dump
//     "email rate limit exceeded". We rephrase as a temporary pause
//     and start a visible countdown so the user knows to wait
//     instead of mashing the button.
//   * Anything else — we keep a short, neutral fallback rather than
//     leaking the raw provider string, which can change shape across
//     supabase-js releases.
function translateAuthError(err: {
  message: string;
  code?: string;
  status?: number;
}): FormError {
  const msg = (err.message ?? "").toLowerCase();
  const isRateLimit =
    err.code === "over_email_send_rate_limit" ||
    err.code === "over_request_rate_limit" ||
    err.status === 429 ||
    msg.includes("rate limit");

  if (isRateLimit) {
    return {
      tone: "warn",
      message:
        "We've temporarily paused sign-in emails to this address to protect your account. Please try again shortly.",
      retryAtMs: Date.now() + DEFAULT_RATE_LIMIT_SECONDS * 1000,
    };
  }

  // Supabase returns a generic "Email not confirmed" / similar strings
  // for OTP, but in our flow OTP creates the user on demand, so the
  // most likely "real" failures are network / Supabase 500s. Keep the
  // copy non-scary and actionable.
  return {
    tone: "error",
    message:
      "We couldn't send your sign-in link just now. Please check the email address and try again. If it keeps failing, email support@goldstay.co.ke.",
  };
}
