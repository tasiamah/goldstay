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
  tone: "warn" | "error" | "info";
  message: string;
  // When set, we count down a per-second readout below the message.
  retryAtMs?: number;
};

// Two parallel paths from this single form. "password" is the new
// default — instant sign-in for anyone who has set one. "magic-link"
// is the legacy / first-time path that still emails a one-tap link
// (and doubles as the fallback when a user hasn't set a password
// yet). The toggle lives on a small button under the password field
// so we don't bury the option but also don't make it the primary
// affordance anymore — magic-link sign-in carries the email-delivery
// latency users have been complaining about.
type Mode = "password" | "magic-link";

export function LoginForm({ next }: { next?: string }) {
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<FormError | null>(null);
  const [sent, setSent] = useState<null | "magic-link" | "recovery">(null);
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

    if (mode === "password") {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        setPending(false);
        setError(translatePasswordError(signInError));
        return;
      }
      if (!data.session) {
        // Defensive: signInWithPassword should always return a session
        // on success, but if Supabase ever changes the shape we don't
        // want a silent no-op.
        setPending(false);
        setError({
          tone: "error",
          message:
            "Sign-in succeeded but no session was returned. Please refresh and try again.",
        });
        return;
      }

      // Hand off to a small server route that resolves whether this
      // user belongs in /admin or /owner and redirects accordingly.
      // Doing it server-side keeps the role logic in one place
      // (mirrors what /auth/callback does for magic-link sign-ins).
      const target = next
        ? `/auth/post-login?next=${encodeURIComponent(next)}`
        : "/auth/post-login";
      window.location.href = target;
      return;
    }

    // Magic-link fallback. Same as the old default behaviour.
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
    setSent("magic-link");
  }

  async function onForgotPassword() {
    if (!email) {
      setError({
        tone: "error",
        message:
          "Enter your email above first, then click \u201cForgot password\u201d again.",
      });
      return;
    }
    if (cooldownActive) return;
    setPending(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const redirectTo = new URL(
      "/auth/callback?next=/account/password",
      window.location.origin,
    ).toString();

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo },
    );

    setPending(false);
    if (resetError) {
      setError(translateAuthError(resetError));
      return;
    }
    setSent("recovery");
  }

  if (sent === "magic-link") {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        Check your inbox at <strong>{email}</strong>. The sign-in link expires
        in 60 minutes.
      </div>
    );
  }

  if (sent === "recovery") {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        We&apos;ve emailed <strong>{email}</strong> a link to set a new
        password. The link expires in 60 minutes.
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
          autoComplete="email"
          className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 shadow-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
        />
      </label>

      {mode === "password" ? (
        <label className="block">
          <span className="flex items-center justify-between text-sm font-medium text-stone-700">
            <span>Password</span>
            <button
              type="button"
              onClick={onForgotPassword}
              disabled={pending || cooldownActive}
              className="text-xs font-normal text-stone-600 underline-offset-2 hover:underline disabled:opacity-60"
            >
              Forgot password?
            </button>
          </span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={"\u2022".repeat(8)}
            autoComplete="current-password"
            className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 shadow-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          />
        </label>
      ) : null}

      <button
        type="submit"
        disabled={pending || cooldownActive}
        className="inline-flex w-full items-center justify-center rounded-md bg-stone-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
      >
        {pending
          ? mode === "password"
            ? "Signing in..."
            : "Sending link..."
          : cooldownActive
            ? `Try again in ${retrySecondsLeft}s`
            : mode === "password"
              ? "Sign in"
              : "Email me a sign-in link"}
      </button>

      <div className="text-center text-xs text-stone-500">
        {mode === "password" ? (
          <button
            type="button"
            onClick={() => {
              setError(null);
              setMode("magic-link");
            }}
            className="text-stone-600 underline-offset-2 hover:text-stone-900 hover:underline"
          >
            Email me a sign-in link instead
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setError(null);
              setMode("password");
            }}
            className="text-stone-600 underline-offset-2 hover:text-stone-900 hover:underline"
          >
            Sign in with a password instead
          </button>
        )}
      </div>

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
  tone: "warn" | "error" | "info";
  message: string;
  retrySecondsLeft: number;
}) {
  const cls =
    tone === "warn"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : tone === "info"
        ? "border-stone-200 bg-stone-50 text-stone-700"
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

// Maps Supabase password sign-in errors to friendly copy. The most
// common failure for established users is a typo in the password, so
// we steer them at "Forgot password?" or the magic-link fallback
// rather than just dumping the raw provider string.
function translatePasswordError(err: {
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
        "Too many sign-in attempts. Please wait a moment before trying again.",
      retryAtMs: Date.now() + DEFAULT_RATE_LIMIT_SECONDS * 1000,
    };
  }

  // Supabase deliberately returns the same error for "wrong password"
  // and "no such user" so we can't tell first-time users apart from
  // typo'd ones. The copy nudges them at both recovery options.
  if (
    err.code === "invalid_credentials" ||
    msg.includes("invalid login credentials") ||
    msg.includes("invalid_credentials")
  ) {
    return {
      tone: "error",
      message:
        "That email and password don\u2019t match. If you haven\u2019t set a password yet, click \u201cForgot password?\u201d to set one — or use a sign-in link instead.",
    };
  }

  if (
    err.code === "email_not_confirmed" ||
    msg.includes("email not confirmed")
  ) {
    return {
      tone: "info",
      message:
        "Your email isn\u2019t confirmed yet. Use \u201cEmail me a sign-in link instead\u201d below to confirm and sign in.",
    };
  }

  return {
    tone: "error",
    message:
      "We couldn\u2019t sign you in just now. Please try again, or use \u201cEmail me a sign-in link instead\u201d.",
  };
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
