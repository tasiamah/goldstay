"use client";

import { useTransition, useState } from "react";
import { resendOwnerWelcomeAction } from "../actions";

// Manual re-trigger of the welcome email + magic link from the owner
// detail page. Used when the original send bounced (typo'd email),
// the landlord deleted the email, or the 60-minute link expired
// before they got to it.
//
// We surface the result inline rather than via a toast so an
// operator who clicks twice gets unambiguous feedback per click.
export function ResendWelcomeButton({ ownerId }: { ownerId: string }) {
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "ok" }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  function onClick() {
    setStatus({ kind: "idle" });
    start(async () => {
      const res = await resendOwnerWelcomeAction(ownerId);
      if (res.ok) setStatus({ kind: "ok" });
      else setStatus({ kind: "error", message: res.error });
    });
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="text-xs text-stone-500 underline-offset-2 hover:text-stone-900 hover:underline disabled:opacity-60"
      >
        {pending ? "Sending…" : "Resend welcome email"}
      </button>
      {status.kind === "ok" ? (
        <span className="text-xs text-emerald-700">Sent.</span>
      ) : status.kind === "error" ? (
        <span className="text-xs text-red-700">{status.message}</span>
      ) : null}
    </span>
  );
}
