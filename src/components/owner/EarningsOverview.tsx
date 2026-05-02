// EarningsOverview — the headline "what have I earned" card on the
// owner dashboard. KPIs on the left, a 12-month trend chart on the
// right (bars + cumulative line). Replaces the older
// "Net by month" section so the owner gets the answer to
// "is this working" in a single read.
//
// We deliberately render this as one card (not three KPI tiles +
// a separate chart) because the eye should travel left-to-right:
// "I made X over the year, Y is contracted to come in this month,
// Z leases are live — and here's the curve." Splitting them across
// rows breaks that narrative.
//
// Currency handling mirrors the rest of the dashboard: we feature
// the owner's primary currency (or the largest by volume), and
// surface a small "+ N other currencies" footnote when their
// portfolio crosses borders rather than silently summing.

import Link from "next/link";
import type { CurrencySummary } from "@/lib/owner-kpis";
import { EarningsTrendChart } from "./EarningsTrendChart";

type Props = {
  primary: CurrencySummary;
  otherCurrencyCount: number;
  expectedThisMonth: {
    amount: number;
    currency: string;
    activeLeaseCount: number;
    otherCurrencyCount: number;
  } | null;
  activeLeaseCount: number;
  windowStart: Date;
  windowEnd: Date;
};

export function EarningsOverview({
  primary,
  otherCurrencyCount,
  expectedThisMonth,
  activeLeaseCount,
  windowStart,
  windowEnd,
}: Props) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-base font-medium text-stone-900">Your earnings</h2>
        <Link
          href="/owner/statements"
          className="text-sm font-medium text-stone-700 hover:text-stone-900 hover:underline"
        >
          All my stats →
        </Link>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,18rem)_1fr]">
        <ul className="space-y-5">
          <Kpi
            icon={<WalletIcon />}
            label="Net earnings (last 12 months)"
            value={`${primary.currency} ${fmt(primary.twelveMonthNet)}`}
            sub={
              otherCurrencyCount > 0
                ? `+ ${otherCurrencyCount} other ${
                    otherCurrencyCount === 1 ? "currency" : "currencies"
                  }`
                : undefined
            }
          />
          <Kpi
            icon={<CoinsIcon />}
            label="Expected this month"
            value={
              expectedThisMonth
                ? `${expectedThisMonth.currency} ${fmt(expectedThisMonth.amount)}`
                : "No active leases"
            }
            sub={
              expectedThisMonth
                ? expectedThisMonth.otherCurrencyCount > 0
                  ? `Across ${expectedThisMonth.activeLeaseCount} active ${
                      expectedThisMonth.activeLeaseCount === 1
                        ? "lease"
                        : "leases"
                    } · + ${expectedThisMonth.otherCurrencyCount} other ${
                      expectedThisMonth.otherCurrencyCount === 1
                        ? "currency"
                        : "currencies"
                    }`
                  : `Contracted from ${expectedThisMonth.activeLeaseCount} active ${
                      expectedThisMonth.activeLeaseCount === 1
                        ? "lease"
                        : "leases"
                    }`
                : "No active leases yet"
            }
          />
          <Kpi
            icon={<CheckIcon />}
            label="Active leases"
            value={String(activeLeaseCount)}
            sub={
              activeLeaseCount === 0
                ? "Goldstay will start placing tenants soon"
                : "Earning rent right now"
            }
          />
        </ul>

        <div>
          <p className="text-sm text-stone-500">
            Net earnings over time (from{" "}
            <strong className="text-stone-700">
              {windowStart.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}
            </strong>{" "}
            to{" "}
            <strong className="text-stone-700">
              {windowEnd.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}
            </strong>
            )
          </p>
          <div className="mt-4">
            <EarningsTrendChart
              series={primary.monthlyNet}
              currency={primary.currency}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Kpi({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-stone-100 text-stone-600"
        aria-hidden
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm text-stone-600">{label}</p>
        <p className="mt-0.5 text-xl font-semibold tabular-nums text-stone-900">
          {value}
        </p>
        {sub ? <p className="mt-0.5 text-xs text-stone-500">{sub}</p> : null}
      </div>
    </li>
  );
}

function fmt(n: number): string {
  return n.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function WalletIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
      <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7H7a2 2 0 0 1 0-4h12" />
      <circle cx="17" cy="13" r="1" fill="currentColor" />
    </svg>
  );
}

function CoinsIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="9" cy="7" rx="6" ry="3" />
      <path d="M3 7v4c0 1.66 2.69 3 6 3s6-1.34 6-3V7" />
      <path d="M3 11v4c0 1.66 2.69 3 6 3s6-1.34 6-3" />
      <ellipse cx="17" cy="15" rx="4" ry="2" />
      <path d="M13 15v4c0 1.1 1.79 2 4 2s4-.9 4-2v-4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </svg>
  );
}
