"use client";

// The confirm button on the unsubscribe page.
//
// A client component only because it needs pending and result state.
// The mutation itself is the server action; see actions.ts for why
// this is a POST rather than something the GET does on its own.

import { useState, useTransition } from "react";
import { stopStatementsAction, type StopResult } from "./actions";

export function StopForm({
  token,
  clientName,
}: {
  token: string;
  clientName: string;
}) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<StopResult | null>(null);

  if (result?.ok) {
    return (
      <div className="rounded-lg border border-emerald-600/25 bg-emerald-50/60 p-5">
        <p className="text-sm font-medium text-charcoal">{result.message}</p>
        <p className="mt-2 text-sm text-charcoal/70">
          You can close this page. Nothing else will arrive from us about{" "}
          {clientName.trim() || "this account"}.
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setResult(await stopStatementsAction(token));
          })
        }
        className="w-full rounded-md bg-charcoal px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
      >
        {pending ? "Stopping…" : "Yes, stop sending these"}
      </button>

      {result && !result.ok ? (
        <p className="mt-4 text-sm text-red-700">{result.message}</p>
      ) : null}
    </div>
  );
}
