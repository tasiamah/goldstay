"use client";

// Pay / cancel controls for one scheduled commission.
//
// The reference field is the point of this component. A commission
// paid by M-PESA leaves a transaction code, and without somewhere to
// put it "paid" is an unevidenced assertion — which is no use at all
// when an agent says they never received it. So marking paid opens an
// inline field rather than settling on the first click, and that
// click is also what stops a stray tap on a phone from declaring
// money sent.

import { useState, useTransition } from "react";
import { cancelPayoutAction, markPayoutPaidAction } from "./actions";

export function PayoutRow({
  payoutId,
  amountUsd,
}: {
  payoutId: string;
  amountUsd: number;
}) {
  const [open, setOpen] = useState(false);
  const [reference, setReference] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function pay() {
    setError(null);
    start(async () => {
      const result = await markPayoutPaidAction(payoutId, reference);
      if (result.ok) setOpen(false);
      else setError(result.error);
    });
  }

  function cancel() {
    setError(null);
    start(async () => {
      const result = await cancelPayoutAction(payoutId);
      if (!result.ok) setError(result.error);
    });
  }

  if (!open) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={pending}
          className="rounded-md bg-stone-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800 disabled:opacity-50"
        >
          Mark paid
        </button>
        <button
          type="button"
          onClick={cancel}
          disabled={pending}
          className="rounded-md border border-stone-300 px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-50 disabled:opacity-50"
        >
          {pending ? "Working…" : "Cancel"}
        </button>
        {error ? (
          <span className="text-xs text-red-700">{error}</span>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs text-stone-600">
        M-PESA or transfer reference
        <input
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="e.g. QGR7HK2XYZ"
          autoFocus
          className="mt-1 w-44 rounded-md border border-stone-300 px-2 py-1 text-sm text-stone-900"
        />
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={pay}
          disabled={pending}
          className="rounded-md bg-stone-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800 disabled:opacity-50"
        >
          {pending ? "Saving…" : `Confirm ${fmt(amountUsd)} paid`}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          disabled={pending}
          className="text-xs text-stone-500 underline hover:text-stone-900"
        >
          Back
        </button>
      </div>
      {/* Recorded, not required. Chasing a reference nobody kept would
          just push operators into typing "n/a", which is worse than an
          honest blank. */}
      <p className="text-xs text-stone-500">
        Leave blank if you do not have one.
      </p>
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}

function fmt(amount: number): string {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
