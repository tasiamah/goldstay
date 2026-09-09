"use client";

// Marking a referral signed, which is the one action in this area
// that commits Goldstay to a year of payments.
//
// Two things shape this form.
//
// First, it previews. The rent and the fee are entered here but the
// figure that matters is what the referrer will actually receive each
// month, so that is computed and shown before anything is written.
// Nobody should have to do the multiplication in their head to find
// out what they just agreed to.
//
// Second, it will not silently cross currencies. Payouts are in USD
// while leases are recorded in KES, and there is no conversion in the
// codebase. A shilling rent typed into the dollar field would pay an
// agent roughly a hundred and thirty times what they earned, monthly,
// for a year, and their dashboard would show them the inflated number
// as fact. So a non-USD lease is shown as context an operator must
// read and convert, never as a prefill.

import { useState, useTransition } from "react";
import type { ReferralTermsSuggestion } from "@/lib/referrals/db";
import { localMoney, pct, usd } from "@/lib/referrals/format";
import { markReferralSignedAction } from "../actions";

export function SignForm({
  referralId,
  suggestion,
  onDone,
}: {
  referralId: string;
  suggestion: ReferralTermsSuggestion | null;
  onDone: () => void;
}) {
  // Fee is safe to prefill: a rate is a ratio and carries no currency.
  const [feePct, setFeePct] = useState(
    suggestion ? String(Math.round(suggestion.managementFeePct * 1000) / 10) : "",
  );
  // Rent is prefilled only when the lease is already in USD.
  const [rent, setRent] = useState(
    suggestion?.monthlyRentUsd !== null && suggestion?.monthlyRentUsd !== undefined
      ? String(suggestion.monthlyRentUsd)
      : "",
  );
  const [strategy, setStrategy] = useState<"long-term" | "short-stay">(
    suggestion?.strategy ?? "long-term",
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const rentNum = Number(rent);
  const feeNum = Number(feePct) / 100;
  const valid =
    Number.isFinite(rentNum) &&
    rentNum > 0 &&
    Number.isFinite(feeNum) &&
    feeNum > 0 &&
    feeNum <= 1;

  const monthlyFee = valid ? rentNum * feeNum : 0;

  const needsConversion =
    suggestion?.leaseRent &&
    suggestion.leaseRent.currency.toUpperCase() !== "USD";

  function submit() {
    setError(null);
    start(async () => {
      const result = await markReferralSignedAction(referralId, {
        monthlyRentUsd: rentNum,
        managementFeePct: feeNum,
        strategy,
      });
      if (result.ok) onDone();
      else setError(result.error);
    });
  }

  return (
    <div className="mt-4 space-y-4 rounded-md border border-stone-300 bg-stone-50 p-4">
      <div>
        <h4 className="text-sm font-medium text-stone-900">
          Mark signed and generate commission
        </h4>
        <p className="mt-1 text-xs text-stone-600">
          These figures are frozen as the terms the referrer was promised.
          Changing our fee later will not alter what has already been
          scheduled.
        </p>
      </div>

      {needsConversion && suggestion?.leaseRent ? (
        <p className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          The active lease on {suggestion.propertyName} is{" "}
          <strong>
            {localMoney(
              suggestion.leaseRent.amount,
              suggestion.leaseRent.currency,
            )}
          </strong>{" "}
          a month. Commission is paid in US dollars, so enter the dollar
          equivalent below — do not copy the shilling figure across.
        </p>
      ) : null}

      {suggestion && !needsConversion && suggestion.monthlyRentUsd !== null ? (
        <p className="text-xs text-stone-600">
          Prefilled from the signed agreement on {suggestion.propertyName}.
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block text-xs text-stone-700">
          Monthly rent (USD)
          <input
            value={rent}
            onChange={(e) => setRent(e.target.value)}
            inputMode="decimal"
            placeholder="1500"
            className="mt-1 w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm text-stone-900"
          />
        </label>
        <label className="block text-xs text-stone-700">
          Our management fee
          <div className="mt-1 flex items-center gap-1">
            <input
              value={feePct}
              onChange={(e) => setFeePct(e.target.value)}
              inputMode="decimal"
              placeholder="10"
              className="w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm text-stone-900"
            />
            <span className="text-sm text-stone-500">%</span>
          </div>
        </label>
        <label className="block text-xs text-stone-700">
          Strategy
          <select
            value={strategy}
            onChange={(e) =>
              setStrategy(e.target.value as "long-term" | "short-stay")
            }
            className="mt-1 w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm text-stone-900"
          >
            <option value="long-term">Long-term let</option>
            <option value="short-stay">Short stay</option>
          </select>
        </label>
      </div>

      {/* The whole reason this is a form and not a button. */}
      {valid ? (
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-700">
          Our fee on this unit is <strong>{usd(monthlyFee)}</strong> a month
          (that is {pct(feeNum)} of {usd(rentNum)}). The referrer&apos;s share
          of it is set by their terms, shown in the Commission panel, and the
          exact schedule appears here once you confirm.
        </div>
      ) : (
        <p className="text-xs text-stone-500">
          Enter a rent and a fee to see what this generates.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={pending || !valid}
          className="rounded-md bg-stone-900 px-4 py-2 text-xs font-medium text-white hover:bg-stone-800 disabled:opacity-50"
        >
          {pending ? "Generating…" : "Confirm signed"}
        </button>
        <button
          type="button"
          onClick={onDone}
          disabled={pending}
          className="text-xs text-stone-500 underline hover:text-stone-900"
        >
          Cancel
        </button>
        {error ? <span className="text-xs text-red-700">{error}</span> : null}
      </div>
    </div>
  );
}
