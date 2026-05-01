import Link from "next/link";
import { ArrowUpRight, TrendingUp, Wallet, Home, Receipt } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";

// Marketing-side preview of the live owner dashboard at /owner. The
// real dashboard is gated behind Supabase auth, so the marketing site
// has no credible way to surface "look, the product exists" without
// either a screenshot (drifts the moment we touch the dashboard) or
// a polished mockup that mirrors the real layout one-for-one.
//
// We picked the mockup. It can never go stale relative to a screenshot
// PNG, scales perfectly on mobile, takes no asset slot and stays in
// sync with the brand because it uses the same Tailwind tokens as the
// real product. Numbers are obviously illustrative — printed in muted
// type next to a "sample data" tag so we never accidentally read as
// real owner figures.
//
// City-aware: on .co.ke the currency tag is KES, on .com.gh it's GHS,
// on the neutral .com it's USD because the dual-market homepage only
// renders there.

type Props = {
  city?: "nairobi" | "accra";
};

const COPY = {
  nairobi: {
    currency: "KES",
    primaryLabel: "April rent collected",
    primaryValue: "KES 1,420,000",
    primaryUsd: "≈ $11,000",
    primaryProperty: "Westlands · 4-bed",
  },
  accra: {
    currency: "GHS",
    primaryLabel: "April rent collected",
    primaryValue: "GHS 23,800",
    primaryUsd: "≈ $1,580",
    primaryProperty: "East Legon · 3-bed",
  },
  default: {
    currency: "USD",
    primaryLabel: "April rent collected",
    primaryValue: "$11,000",
    primaryUsd: "across 6 units",
    primaryProperty: "Multi-property portfolio",
  },
} as const;

