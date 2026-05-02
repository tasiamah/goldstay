// KpiStrip — six-card morning-glance summary of the business at the
// top of the admin overview. Each card carries one number and either
// a sub-line (raw counts behind a percentage) or a delta vs the
// prior month so the operator can read movement in one scan.
//
// Cards are deliberately calm: no big colour swatches, no charts.
// Colour is reserved for the delta badge so an operator's eye is
// drawn to *change*, which is what determines whether anything needs
// doing today.

import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import type { Delta, OverviewKpis } from "@/lib/admin/queue";

export function KpiStrip({ kpis }: { kpis: OverviewKpis }) {
  return (
    <div className="space-y-8">
      <PulseStrip kpis={kpis} />
      <GrowthStrip kpis={kpis} />
    </div>
  );
}

function PulseStrip({ kpis }: { kpis: OverviewKpis }) {
  return (
    <section>
      <header className="mb-3 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-base font-medium text-stone-900">
            Business pulse
          </h2>
          <p className="text-sm text-stone-500">
            Six numbers that tell you in 10 seconds whether this month is
            tracking ahead, behind, or flat.
          </p>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          label="Occupancy"
          value={
            kpis.occupancy.pct === null
              ? "No units"
              : `${formatPct(kpis.occupancy.pct, 0)}%`
          }
          sub={
            kpis.occupancy.totalUnits === 0
              ? "Add a property to start tracking occupancy"
              : `${kpis.occupancy.leasedUnits} of ${kpis.occupancy.totalUnits} units leased`
          }
          // Drill to live properties — onboarding/exited would muddy
          // the operator's "what's actually earning" view.
          href="/admin/properties?status=ACTIVE"
        />
        <KpiCard
          label="Vacant units"
          value={kpis.vacantUnits.toString()}
          sub={
            kpis.vacantUnits === 0
              ? "Portfolio fully let. Pop the champagne."
              : "Units without an active lease today"
          }
          href="/admin/properties?vacancy=vacant"
        />
        <KpiCard
          label="New leads"
          value={kpis.leads.current.toString()}
          sub="This month, all sources"
          delta={kpis.leads}
          href="/admin/leads?period=this-month"
        />
        <KpiCard
          label="New owners"
          value={kpis.owners.current.toString()}
          sub="Signed and onboarded this month"
          delta={kpis.owners}
          href="/admin/owners?period=this-month"
        />
        {/* Referrers + signed referrals don't have a dedicated admin
            list page yet (the dashboards live behind a per-referrer
            magic-link token on the marketing surface), so these cards
            are intentionally non-clickable until we ship one. */}
        <KpiCard
          label="Active referrers"
          value={kpis.activeReferrers.toString()}
          sub="Agents and landlords earning commission"
        />
        <KpiCard
          label="Referrals signed"
          value={kpis.referralsSignedThisMonth.toString()}
          sub="Closed via the referral programme this month"
        />
      </div>
    </section>
  );
}

// GrowthStrip — the four numbers that describe whether the business
// is expanding or contracting *underneath* this month's snapshot.
// Pulse tells you "today's state". Growth tells you "the direction".
// Two strips because cramming everything into one wall of cards
// dilutes both stories.
function GrowthStrip({ kpis }: { kpis: OverviewKpis }) {
  const conv = kpis.leadConversion;
  return (
    <section>
      <header className="mb-3 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-base font-medium text-stone-900">
            Growth &amp; funnel
          </h2>
          <p className="text-sm text-stone-500">
            Four numbers that describe direction, not state. Conversion and
            velocity over a rolling 30 days; properties and churn vs. last
            calendar month.
          </p>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Lead conversion"
          value={
            conv.pct === null ? "No data" : `${formatPct(conv.pct, 0)}%`
          }
          sub={
            conv.leadsCreated === 0
              ? "No leads in the last 30 days"
              : `${conv.leadsConverted} of ${conv.leadsCreated} leads converted (rolling 30d)`
          }
        />
        <KpiCard
          label="Lead → owner days"
          value={
            kpis.avgDaysToConvert === null
              ? "No data"
              : `${kpis.avgDaysToConvert.toFixed(1)} d`
          }
          sub={
            kpis.avgDaysToConvert === null
              ? "Nobody converted in the last 30 days"
              : "Mean time from first contact to signed owner"
          }
        />
        <KpiCard
          label="Properties added"
          value={kpis.properties.current.toString()}
          sub="New on the platform this month"
          delta={kpis.properties}
          href="/admin/properties"
        />
        <KpiCard
          label="Owner churn"
          value={kpis.ownerChurn.current.toString()}
          // Inverted semantics: when churn goes up, the badge will
          // be green by default — the operator reads it correctly
          // because the sub-line frames it as exits, not growth.
          // Eventually we may want a `negativeIsGood` flip on Delta;
          // for now keep the colour neutral by not passing delta.
          sub={
            kpis.ownerChurn.current === 0
              ? "Nobody offboarded this month"
              : `${kpis.ownerChurn.current} this month vs ${kpis.ownerChurn.prior} last`
          }
        />
      </div>
    </section>
  );
}

function KpiCard({
  label,
  value,
  sub,
  delta,
  href,
}: {
  label: string;
  value: string;
  sub: string;
  delta?: Delta;
  href?: string;
}) {
  const inner = (
    <div className="h-full rounded-lg border border-stone-200 bg-white p-5 transition hover:border-stone-300">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs uppercase tracking-wider text-stone-500">
          {label}
        </p>
        {delta ? <DeltaBadge delta={delta} /> : null}
      </div>
      <p className="mt-2 font-serif text-2xl text-stone-900">{value}</p>
      <p className="mt-1 text-xs text-stone-500">{sub}</p>
    </div>
  );
  return href ? (
    <Link href={href} className="block">
      {inner}
    </Link>
  ) : (
    inner
  );
}

function DeltaBadge({ delta }: { delta: Delta }) {
  const tone =
    delta.direction === "up"
      ? "bg-emerald-50 text-emerald-700"
      : delta.direction === "down"
        ? "bg-rose-50 text-rose-700"
        : "bg-stone-100 text-stone-600";

  const Icon =
    delta.direction === "up"
      ? ArrowUp
      : delta.direction === "down"
        ? ArrowDown
        : ArrowRight;

  // Prior-zero case: print "new" instead of an infinite percentage.
  // The only honest read of "0 → N" is "this is a new metric this
  // period," not "+infinity%". When both periods are zero we say
  // "flat" so the badge still reads as a real signal rather than a
  // visually-mute placeholder character.
  const text =
    delta.pct === null
      ? delta.current > 0
        ? "new"
        : "flat"
      : `${delta.pct >= 0 ? "+" : ""}${formatPct(delta.pct, 0)}%`;

  return (
    <span
      title={`${delta.current} this month vs ${delta.prior} last month`}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.7rem] font-medium ${tone}`}
    >
      <Icon className="h-3 w-3" />
      {text}
    </span>
  );
}

function formatPct(n: number, digits: number): string {
  return n.toLocaleString("en-GB", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
