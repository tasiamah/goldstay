// Single KPI tile for the owner dashboard. Server component, no
// state. The optional `trend` slot renders a tiny coloured chip with
// a delta label so a landlord can see at a glance whether the last
// 30 days are tracking ahead of or behind the prior period.

import type { PctChange } from "@/lib/owner-kpis";

export type KpiCardProps = {
  label: string;
  value: string;
  // Subdued caption rendered below the value (e.g. "in KES" or "of 4
  // properties"). Skipped when omitted.
  sub?: string;
  trend?: PctChange & { label?: string };
};

export function KpiCard({ label, value, sub, trend }: KpiCardProps) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5">
      <p className="text-xs uppercase tracking-wider text-stone-500">
        {label}
      </p>
      <p className="mt-2 font-serif text-2xl text-stone-900 tabular-nums">
        {value}
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        {sub ? <p className="text-xs text-stone-500">{sub}</p> : null}
        {trend ? <TrendChip {...trend} /> : null}
      </div>
    </div>
  );
}

function TrendChip({
  delta,
  direction,
  label,
}: PctChange & { label?: string }) {
  const styles =
    direction === "up"
      ? "bg-emerald-50 text-emerald-700"
      : direction === "down"
        ? "bg-red-50 text-red-700"
        : "bg-stone-100 text-stone-600";
  const arrow =
    direction === "up" ? "↑" : direction === "down" ? "↓" : "·";
  const formatted =
    delta === null
      ? ""
      : `${Math.abs(delta).toLocaleString("en-GB", { maximumFractionDigits: 0 })}%`;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums ${styles}`}
    >
      <span aria-hidden>{arrow}</span>
      {formatted}
      {label ? <span className="font-normal opacity-80"> {label}</span> : null}
    </span>
  );
}
