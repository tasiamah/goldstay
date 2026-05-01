// EarningsTrendChart — bars for monthly net, plus a thin line that
// traces cumulative net across the same window. Server rendered SVG,
// no client JS, no chart library. The cumulative overlay turns the
// chart from "did this month do better than last" (which the bars
// already say) into "is the portfolio compounding" (which is the
// question an owner actually opens the dashboard to ask).
//
// Bars use the same emerald/red signed convention as MonthlyNetChart,
// so an owner who's seen one chart on the platform recognises the
// scale at a glance. The cumulative line is rendered in stone-700 so
// it overlays cleanly without competing with the bars.

import type { MonthlyBucket } from "@/lib/owner-kpis";

type Props = {
  series: MonthlyBucket[];
  currency: string;
  height?: number;
};

const PADDING_X = 4;
const PADDING_TOP = 8;
const PADDING_BOTTOM = 18;
const BAR_GAP = 4;

export function EarningsTrendChart({ series, currency, height = 180 }: Props) {
  if (series.length === 0) {
    return (
      <p className="text-sm text-stone-500">No monthly activity to chart.</p>
    );
  }

  // Cumulative running total across the window. We compute it once
  // here so the line and the optional axis labels share one source
  // of truth.
  const cumulative: number[] = [];
  let running = 0;
  for (const b of series) {
    running += b.net;
    cumulative.push(running);
  }

  // The bar axis is symmetric around zero (positives go up, negatives
  // down), but the cumulative line sits above zero for any owner with
  // net-positive 12 months and we want it to read on the same canvas.
  // So we pick a single max-abs that covers both, then split the
  // canvas: top half for positives + the line, bottom half for
  // negative bars only.
  const maxAbsBars = Math.max(0, ...series.map((b) => Math.abs(b.net)));
  const maxCumulative = Math.max(0, ...cumulative.map((c) => Math.abs(c)));
  const maxAbs = Math.max(1, maxAbsBars, maxCumulative);

  const VBW = 600;
  const VBH = height;
  const innerW = VBW - PADDING_X * 2;
  const innerH = VBH - PADDING_TOP - PADDING_BOTTOM;
  const baselineY = PADDING_TOP + innerH / 2;
  const colW = innerW / series.length;

  // Cumulative polyline points — one per bucket, anchored to the
  // centre of the bar slot.
  const linePoints = cumulative
    .map((c, i) => {
      const cx = PADDING_X + i * colW + colW / 2;
      const ratio = c / maxAbs;
      const cy = baselineY - ratio * (innerH / 2);
      return `${cx.toFixed(1)},${cy.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${VBW} ${VBH}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={`Monthly and cumulative net in ${currency} over the last ${series.length} months`}
      className="block w-full"
    >
      <line
        x1={PADDING_X}
        x2={VBW - PADDING_X}
        y1={baselineY}
        y2={baselineY}
        stroke="#e7e5e4"
        strokeDasharray="2 3"
      />

      {series.map((b, i) => {
        const x = PADDING_X + i * colW + BAR_GAP / 2;
        const w = Math.max(1, colW - BAR_GAP);
        const ratio = Math.abs(b.net) / maxAbs;
        const barH = ratio * (innerH / 2);
        const isPos = b.net > 0;
        const isNeg = b.net < 0;
        const y = isPos ? baselineY - barH : baselineY;
        const fill = isPos ? "#047857" : isNeg ? "#b91c1c" : "#d6d3d1";
        return (
          <rect
            key={b.month}
            x={x}
            y={y}
            width={w}
            height={Math.max(1, barH)}
            fill={fill}
            rx={1.5}
          >
            <title>
              {b.label} · {b.net >= 0 ? "+" : "−"}
              {Math.abs(b.net).toLocaleString("en-GB", {
                maximumFractionDigits: 0,
              })}{" "}
              {currency}
            </title>
          </rect>
        );
      })}

      {/* Cumulative line overlay — sits on top of the bars, styled
          deliberately thin and dark so it reads as a trend
          annotation rather than a competing primary series. */}
      <polyline
        fill="none"
        stroke="#1c1917"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={linePoints}
      />
      {cumulative.map((c, i) => {
        const cx = PADDING_X + i * colW + colW / 2;
        const ratio = c / maxAbs;
        const cy = baselineY - ratio * (innerH / 2);
        return (
          <circle
            key={`pt-${series[i]!.month}`}
            cx={cx}
            cy={cy}
            r={2}
            fill="#1c1917"
          >
            <title>
              {series[i]!.label} cumulative · {c >= 0 ? "+" : "−"}
              {Math.abs(c).toLocaleString("en-GB", {
                maximumFractionDigits: 0,
              })}{" "}
              {currency}
            </title>
          </circle>
        );
      })}

      {series.map((b, i) => {
        const isEdge = i === 0 || i === series.length - 1;
        if (!isEdge && i % 3 !== 0) return null;
        const x = PADDING_X + i * colW + colW / 2;
        return (
          <text
            key={`lbl-${b.month}`}
            x={x}
            y={VBH - 4}
            textAnchor="middle"
            fontSize={10}
            fill="#78716c"
          >
            {b.label.replace(/ \d{2}$/, "")}
          </text>
        );
      })}
    </svg>
  );
}
