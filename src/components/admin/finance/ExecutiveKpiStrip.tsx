// SUPER_ADMIN-only profit strip for the admin overview.
//
// Self-gates on adminCan("finance.read") so the rest of the team
// (OPS, ACCOUNTING, SUPPORT, COUNTRY_MANAGER) never sees the row,
// and never sees the underlying queries either — we early-return
// before touching the database.
//
// Four windows: this month, last month, year-to-date, trailing 12
// months. Each tile shows Goldstay net in the primary currency
// (KES) plus a small "+ N other currencies" hint when relevant.
// We deliberately avoid FX maths — see lib/admin/finance.ts.

import Link from "next/link";
import { adminCan } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  GOLDSTAY_COST_TYPES,
  GOLDSTAY_REVENUE_TYPES,
  executiveWindows,
  pickPrimary,
  summariseWindows,
  type FinanceSummary,
  type FinanceWindowKey,
  type GoldstayTxn,
} from "@/lib/admin/finance";

const PRIMARY = "KES";

const TILE_LABEL: Record<FinanceWindowKey, string> = {
  month: "Profit · this month",
  lastMonth: "Profit · last month",
  ytd: "Profit · YTD",
  trailing12: "Profit · trailing 12m",
};

const TILE_HINT: Record<FinanceWindowKey, string> = {
  month: "Net commission booked since the 1st",
  lastMonth: "Net for the previous calendar month",
  ytd: `Year-to-date, since Jan 1`,
  trailing12: "Rolling 12 calendar months",
};

const ORDER: FinanceWindowKey[] = [
  "month",
  "lastMonth",
  "ytd",
  "trailing12",
];

export async function ExecutiveKpiStrip() {
  const allowed = await adminCan("finance.read");
  if (!allowed) return null;

  const now = new Date();
  const windows = executiveWindows(now);
  // The widest window starts trailing-12; pull once, slice in memory
  // for the four tiles. One round-trip per overview render.
  const earliest = windows.reduce(
    (min, w) => (w.start < min ? w.start : min),
    windows[0]!.start,
  );

  const txns = await prisma.transaction.findMany({
    where: {
      occurredOn: { gte: earliest },
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

  const normalised: GoldstayTxn[] = txns
    .filter((t): t is typeof t & { propertyId: string } =>
      Boolean(t.propertyId),
    )
    .map((t) => ({
      occurredOn: t.occurredOn,
      amount: Number(t.amount),
      currency: t.currency,
      type: t.type,
      direction: t.direction,
      propertyId: t.propertyId,
    }));

  const summaries = summariseWindows(normalised, windows);

  const monthPrimary = pickPrimary(summaries.month.totals, PRIMARY).primary;
  const lastMonthPrimary = pickPrimary(
    summaries.lastMonth.totals,
    PRIMARY,
  ).primary;

  // Month-on-month delta for the headline tile, in the primary
  // currency only (mixing currencies into one delta would lie).
  const delta =
    monthPrimary && lastMonthPrimary && lastMonthPrimary.net !== 0
      ? (monthPrimary.net - lastMonthPrimary.net) / lastMonthPrimary.net
      : null;

  return (
    <section
      aria-label="Executive profit (SUPER_ADMIN only)"
      className="rounded-xl border border-amber-200 bg-amber-50/40 p-5"
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-800">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-amber-600"
            />
            Super-admin · profit
          </p>
          <p className="text-xs text-stone-600">
            Visible to SUPER_ADMIN only. Goldstay net (commission revenue
            minus OTA / cleaning we absorbed), grouped by currency.
          </p>
        </div>
        <Link
          href="/admin/finance"
          className="text-xs font-medium text-stone-700 underline-offset-2 hover:underline"
        >
          Open finance dashboard →
        </Link>
      </header>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ORDER.map((key) => (
          <Tile
            key={key}
            label={TILE_LABEL[key]}
            hint={TILE_HINT[key]}
            summary={summaries[key]}
            delta={key === "month" ? delta : null}
          />
        ))}
      </div>
    </section>
  );
}

function Tile({
  label,
  hint,
  summary,
  delta,
}: {
  label: string;
  hint: string;
  summary: FinanceSummary;
  delta: number | null;
}) {
  const { primary, otherCount } = pickPrimary(summary.totals, PRIMARY);
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wider text-stone-500">
        {label}
      </p>
      <p className="mt-2 font-serif text-2xl text-stone-900 tabular-nums">
        {primary ? (
          <>
            {fmt(primary.net)}{" "}
            <span className="font-sans text-sm font-normal text-stone-500">
              {primary.currency}
            </span>
          </>
        ) : (
          <span className="text-stone-400">—</span>
        )}
      </p>
      <p className="mt-1 text-xs text-stone-500">
        {hint}
        {otherCount > 0
          ? ` · + ${otherCount} other ${
              otherCount === 1 ? "currency" : "currencies"
            }`
          : ""}
      </p>
      {delta !== null ? <DeltaPill delta={delta} /> : null}
    </div>
  );
}

function DeltaPill({ delta }: { delta: number }) {
  const positive = delta >= 0;
  const tone = positive
    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
    : "border-rose-200 bg-rose-50 text-rose-800";
  const sign = positive ? "+" : "";
  return (
    <p
      className={`mt-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${tone}`}
    >
      {sign}
      {(delta * 100).toFixed(0)}% vs last month
    </p>
  );
}

function fmt(n: number): string {
  return n.toLocaleString("en-GB", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
