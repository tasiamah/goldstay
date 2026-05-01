// /admin/finance — SUPER_ADMIN-only Goldstay P&L dashboard.
//
// Three views off the same fetch:
//   1. Headline P&L — total revenue, total cost, net, by currency.
//      Two windows side-by-side (current month, trailing 12 months)
//      so a SUPER_ADMIN can answer "is this month tracking?" at a
//      glance.
//   2. Per-property table — what each property is producing in
//      Goldstay net per month, sortable by ?sort=net|revenue|cost
//      and ?period=month|12m. This is the table the user asked for
//      ("how much profit each property has generated per month").
//   3. Cost lines — where the money goes (OTA commissions paid,
//      cleaning absorbed, etc.) so we can see at a glance whether
//      OTA spend is eating margin.
//
// We never FX-convert — multi-currency reality is surfaced as
// separate rows and the consumer of this page is expected to read it.
// Adding a single shared "company currency" + an FX feed is a
// follow-up worth making explicit, not a default that hides the gap.

import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  GOLDSTAY_COST_TYPES,
  GOLDSTAY_REVENUE_TYPES,
  pickPrimary,
  summariseFinance,
  type CurrencyTotals,
  type GoldstayTxn,
} from "@/lib/admin/finance";
import { formatPropertyDisplayName } from "@/lib/format-property";

export const dynamic = "force-dynamic";

const PERIOD_LABEL: Record<"month" | "12m", string> = {
  month: "this month",
  "12m": "trailing 12 months",
};

type SortKey = "net" | "revenue" | "cost";

export default async function FinancePage({
  searchParams,
}: {
  searchParams?: { period?: string; sort?: string };
}) {
  await requireRole("finance.read");

  const period: "month" | "12m" =
    searchParams?.period === "12m" ? "12m" : "month";
  const sort: SortKey =
    searchParams?.sort === "revenue"
      ? "revenue"
      : searchParams?.sort === "cost"
        ? "cost"
        : "net";

  const now = new Date();
  const monthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  );
  const trailing12Start = new Date(now);
  trailing12Start.setUTCMonth(trailing12Start.getUTCMonth() - 12);
  trailing12Start.setUTCDate(1);
  trailing12Start.setUTCHours(0, 0, 0, 0);

  const windowStart = period === "month" ? monthStart : trailing12Start;

  // We pull every transaction that could be Goldstay revenue or cost
  // in the longer window and let the helper bucket them. One round-
  // trip drives both the headline and the per-property table.
  const txns = await prisma.transaction.findMany({
    where: {
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

  const inWindow = normalised.filter((t) => t.occurredOn >= windowStart);
  const summary = summariseFinance(inWindow);

  const propertyIds = summary.byProperty.map((p) => p.propertyId);
  const properties = propertyIds.length
    ? await prisma.property.findMany({
        where: { id: { in: propertyIds } },
        select: {
          id: true,
          name: true,
          unitNumber: true,
          city: true,
          country: true,
        },
      })
    : [];
  const propertyById = new Map(properties.map((p) => [p.id, p]));

  // Per-property rows ordered by `sort` in their largest-magnitude
  // currency. Ties resolved by alphabetical property name so the
  // table is stable across reloads.
  const rows = summary.byProperty
    .map((p) => {
      const sortable = [...p.byCurrency].sort(
        (a, b) => Math.abs(b[sort]) - Math.abs(a[sort]),
      )[0];
      return {
        propertyId: p.propertyId,
        property: propertyById.get(p.propertyId) ?? null,
        byCurrency: p.byCurrency,
        sortValue: sortable?.[sort] ?? 0,
      };
    })
    .sort(
      (a, b) =>
        b.sortValue - a.sortValue ||
        (a.property?.name ?? "").localeCompare(b.property?.name ?? ""),
    );

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-medium text-stone-900">Finance</h2>
          <p className="text-sm text-stone-500">
            Goldstay revenue, cost and net: what we keep after every owner
            statement clears. {PERIOD_LABEL[period]}.
          </p>
        </div>
        <PeriodToggle current={period} sort={sort} />
      </header>

      <HeadlineCards
        totals={summary.totals}
        period={period}
      />

      <CostsBreakdown summary={summary} />

      <section className="rounded-lg border border-stone-200 bg-white">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-5 py-4">
          <div>
            <h3 className="text-base font-medium text-stone-900">
              Per-property profit
            </h3>
            <p className="text-xs text-stone-500">
              Goldstay net per property, {PERIOD_LABEL[period]}. Multi-currency
              properties get one row per currency below the property name.
            </p>
          </div>
          <SortToggle current={sort} period={period} />
        </header>

        {rows.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-stone-500">
            No commission revenue or cost recorded in this window yet.
          </p>
        ) : (
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50 text-left text-xs uppercase tracking-wider text-stone-500">
              <tr>
                <th className="px-5 py-2.5">Property</th>
                <th className="px-5 py-2.5 text-right">Revenue</th>
                <th className="px-5 py-2.5 text-right">Cost</th>
                <th className="px-5 py-2.5 text-right">Net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {rows.map((row) => (
                <PropertyRow key={row.propertyId} row={row} />
              ))}
            </tbody>
          </table>
        )}
      </section>

      <p className="text-xs text-stone-500">
        Transactions are grouped by currency, never converted. Goldstay
        does not run an FX rate internally. To compare across currencies,
        pick a single currency on a property and compare against itself
        over time.
      </p>
    </div>
  );
}

