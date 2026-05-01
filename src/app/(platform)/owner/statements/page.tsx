// /owner/statements — pick a month, download the PDF.
//
// We deliberately don't render a card for every calendar month. A
// landlord who joined three months ago doesn't need to scroll past
// "no activity" cards for months that predate them, and even an
// established landlord usually only cares about months where
// something actually happened.
//
// So we list only the months that contain at least one transaction
// against any of their properties, surface them as a dropdown, and
// open the PDF in a new tab on submit. The selected month also gets
// a one-line summary (txn count + net per currency) so the landlord
// can sanity-check before downloading.

import Link from "next/link";
import { requireOwner } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  formatPeriod,
  isValidPeriod,
  type Period,
} from "@/lib/statements/period";

export const dynamic = "force-dynamic";

type CurrencyTotals = { inflow: number; outflow: number };

type Bucket = {
  count: number;
  totals: Map<string, CurrencyTotals>;
};

export default async function OwnerStatementsPage({
  searchParams,
}: {
  searchParams?: { period?: string };
}) {
  const { owner } = await requireOwner();

  // One query, then bucket in memory. We pull only fields we need
  // and cap at 24 months to keep the dropdown short for long-tenured
  // landlords. If someone needs older statements they can ask ops.
  const HORIZON = monthsAgo(new Date(), 24);
  const transactions = await prisma.transaction.findMany({
    where: {
      property: { ownerId: owner.id },
      occurredOn: { gte: HORIZON },
    },
    select: {
      occurredOn: true,
      direction: true,
      amount: true,
      currency: true,
    },
  });

  const byMonth = new Map<string, Bucket>();
  for (const t of transactions) {
    const key = monthKey(t.occurredOn);
    const b = byMonth.get(key) ?? { count: 0, totals: new Map() };
    b.count += 1;
    const c = b.totals.get(t.currency) ?? { inflow: 0, outflow: 0 };
    const amt = Number(t.amount);
    if (t.direction === "INFLOW") c.inflow += amt;
    else c.outflow += amt;
    b.totals.set(t.currency, c);
    byMonth.set(key, b);
  }

  const periods: Period[] = Array.from(byMonth.keys())
    .map(parseMonthKey)
    .filter((p): p is Period => p !== null)
    .sort((a, b) => b.year - a.year || b.month - a.month);

  if (periods.length === 0) {
    return (
      <div className="space-y-6">
        <Header />
        <EmptyState />
      </div>
    );
  }

  // Default to the most recent month with activity. If the URL asks
  // for a specific period, honour it only if it actually has
  // activity — otherwise silently fall back, so a stale link can't
  // 404 the page or surface a misleading "0 transactions" summary.
  const requested = parsePeriodParam(searchParams?.period);
  const selected =
    requested && byMonth.has(monthKeyFromPeriod(requested))
      ? requested
      : periods[0]!;

  const selectedBucket = byMonth.get(monthKeyFromPeriod(selected))!;
  const downloadHref = `/owner/statements/${selected.year}/${selected.month}`;

  return (
    <div className="space-y-6">
      <Header />

      <section className="rounded-lg border border-stone-200 bg-white p-5">
        {/* GET form so the URL stays the source of truth — the
            landlord can bookmark a specific month or share the
            link with us in support. */}
        <form
          method="get"
          className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4"
        >
          <label className="flex-1 text-sm">
            <span className="block font-medium text-stone-700">
              Statement month
            </span>
            <select
              name="period"
              defaultValue={periodParam(selected)}
              className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
            >
              {periods.map((p) => {
                const b = byMonth.get(monthKeyFromPeriod(p))!;
                return (
                  <option key={periodParam(p)} value={periodParam(p)}>
                    {formatPeriod(p)} —{" "}
                    {b.count === 1
                      ? "1 transaction"
                      : `${b.count} transactions`}
                  </option>
                );
              })}
            </select>
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            Show
          </button>
          <Link
            href={downloadHref}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center justify-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
          >
            Download PDF
          </Link>
        </form>

        <SelectedSummary period={selected} bucket={selectedBucket} />
      </section>
    </div>
  );
}

function Header() {
  return (
    <div>
      <h2 className="text-xl font-serif text-stone-900">Monthly statements</h2>
      <p className="mt-2 text-sm text-stone-500">
        A signed PDF summary of every property in your portfolio for the
        chosen month. Statements include rent collected, expenses paid,
        management fees, and any payouts already remitted to you. Only
        months with recorded activity appear in the dropdown.
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center">
      <h3 className="text-base font-medium text-stone-900">
        No statements yet
      </h3>
      <p className="mt-1 text-sm text-stone-500">
        Statements appear here as soon as we record activity (rent,
        expenses, or a payout) on any of your properties. We send a
        copy by email on the 1st of each month too.
      </p>
    </div>
  );
}

function SelectedSummary({
  period,
  bucket,
}: {
  period: Period;
  bucket: Bucket;
}) {
  const nets = Array.from(bucket.totals.entries()).map(([currency, t]) => ({
    currency,
    net: t.inflow - t.outflow,
  }));
  return (
    <div className="mt-5 border-t border-stone-100 pt-4">
      <p className="text-sm font-medium text-stone-900">
        {formatPeriod(period)}
      </p>
      <p className="mt-1 text-xs text-stone-500">
        {bucket.count === 1 ? "1 transaction" : `${bucket.count} transactions`}{" "}
        recorded
      </p>
      {nets.length > 0 ? (
        <ul className="mt-3 space-y-1">
          {nets.map((n) => (
            <li
              key={n.currency}
              className="flex items-center justify-between text-sm tabular-nums"
            >
              <span className="text-stone-600">{n.currency} net</span>
              <span
                className={n.net >= 0 ? "text-stone-900" : "text-red-700"}
              >
                {fmt(n.net)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function fmt(n: number): string {
  return n.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function monthKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthKeyFromPeriod(p: Period): string {
  return `${p.year}-${String(p.month).padStart(2, "0")}`;
}

function parseMonthKey(key: string): Period | null {
  const [y, m] = key.split("-");
  const period = { year: Number(y), month: Number(m) };
  return isValidPeriod(period) ? period : null;
}

function periodParam(p: Period): string {
  return `${p.year}-${String(p.month).padStart(2, "0")}`;
}

function parsePeriodParam(raw: string | undefined): Period | null {
  if (!raw) return null;
  const m = /^(\d{4})-(\d{1,2})$/.exec(raw);
  if (!m) return null;
  const period = { year: Number(m[1]), month: Number(m[2]) };
  return isValidPeriod(period) ? period : null;
}

// 24-month horizon, anchored to the first of the month so the
// transaction filter is a clean range.
function monthsAgo(now: Date, count: number): Date {
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - count, 1),
  );
}
