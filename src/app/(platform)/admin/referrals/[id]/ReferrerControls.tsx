"use client";

// Standing and commission terms for one referrer.
//
// Pausing and terminating are kept visually apart because they differ
// in consequence, not degree: pausing stops their link attributing
// and leaves scheduled commission alone, while terminating cancels
// every unpaid commission they have. The second is stated on the
// button's confirmation rather than left to be discovered.

import { useState, useTransition } from "react";
import type { ReferrerStatus } from "@prisma/client";
import { pct } from "@/lib/referrals/format";
import {
  setReferrerStatusAction,
  setReferrerTermsAction,
} from "../actions";

export function ReferrerControls({
  referrerId,
  status,
  terms,
  defaults,
  hasOverrides,
}: {
  referrerId: string;
  status: ReferrerStatus;
  terms: { longTermPct: number; shortStayPct: number; payoutMonths: number };
  defaults: { longTermPct: number; shortStayPct: number; payoutMonths: number };
  hasOverrides: {
    longTerm: boolean;
    shortStay: boolean;
    payoutMonths: boolean;
  };
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState(false);

  const [longTerm, setLongTerm] = useState(String(terms.longTermPct * 100));
  const [shortStay, setShortStay] = useState(String(terms.shortStayPct * 100));
  const [months, setMonths] = useState(String(terms.payoutMonths));

  function changeStatus(next: ReferrerStatus, confirmText?: string) {
    if (confirmText && !window.confirm(confirmText)) return;
    setMessage(null);
    setError(null);
    start(async () => {
      const result = await setReferrerStatusAction(referrerId, next);
      if (result.ok) setMessage(result.message);
      else setError(result.error);
    });
  }

  function saveTerms(reset: boolean) {
    setMessage(null);
    setError(null);
    start(async () => {
      const result = await setReferrerTermsAction(
        referrerId,
        reset
          ? { longTermPct: null, shortStayPct: null, payoutMonths: null }
          : {
              longTermPct: Number(longTerm) / 100,
              shortStayPct: Number(shortStay) / 100,
              payoutMonths: Number(months),
            },
      );
      if (result.ok) {
        setMessage(result.message);
        setEditing(false);
        if (reset) {
          setLongTerm(String(defaults.longTermPct * 100));
          setShortStay(String(defaults.shortStayPct * 100));
          setMonths(String(defaults.payoutMonths));
        }
      } else {
        setError(result.error);
      }
    });
  }

  const anyOverride =
    hasOverrides.longTerm || hasOverrides.shortStay || hasOverrides.payoutMonths;

  return (
    <section className="space-y-4 rounded-lg border border-stone-200 bg-white p-4">
      <h2 className="font-medium text-stone-900">Manage</h2>

      <div className="space-y-2">
        {status !== "ACTIVE" ? (
          <button
            type="button"
            onClick={() => changeStatus("ACTIVE")}
            disabled={pending}
            className="w-full rounded-md bg-stone-900 px-3 py-2 text-xs font-medium text-white hover:bg-stone-800 disabled:opacity-50"
          >
            Reactivate
          </button>
        ) : null}

        {status === "ACTIVE" ? (
          <button
            type="button"
            onClick={() =>
              changeStatus(
                "PAUSED",
                "Pause this referrer? Their link stops attributing new landlords. Commission already scheduled is unaffected.",
              )
            }
            disabled={pending}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 disabled:opacity-50"
          >
            Pause
          </button>
        ) : null}

        {status !== "TERMINATED" ? (
          <button
            type="button"
            onClick={() =>
              changeStatus(
                "TERMINATED",
                "Terminate this referrer?\n\nEvery commission not yet paid will be cancelled. Anything already paid stands. Their link stops working.\n\nIf you only want to stop new introductions, pause them instead.",
              )
            }
            disabled={pending}
            className="w-full rounded-md border border-red-200 px-3 py-2 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            Terminate
          </button>
        ) : null}
      </div>

      <div className="border-t border-stone-100 pt-3">
        {editing ? (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <label className="text-xs text-stone-700">
                Long-term
                <input
                  value={longTerm}
                  onChange={(e) => setLongTerm(e.target.value)}
                  inputMode="decimal"
                  className="mt-1 w-full rounded-md border border-stone-300 px-2 py-1 text-sm"
                />
              </label>
              <label className="text-xs text-stone-700">
                Short-stay
                <input
                  value={shortStay}
                  onChange={(e) => setShortStay(e.target.value)}
                  inputMode="decimal"
                  className="mt-1 w-full rounded-md border border-stone-300 px-2 py-1 text-sm"
                />
              </label>
              <label className="text-xs text-stone-700">
                Months
                <input
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                  inputMode="numeric"
                  className="mt-1 w-full rounded-md border border-stone-300 px-2 py-1 text-sm"
                />
              </label>
            </div>
            <p className="text-xs text-stone-500">
              Percentages of the monthly management fee. Defaults for this
              referrer type are {pct(defaults.longTermPct)} /{" "}
              {pct(defaults.shortStayPct)} for {defaults.payoutMonths} month
              {defaults.payoutMonths === 1 ? "" : "s"}.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => saveTerms(false)}
                disabled={pending}
                className="rounded-md bg-stone-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800 disabled:opacity-50"
              >
                {pending ? "Saving…" : "Save terms"}
              </button>
              {anyOverride ? (
                <button
                  type="button"
                  onClick={() => saveTerms(true)}
                  disabled={pending}
                  className="text-xs text-stone-500 underline hover:text-stone-900"
                >
                  Reset to default
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setEditing(false)}
                disabled={pending}
                className="text-xs text-stone-500 underline hover:text-stone-900"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-xs text-stone-600 underline hover:text-stone-900"
          >
            {anyOverride ? "Edit custom terms" : "Set custom terms"}
          </button>
        )}
      </div>

      {message ? (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      ) : null}
    </section>
  );
}
