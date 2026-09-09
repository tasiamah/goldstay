// /admin/referrals/due — every commission that is payable now.
//
// Separate from the referrer list because paying people is a different
// job from managing them: you sit down once a month, work down a
// single list and record a reference against each one. Hunting through
// individual profiles for which of a year's scheduled rows have come
// due is how an agent ends up unpaid and telling other agents so.
//
// Oldest first, because the oldest unpaid commission is the one
// costing the most goodwill.

import Link from "next/link";
import { requireRole, adminCan } from "@/lib/auth";
import { listPayoutsDue } from "@/lib/referrals/db";
import { shortDate, usd } from "@/lib/referrals/format";
import { PayoutRow } from "../PayoutRow";

export const dynamic = "force-dynamic";

export const metadata = { title: "Referral payouts due" };

export default async function PayoutsDuePage() {
  await requireRole("referral.read");
  const canPay = await adminCan("referral.payout");

  const due = await listPayoutsDue();
  const total = due.reduce((sum, p) => sum + Number(p.amountUsd.toString()), 0);

  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/admin/referrals"
          className="text-sm text-stone-500 underline hover:text-stone-900"
        >
          ← Referrals
        </Link>
        <h1 className="mt-2 font-serif text-2xl text-stone-900">Payouts due</h1>
        <p className="mt-1 text-sm text-stone-600">
          {due.length === 0
            ? "Nothing is outstanding."
            : `${due.length} commission${due.length === 1 ? "" : "s"} payable now, ${usd(total)} in total.`}
        </p>
      </header>

      {!canPay && due.length > 0 ? (
        <p className="rounded-md border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
          You can see what is owed but not record a payment. Marking a
          commission paid is an accounting permission.
        </p>
      ) : null}

      {due.length === 0 ? (
        <div className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-600">
          Commissions appear here in the month they fall due, once a referral
          has been marked signed.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-stone-200 bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Referrer</th>
                  <th className="px-4 py-3 font-medium">For</th>
                  <th className="px-4 py-3 font-medium">Month</th>
                  <th className="px-4 py-3 font-medium">Due</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {due.map((p) => (
                  <tr key={p.id} className="align-top hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/referrals/${p.referral.referrer.id}`}
                        className="font-medium text-stone-900 underline decoration-stone-300 hover:decoration-stone-900"
                      >
                        {p.referral.referrer.fullName}
                      </Link>
                      <div className="text-xs text-stone-500">
                        {p.referral.referrer.email}
                      </div>
                      {/* A paused or terminated referrer should not be
                          paid without a moment's thought, and this is
                          the screen where that thought has to happen. */}
                      {p.referral.referrer.status !== "ACTIVE" ? (
                        <div className="mt-1 text-xs font-medium text-amber-700">
                          Referrer is{" "}
                          {p.referral.referrer.status.toLowerCase()}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-stone-700">
                      {p.referral.landlordName}
                    </td>
                    <td className="px-4 py-3 text-stone-700">
                      {p.monthIndex}
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {shortDate(p.scheduledFor)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-stone-900">
                      {usd(Number(p.amountUsd.toString()))}
                    </td>
                    <td className="px-4 py-3">
                      {canPay ? (
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
        </div>
      )}
    </div>
  );
}
