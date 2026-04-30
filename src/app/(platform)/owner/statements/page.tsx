// /owner/statements — landing page that lists the last 12 months as
// downloadable PDFs. We render a quick per-month summary (transaction
// count + net per currency) inline so a landlord can see at a glance
// which months had real activity and which were quiet, without having
// to download the PDF first.

import Link from "next/link";
import { requireOwner } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  formatPeriod,
  periodRange,
  periodsSince,
  type Period,
} from "@/lib/statements/period";

export const dynamic = "force-dynamic";

export default async function OwnerStatementsPage() {
  const { owner } = await requireOwner();

  // Floor the dropdown to the earlier of (joined date, first txn) so
  // brand new landlords don't see a wall of "no activity" cards for
  // months that predate them. Capped at 24 months for sanity.
  const earliestTx = await prisma.transaction.findFirst({
    where: { property: { ownerId: owner.id } },
    orderBy: { occurredOn: "asc" },
    select: { occurredOn: true },
  });
  const earliest =
    earliestTx && earliestTx.occurredOn < owner.createdAt
      ? earliestTx.occurredOn
      : owner.createdAt;
  const periods = periodsSince(earliest, new Date());

  // Pull the full window in one query and bucket client-side so we
  // don't fan out to one Prisma call per month.
  const oldest = periodRange(periods[periods.length - 1]).start;
  const newest = periodRange(periods[0]).end;

  const transactions = await prisma.transaction.findMany({
    where: {
      property: { ownerId: owner.id },
      occurredOn: { gte: oldest, lt: newest },
    },
    select: {
      occurredOn: true,
      direction: true,
      amount: true,
      currency: true,
    },
  });

  type Bucket = {
    count: number;
    totals: Map<string, { inflow: number; outflow: number }>;
  };
  const byMonth = new Map<string, Bucket>();
  for (const t of transactions) {
    const key = monthKey(t.occurredOn);
    const b = byMonth.get(key) ?? {
      count: 0,
      totals: new Map(),
    };
    b.count += 1;
    const c = b.totals.get(t.currency) ?? { inflow: 0, outflow: 0 };
    const amt = Number(t.amount);
    if (t.direction === "INFLOW") c.inflow += amt;
    else c.outflow += amt;
    b.totals.set(t.currency, c);
    byMonth.set(key, b);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-serif text-stone-900">
          Monthly statements
        </h2>
        <p className="mt-2 text-sm text-stone-500">
          A signed PDF summary of every property in your portfolio for the
          chosen month. Statements include rent collected, expenses paid,
          management fees, and any payouts already remitted to you.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {periods.map((p) => {
          const bucket = byMonth.get(periodKey(p));
          return <StatementCard key={periodKey(p)} period={p} bucket={bucket} />;
        })}
      </div>
    </div>
  );
}

function StatementCard({
  period,
  bucket,
}: {
  period: Period;
  bucket?: { count: number; totals: Map<string, { inflow: number; outflow: number }> };
}) {
  const href = `/owner/statements/${period.year}/${period.month}`;
  const count = bucket?.count ?? 0;
  const nets = bucket
    ? Array.from(bucket.totals.entries()).map(([currency, t]) => ({
        currency,
        net: t.inflow - t.outflow,
      }))
    : [];

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener"
      className="group rounded-lg border border-stone-200 bg-white p-5 transition hover:border-stone-400 hover:shadow-sm"
    >
      <div className="flex items-start justify-between">
        <p className="text-base font-medium text-stone-900">
          {formatPeriod(period)}
        </p>
        <span className="text-xs uppercase tracking-wider text-stone-400 group-hover:text-stone-700">
          PDF
        </span>
      </div>
      <p className="mt-1 text-xs text-stone-500">
        {count === 0
          ? "No activity recorded"
          : `${count} ${count === 1 ? "transaction" : "transactions"}`}
      </p>
      {nets.length > 0 ? (
        <ul className="mt-3 space-y-0.5">
          {nets.map((n) => (
            <li
              key={n.currency}
              className="flex items-center justify-between text-xs tabular-nums"
            >
              <span className="text-stone-500">{n.currency} net</span>
              <span
                className={
                  n.net >= 0 ? "text-stone-900" : "text-red-700"
                }
              >
                {fmt(n.net)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </Link>
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

function periodKey(p: Period): string {
  return `${p.year}-${String(p.month).padStart(2, "0")}`;
}
