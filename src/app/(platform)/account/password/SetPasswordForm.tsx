"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

// Server-side minimum length must match Supabase's project setting
// (default 6, we lift to 8 here for our own UX). If you change the
// dashboard minimum, change this too — the call will reject below
// the project minimum no matter what we accept client-side.
const MIN_PASSWORD_LENGTH = 8;

export function SetPasswordForm({ next }: { next?: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setError("The two passwords don\u2019t match.");
      return;
    }

    setPending(true);
    const supabase = createSupabaseBrowserClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });
    setPending(false);

    if (updateError) {
      const msg = (updateError.message ?? "").toLowerCase();
      if (msg.includes("same") && msg.includes("password")) {
        setError(
          "That\u2019s the same password you already had. Pick a different one.",
        );
      } else if (
        updateError.code === "weak_password" ||
        msg.includes("weak password")
      ) {
        setError(
          "That password is too easy to guess. Try something longer or more unusual.",
        );
      } else {
        setError(
          "We couldn\u2019t save that password. Please try again, or email support@goldstay.co.ke if it keeps failing.",
        );
      }
      return;
    }

    setDone(true);

    // Brief pause so the user can register the success message before
    // we hop them onward. The destination is whatever was passed
    // through the recovery link (?next=) or the role-resolving
    // post-login route as a sensible default.
    const target = next && next.startsWith("/") ? next : "/auth/post-login";
    window.setTimeout(() => {
      window.location.href = target;
    }, 600);
  }

  if (done) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        Password saved. Taking you to your dashboard&hellip;
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-stone-700">
          New password
        </span>
        <input
          type="password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          autoFocus
          className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 shadow-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-stone-700">
          Confirm new password
        </span>
        <input
          type="password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 shadow-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-md bg-stone-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
      >
        {pending ? "Saving\u2026" : "Save password"}
      </button>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}
    </form>
  );
}