export function DashboardPreview({ city }: Props) {
  const copy = city ? COPY[city] : COPY.default;

  return (
    <section className="section bg-white">
      <div className="container-gs">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-24">
          <div>
            <SectionHeader
              eyebrow="Live owner dashboard"
              title="Open the app at 2 a.m. in Dubai. See exactly where you stand."
              lede="Every collection, every payout, every active lease. Live, not monthly. The same dashboard your statement is generated from — so the numbers can't disagree."
            />

            <ul className="mt-10 space-y-4 text-charcoal/80">
              <Bullet icon={<TrendingUp className="h-4 w-4" />}>
                Net month-on-month, per currency, charted from real
                transactions.
              </Bullet>
              <Bullet icon={<Wallet className="h-4 w-4" />}>
                30-day vs. prior-30 comparison for the KPI that owners
                actually ask about.
              </Bullet>
              <Bullet icon={<Home className="h-4 w-4" />}>
                Per-property occupancy and active-lease state, so you spot a
                vacancy the day it opens.
              </Bullet>
              <Bullet icon={<Receipt className="h-4 w-4" />}>
                Every rent collection, expense, and payout — searchable,
                exportable, with the receipt one click away.
              </Bullet>
            </ul>

            <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Link href="/list-your-property" className="btn-primary">
                Get my dashboard
              </Link>
              <Link
                href="/about"
                className="link-underline self-center text-sm text-charcoal/70 sm:ml-2"
              >
                How we built it →
              </Link>
            </div>
          </div>

          <Reveal>
            <DashboardMockup copy={copy} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Bullet({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-700">
        {icon}
      </span>
      <span>{children}</span>
    </li>
  );
}

// The mockup itself. Built with the same tailwind tokens as the live
// owner dashboard (charcoal text, cream surfaces, gold accents, soft
// shadow, rounded-2xl) so it reads as "the real product, just shown
// here for marketing." The "Sample data" badge is non-negotiable —
// readers must not mistake the illustrative numbers for a real
// landlord's figures.
function DashboardMockup({
  copy,
}: {
  copy: (typeof COPY)[keyof typeof COPY];
}) {
  return (
    <div className="relative">
      {/* Soft shadow / depth so the mockup sits above the page like a
          real product screenshot. */}
      <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-gold-100/40 via-cream-100 to-cream-100 blur-2xl" />

      <div className="overflow-hidden rounded-2xl border border-charcoal/10 bg-white shadow-soft">
        {/* Browser chrome — three traffic-light dots + URL pill. Subtle
            but immediately reads as "this is an app screenshot, not
            decorative chart art." */}
        <div className="flex items-center gap-2 border-b border-charcoal/5 bg-cream-100 px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-stone-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-stone-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-stone-300" />
          </div>
          <div className="ml-3 flex-1 truncate rounded-md bg-white/80 px-3 py-1 font-mono text-[0.65rem] text-stone-500">
            goldstay.com/owner
          </div>
          <span className="hidden rounded-full bg-charcoal/5 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest-xl text-charcoal/60 sm:inline">
            Sample data
          </span>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="font-mono text-[0.65rem] uppercase tracking-widest-xl text-stone-500">
                Welcome back, Asha
              </div>
              <div className="mt-1 font-serif text-xl text-charcoal sm:text-2xl">
                Your portfolio, at a glance
              </div>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[0.65rem] font-medium text-emerald-700">
              All collections current
            </span>
          </div>

          {/* KPI strip. Mirrors the live KpiCard layout: label →
              big-number → delta vs. last period. */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Kpi
              label={copy.primaryLabel}
              value={copy.primaryValue}
              hint={copy.primaryUsd}
              tone="primary"
            />
            <Kpi label="vs. March" value="+8.2%" hint="net of fees" tone="up" />
            <Kpi label="Occupancy" value="92%" hint="11 of 12 units" />
            <Kpi label="Next payout" value="May 5" hint="USD wire" />
          </div>

          {/* Tiny bar chart. CSS-only, so it has zero JS cost and no
              chart library to keep in sync with the real dashboard's
              recharts implementation. The shape (gentle climb to a
              recent peak) reads as "growing, healthy". */}
          <div className="mt-6 rounded-xl bg-cream-100 p-4">
            <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-widest-xl text-stone-500">
              <span>Net per month · {copy.currency}</span>
              <span className="font-mono">last 12</span>
            </div>
            <div className="mt-3 flex h-20 items-end gap-1.5">
              {[42, 38, 51, 47, 55, 49, 61, 58, 67, 63, 71, 76].map((h, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-sm bg-gold-500/80"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between font-mono text-[0.55rem] text-stone-400">
              <span>May &apos;25</span>
              <span>Apr &apos;26</span>
            </div>
          </div>

          {/* Recent activity — three rows that look like a real ledger.
              Each carries an icon → a one-line label → an amount. */}
          <div className="mt-5">
            <div className="font-mono text-[0.65rem] uppercase tracking-widest-xl text-stone-500">
              Recent activity
            </div>
            <ul className="mt-2 divide-y divide-charcoal/5">
              <ActivityRow
                title={`Rent collected · ${copy.primaryProperty}`}
                meta="Apr 28 · M-PESA"
                amount={`+ ${copy.primaryValue}`}
                positive
              />
              <ActivityRow
                title="USD wire to HSBC London"
                meta="Apr 5 · Reference GS-04-118"
                amount="- $9,820"
              />
              <ActivityRow
                title="Quarterly service charge · Pinetree"
                meta="Apr 3 · Receipt attached"
                amount="- $740"
                muted
              />
            </ul>
          </div>

          <div className="mt-4 flex items-center justify-end text-[0.65rem] text-stone-400">
            <span className="inline-flex items-center gap-1">
              Open the live dashboard
              <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "primary" | "up";
}) {
  const valueClass =
    tone === "primary"
      ? "text-charcoal"
      : tone === "up"
        ? "text-emerald-700"
        : "text-charcoal";
  return (
    <div className="rounded-lg border border-charcoal/5 bg-white p-3">
      <div className="font-mono text-[0.55rem] uppercase tracking-widest-xl text-stone-500">
        {label}
      </div>
      <div className={`mt-1 font-serif text-base sm:text-lg ${valueClass}`}>
        {value}
      </div>
      {hint && (
        <div className="mt-0.5 text-[0.65rem] text-stone-500">{hint}</div>
      )}
    </div>
  );
}

function ActivityRow({
  title,
  meta,
  amount,
  positive,
  muted,
}: {
  title: string;
  meta: string;
  amount: string;
  positive?: boolean;
  muted?: boolean;
}) {
  const amountTone = positive
    ? "text-emerald-700"
    : muted
      ? "text-stone-400"
      : "text-charcoal/80";
  return (
    <li className="flex items-center justify-between gap-3 py-2.5 text-sm">
      <div>
        <div className="text-charcoal">{title}</div>
        <div className="text-[0.7rem] text-stone-500">{meta}</div>
      </div>
      <div className={`font-mono text-sm ${amountTone}`}>{amount}</div>
    </li>
  );
}
