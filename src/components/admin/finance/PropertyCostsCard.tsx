// Per-property running costs — the small out-of-pocket things we
// spend on one unit month by month: a cleaning, a replacement kettle,
// a plumber.
//
// Deliberately not the same card as PropertyFinanceCard. That one
// asks what Goldstay kept and excludes EXPENSE as pass-through; this
// one asks what the unit cost, which is the figure that has to end up
// on the owner's statement. Showing them together makes the
// distinction visible instead of leaving someone to guess which
// number they are looking at.
//
// Months with nothing in them are rendered as zero rather than
// skipped. A gap in a list of months reads as "no costs", and we
// cannot tell that apart from "nobody has entered them yet" — so the
// card says which it is instead of implying the first.

import Link from "next/link";

import { prisma } from "@/lib/db";
import { EXCLUDE_SETTLEMENTS } from "@/lib/transactions/settlement";
import {
  monthParam,
  summariseByCurrency,
} from "@/lib/admin/transaction-filters";
import {
  formatPeriod,
  periodRange,
  recentPeriods,
  type Period,
} from "@/lib/statements/period";

const MONTHS_SHOWN = 6;

export async function PropertyCostsCard({
  propertyId,
}: {
  propertyId: string;
}) {
  const periods = recentPeriods(new Date(), MONTHS_SHOWN);
  const windowStart = periodRange(periods[periods.length - 1]).start;

  const rows = await prisma.transaction.findMany({
    where: {
      propertyId,
      archivedAt: null,
      direction: "OUTFLOW",
      occurredOn: { gte: windowStart },
      // Paying the owner is the largest outflow a unit will ever
      // have and it is not a cost of running the unit.
      ...EXCLUDE_SETTLEMENTS,
    },
    select: {
      occurredOn: true,
      direction: true,
      amount: true,
      currency: true,
    },
    orderBy: { occurredOn: "desc" },
  });

  const byMonth = periods.map((period) => {
    const { start, end } = periodRange(period);
    const inMonth = rows.filter(
      (r) => r.occurredOn >= start && r.occurredOn < end,
    );
    return {
      period,
      count: inMonth.length,
      totals: summariseByCurrency(
        inMonth.map((r) => ({
          direction: r.direction,
          amount: r.amount.toString(),
          currency: r.currency,
        })),
      ),
    };
  });

  const anyCosts = byMonth.some((m) => m.count > 0);

  return (
    <section className="rounded-lg border border-stone-200 bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-5 py-4">
        <div>
          <h3 className="text-base font-medium text-stone-900">
            Costs on this unit
          </h3>
          <p className="text-xs text-stone-500">
            Everything we have paid out against this property &mdash;
            cleaning, repairs, items bought for the house. These are the
            lines that appear on the owner&rsquo;s monthly statement.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/transactions?propertyId=${propertyId}`}
            className="rounded-md border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50"
          >
            All costs
          </Link>
          <Link
            href={`/admin/transactions/new?propertyId=${propertyId}&type=EXPENSE`}
            className="rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
          >
            Record cost
          </Link>
        </div>
      </header>

      {!anyCosts ? (
        <p className="px-5 py-8 text-center text-sm text-stone-500">
          Nothing recorded against this property in the last{" "}
          {MONTHS_SHOWN} months.
        </p>
      ) : (
        <table className="min-w-full divide-y divide-stone-200">
          <thead className="bg-stone-50 text-left text-xs uppercase tracking-wider text-stone-500">
            <tr>
              <th className="px-5 py-2.5">Month</th>
              <th className="px-5 py-2.5 text-right">Items</th>
              <th className="px-5 py-2.5 text-right">Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {byMonth.map((m) => (
              <tr key={monthParam(m.period)}>
                <td className="px-5 py-2.5 text-sm">
                  <Link
                    href={costsHref(propertyId, m.period)}
                    className="text-stone-700 hover:text-stone-900 hover:underline"
                  >
                    {formatPeriod(m.period)}
                  </Link>
                </td>
                <td className="px-5 py-2.5 text-right text-sm tabular-nums text-stone-500">
                  {m.count}
                </td>
                <td className="px-5 py-2.5 text-right text-sm tabular-nums">
                  {m.totals.length === 0 ? (
                    <span className="text-stone-400">&mdash;</span>
                  ) : (
                    <div className="space-y-0.5">
                      {m.totals.map((t) => (
                        <div key={t.currency} className="text-rose-700">
                          {fmt(t.outflow)}{" "}
                          <span className="text-stone-400">{t.currency}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

function costsHref(propertyId: string, period: Period): string {
  return `/admin/transactions?propertyId=${propertyId}&month=${monthParam(period)}`;
}

function fmt(n: number): string {
  return n.toLocaleString("en-GB", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