function HeadlineCards({
  totals,
  period,
}: {
  totals: CurrencyTotals[];
  period: "month" | "12m";
}) {
  if (totals.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500">
        No Goldstay revenue or cost recorded in {PERIOD_LABEL[period]} yet.
      </div>
    );
  }
  // We pick a primary currency to size the headline tile (KES is the
  // overwhelming majority by transaction count). The rest sit in a
  // small "+ N other currencies" strip below so a multi-country
  // SUPER_ADMIN sees the full picture without scrolling.
  const { primary, otherCount } = pickPrimary(totals, "KES");
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <Tile
        label={`Revenue (${primary?.currency ?? ""})`}
        value={primary ? fmt(primary.revenue) : "—"}
        sub="Commission OUTFLOWs from owner ledgers"
        accent="emerald"
      />
      <Tile
        label={`Cost (${primary?.currency ?? ""})`}
        value={primary ? fmt(primary.cost) : "—"}
        sub="OTA + absorbed cleaning we ate before payout"
        accent="rose"
      />
      <Tile
        label={`Net (${primary?.currency ?? ""})`}
        value={primary ? fmt(primary.net) : "—"}
        sub={
          otherCount > 0
            ? `+ ${otherCount} other ${
                otherCount === 1 ? "currency" : "currencies"
              } below`
            : "Revenue minus cost"
        }
        accent="stone"
      />
      {otherCount > 0 ? (
        <div className="sm:col-span-3">
          <ul className="flex flex-wrap gap-2 text-xs text-stone-600">
            {totals
              .filter((t) => t.currency !== primary?.currency)
              .map((t) => (
                <li
                  key={t.currency}
                  className="rounded-md border border-stone-200 bg-stone-50 px-2 py-1"
                >
                  <span className="font-mono font-medium text-stone-900">
                    {t.currency}
                  </span>{" "}
                  rev {fmt(t.revenue)} · cost {fmt(t.cost)} ·{" "}
                  <strong>net {fmt(t.net)}</strong>
                </li>
              ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function CostsBreakdown({
  summary,
}: {
  summary: ReturnType<typeof summariseFinance>;
}) {
  if (summary.costsByType.length === 0) return null;
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5">
      <h3 className="text-base font-medium text-stone-900">
        Where the cost goes
      </h3>
      <ul className="mt-3 divide-y divide-stone-100 text-sm">
        {summary.costsByType.map((line) => (
          <li
            key={line.type}
            className="flex flex-wrap items-center justify-between gap-2 py-2.5"
          >
            <span className="text-stone-700">
              {line.type === "OTA_COMMISSION"
                ? "OTA commissions paid (Airbnb / Booking.com)"
                : line.type === "CLEANING_FEE"
                  ? "Cleaning fees absorbed"
                  : line.type}
            </span>
            <span className="flex flex-wrap gap-2 text-xs text-stone-600">
              {line.byCurrency.map((c) => (
                <span
                  key={c.currency}
                  className="rounded-md bg-stone-50 px-2 py-1"
                >
                  <span className="font-mono font-medium text-stone-900">
                    {c.currency}
                  </span>{" "}
                  {fmt(c.cost)}
                </span>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PropertyRow({
  row,
}: {
  row: {
    propertyId: string;
    property: {
      id: string;
      name: string;
      unitNumber: string | null;
      city: string;
      country: "KE" | "GH";
    } | null;
    byCurrency: CurrencyTotals[];
  };
}) {
  return (
    <tr className="align-top">
      <td className="px-5 py-3">
        {row.property ? (
          <Link
            href={`/admin/properties/${row.property.id}`}
            className="font-medium text-stone-900 hover:underline"
          >
            {formatPropertyDisplayName(
              row.property.name,
              row.property.unitNumber,
            )}
          </Link>
        ) : (
          <span className="text-stone-500">Archived property</span>
        )}
        {row.property ? (
          <p className="text-xs text-stone-500">
            {row.property.city} ·{" "}
            {row.property.country === "KE" ? "Kenya" : "Ghana"}
          </p>
        ) : null}
      </td>
      <td className="px-5 py-3">
        <CurrencyStack rows={row.byCurrency} field="revenue" tone="emerald" />
      </td>
      <td className="px-5 py-3">
        <CurrencyStack rows={row.byCurrency} field="cost" tone="rose" />
      </td>
      <td className="px-5 py-3">
        <CurrencyStack rows={row.byCurrency} field="net" tone="stone" bold />
      </td>
    </tr>
  );
}

function CurrencyStack({
  rows,
  field,
  tone,
  bold,
}: {
  rows: CurrencyTotals[];
  field: "revenue" | "cost" | "net";
  tone: "emerald" | "rose" | "stone";
  bold?: boolean;
}) {
  const toneClass =
    tone === "emerald"
      ? "text-emerald-700"
      : tone === "rose"
        ? "text-rose-700"
        : "text-stone-900";
  return (
    <ul className="space-y-1 text-right text-sm tabular-nums">
      {rows.map((r) => (
        <li key={r.currency} className={bold ? "font-medium" : ""}>
          <span className={toneClass}>{fmt(r[field])}</span>{" "}
          <span className="text-xs text-stone-400">{r.currency}</span>
        </li>
      ))}
    </ul>
  );
}

function Tile({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent: "emerald" | "rose" | "stone";
}) {
  const ring =
    accent === "emerald"
      ? "ring-emerald-100"
      : accent === "rose"
        ? "ring-rose-100"
        : "ring-stone-100";
  return (
    <div
      className={`rounded-lg border border-stone-200 bg-white p-5 shadow-sm ring-2 ring-inset ${ring}`}
    >
      <p className="text-xs uppercase tracking-wider text-stone-500">{label}</p>
      <p className="mt-2 font-serif text-2xl text-stone-900 tabular-nums">
        {value}
      </p>
      <p className="mt-1 text-xs text-stone-500">{sub}</p>
    </div>
  );
}

function PeriodToggle({
  current,
  sort,
}: {
  current: "month" | "12m";
  sort: SortKey;
}) {
  return (
    <div className="inline-flex rounded-md border border-stone-200 bg-white text-xs">
      {(["month", "12m"] as const).map((p) => {
        const active = p === current;
        return (
          <Link
            key={p}
            href={`/admin/finance?period=${p}&sort=${sort}`}
            className={
              active
                ? "rounded-md bg-stone-900 px-3 py-1.5 font-medium text-white"
                : "px-3 py-1.5 text-stone-700 hover:text-stone-900"
            }
          >
            {p === "month" ? "This month" : "12 months"}
          </Link>
        );
      })}
    </div>
  );
}

function SortToggle({
  current,
  period,
}: {
  current: SortKey;
  period: "month" | "12m";
}) {
  return (
    <div className="inline-flex items-center gap-1 text-xs text-stone-500">
      <span>Sort:</span>
      {(["net", "revenue", "cost"] as const).map((s) => {
        const active = s === current;
        return (
          <Link
            key={s}
            href={`/admin/finance?period=${period}&sort=${s}`}
            className={
              active
                ? "rounded-md bg-stone-900 px-2 py-1 font-medium text-white"
                : "rounded-md px-2 py-1 text-stone-700 hover:bg-stone-100"
            }
          >
            {s}
          </Link>
        );
      })}
    </div>
  );
}

function fmt(n: number): string {
  return n.toLocaleString("en-GB", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
