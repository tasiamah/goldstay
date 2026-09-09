"use client";

// One introduced landlord: who they are, where they are in the
// pipeline, and the commission that follows from signing them.
//
// Signing is deliberately not one of the status buttons. It needs the
// rent and the fee to build a schedule from, and it is the only
// action here that commits Goldstay to a year of payments, so it opens
// a form and states what will be generated before anything is.

import { useState, useTransition } from "react";
import type { PayoutStatus, ReferralStatus } from "@prisma/client";
import {
  allowedReferralTransitions,
  REFERRAL_STATUS_LABEL,
} from "@/lib/referrals/lifecycle";
import type { ReferralTermsSuggestion } from "@/lib/referrals/db";
import { localMoney, pct, shortDate, usd } from "@/lib/referrals/format";
import { ReferralStatusPill, PayoutStatusPill } from "../pills";
import { setReferralStatusAction } from "../actions";
import { PayoutRow } from "../PayoutRow";
import { SignForm } from "./SignForm";

type Payout = {
  id: string;
  monthIndex: number;
  amountUsd: { toString(): string };
  status: PayoutStatus;
  scheduledFor: Date;
  paidAt: Date | null;
  paidReference: string | null;
};

export function ReferralCard({
  referral,
  schedule,
  suggestion,
  canWrite,
  canPay,
}: {
  referral: {
    id: string;
    landlordName: string;
    landlordEmail: string | null;
    landlordPhone: string | null;
    city: string | null;
    status: ReferralStatus;
    createdAt: Date;
    contactedAt: Date | null;
    signedAt: Date | null;
    notes: string | null;
    client: { id: string; fullName: string; email: string } | null;
    payouts: Payout[];
  };
  schedule: { monthIndex: number; amountUsd: number }[];
  suggestion: ReferralTermsSuggestion | null;
  canWrite: boolean;
  canPay: boolean;
}) {
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  // SIGNED is filtered out because it has its own form below.
  const transitions = allowedReferralTransitions(referral.status).filter(
    (s) => s !== "SIGNED",
  );
  const canSign = allowedReferralTransitions(referral.status).includes("SIGNED");

  function move(status: Exclude<ReferralStatus, "SIGNED">) {
    setError(null);
    start(async () => {
      const result = await setReferralStatusAction(referral.id, status);
      if (!result.ok) setError(result.error);
    });
  }

  const scheduledTotal = referral.payouts
    .filter((p) => p.status === "SCHEDULED")
    .reduce((s, p) => s + Number(p.amountUsd.toString()), 0);
  const paidTotal = referral.payouts
    .filter((p) => p.status === "PAID")
    .reduce((s, p) => s + Number(p.amountUsd.toString()), 0);

  return (
    <article className="rounded-lg border border-stone-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium text-stone-900">
              {referral.landlordName}
            </h3>
            <ReferralStatusPill status={referral.status} />
          </div>
          <p className="mt-1 text-xs text-stone-500">
            {[
              referral.landlordEmail,
              referral.landlordPhone,
              referral.city,
            ]
              .filter(Boolean)
              .join(" · ") || "No contact details captured"}
          </p>
          <p className="mt-1 text-xs text-stone-400">
            Introduced {shortDate(referral.createdAt)}
            {referral.contactedAt
              ? ` · contacted ${shortDate(referral.contactedAt)}`
              : ""}
            {referral.signedAt ? ` · signed ${shortDate(referral.signedAt)}` : ""}
          </p>
          {referral.client ? (
            <p className="mt-1 text-xs text-stone-600">
              Client:{" "}
              <a
                href={`/admin/clients/${referral.client.id}`}
                className="underline"
              >
                {referral.client.fullName}
              </a>
            </p>
          ) : null}
        </div>

        {referral.payouts.length > 0 ? (
          <div className="text-right text-xs">
            <div className="text-stone-500">Commission</div>
            <div className="text-stone-900">{usd(paidTotal)} paid</div>
            {scheduledTotal > 0 ? (
              <div className="text-amber-700">
                {usd(scheduledTotal)} scheduled
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {referral.notes ? (
        <p className="mt-3 rounded-md bg-stone-50 p-2 text-xs text-stone-600">
          {referral.notes}
        </p>
      ) : null}

      {/* Projection for a referral that has not signed yet, so the
          person deciding whether to chase it can see what it is
          worth. Only shown when we have terms to project from. */}
      {referral.status !== "SIGNED" && schedule.length === 0 && suggestion ? (
        <p className="mt-3 text-xs text-stone-500">
          {suggestion.propertyName} is already signed with us at{" "}
          {pct(suggestion.managementFeePct)}
          {suggestion.leaseRent
            ? ` on ${localMoney(suggestion.leaseRent.amount, suggestion.leaseRent.currency)} a month`
            : ""}
          . Mark this referral signed to generate the commission.
        </p>
      ) : null}

      {canWrite && (transitions.length > 0 || canSign) ? (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-stone-100 pt-3">
          {transitions.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => move(status)}
              disabled={pending}
              className="rounded-md border border-stone-300 px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-50 disabled:opacity-50"
            >
              Mark {REFERRAL_STATUS_LABEL[status].toLowerCase()}
            </button>
          ))}
          {canSign ? (
            <button
              type="button"
              onClick={() => setSigning((v) => !v)}
              className="rounded-md bg-stone-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800"
            >
              {signing ? "Close" : "Mark signed…"}
            </button>
          ) : null}
          {error ? <span className="text-xs text-red-700">{error}</span> : null}
        </div>
      ) : null}

      {signing && canSign ? (
        <SignForm
          referralId={referral.id}
          suggestion={suggestion}
          onDone={() => setSigning(false)}
        />
      ) : null}

      {referral.payouts.length > 0 ? (
        <div className="mt-4 border-t border-stone-100 pt-3">
          <h4 className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Commission schedule
          </h4>
          <table className="mt-2 w-full text-xs">
            <tbody className="divide-y divide-stone-100">
              {referral.payouts.map((p) => (
                <tr key={p.id}>
                  <td className="py-2 text-stone-500">Month {p.monthIndex}</td>
                  <td className="py-2 text-stone-600">
                    {shortDate(p.scheduledFor)}
                  </td>
                  <td className="py-2 text-stone-900">
                    {usd(Number(p.amountUsd.toString()))}
                  </td>
                  <td className="py-2">
                    <PayoutStatusPill status={p.status} />
                  </td>
                  <td className="py-2 text-stone-500">
                    {p.paidReference ? (
                      <span className="font-mono">{p.paidReference}</span>
                    ) : p.paidAt ? (
                      "no reference"
                    ) : (
                      ""
                    )}
                  </td>
                  <td className="py-2 text-right">
                    {canPay && p.status === "SCHEDULED" ? (
                      <PayoutRow
                        payoutId={p.id}
                        amountUsd={Number(p.amountUsd.toString())}
                      />
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </article>
  );
}
