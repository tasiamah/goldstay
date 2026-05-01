// Per-property Goldstay P&L card — what we made (and what it cost
// us) on this one property each month for the last 12 months.
//
// Self-gates on adminCan("finance.read") so we can mount it
// unconditionally on the property detail page; non-SUPER_ADMINs see
// nothing rendered. The role matrix in @/lib/admin/roles makes
// finance.read SUPER_ADMIN-only.

import { adminCan } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  GOLDSTAY_COST_TYPES,
  GOLDSTAY_REVENUE_TYPES,
  summariseFinance,
  type GoldstayTxn,
} from "@/lib/admin/finance";

export async function PropertyFinanceCard({
  propertyId,
}: {
  propertyId: string;
}) {
  const allowed = await adminCan("finance.read");
  if (!allowed) return null;

  const trailing12Start = new Date();
  trailing12Start.setUTCMonth(trailing12Start.getUTCMonth() - 12);
  trailing12Start.setUTCDate(1);
  trailing12Start.setUTCHours(0, 0, 0, 0);

  const txns = await prisma.transaction.findMany({
    where: {
      propertyId,
      occurredOn: { gte: trailing12Start },
      type: { in: [...GOLDSTAY_REVENUE_TYPES, ...GOLDSTAY_COST_TYPES] },
    },
    select: {
      occurredOn: true,
      amount: true,
      currency: true,
      type: true,
      direction: true,
      propertyId: true,
    },
  });

  const normalised: GoldstayTxn[] = txns.map((t) => ({
    occurredOn: t.occurredOn,
    amount: Number(t.amount),
    currency: t.currency,
    type: t.type,
    direction: t.direction,
    propertyId: t.propertyId!,
  }));
  const summary = summariseFinance(normalised);

  return (
    <section className="rounded-lg border border-stone-200 bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-5 py-4">
        <div>
          <h3 className="text-base font-medium text-stone-900">
            Goldstay P&amp;L
          </h3>
          <p className="text-xs text-stone-500">
            What this property has produced for Goldstay each month:
            commission revenue, OTA / cleaning costs we ate, and the net
            we kept. SUPER_ADMIN-only.
          </p>
        </div>
        {summary.totals.length > 0 ? (
          <ul className="flex flex-wrap gap-2 text-xs">
            {summary.totals.map((t) => (
              <li
                key={t.currency}
                className="rounded-md bg-stone-50 px-2 py-1 text-stone-700"
              >
                12-month net{" "}
                <strong className="text-stone-900">
                  {fmt(t.net)} {t.currency}
                </strong>
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      {summary.monthly.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-stone-500">
          No commission or cost transactions on this property in the last
          12 months.
        </p>
      ) : (
        <table className="min-w-full divide-y divide-stone-200">
          <thead className="bg-stone-50 text-left text-xs uppercase tracking-wider text-stone-500">
            <tr>
              <th className="px-5 py-2.5">Month</th>
              <th className="px-5 py-2.5">Currency</th>
              <th className="px-5 py-2.5 text-right">Revenue</th>
              <th className="px-5 py-2.5 text-right">Cost</th>
              <th className="px-5 py-2.5 text-right">Net</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {/* One row per (month, currency) so multi-currency
                short-stay months don't get silently averaged. */}
            {summary.monthly.flatMap((m) =>
              m.byCurrency.map((c) => (
                <tr key={`${m.month}-${c.currency}`}>
                  <td className="px-5 py-2.5 font-mono text-xs text-stone-700">
                    {m.month}
                  </td>
                  <td className="px-5 py-2.5 font-mono text-xs text-stone-700">
                    {c.currency}
                  </td>
                  <td className="px-5 py-2.5 text-right text-sm tabular-nums text-emerald-700">
                    {fmt(c.revenue)}
                  </td>
                  <td className="px-5 py-2.5 text-right text-sm tabular-nums text-rose-700">
                    {fmt(c.cost)}
                  </td>
                  <td className="px-5 py-2.5 text-right text-sm font-medium tabular-nums text-stone-900">
                    {fmt(c.net)}
                  </td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      )}
    </section>
  );
}

function fmt(n: number): string {
  return n.toLocaleString("en-GB", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
