// Pure-SVG monthly net chart for the landlord dashboard. Server
// rendered, zero client JS, zero charting library — we only need 12
// bars and a baseline, and a real chart library would balloon the
// owner bundle for no benefit.
//
// Bars are positive=emerald, negative=red, zero=stone. The chart
// scales bar heights to the largest absolute value so a single big
// month doesn't visually drown the others. We render the value on
// hover via a native <title> tag (no popovers, no JS).

import type { MonthlyBucket } from "@/lib/owner-kpis";

type Props = {
  series: MonthlyBucket[];
  currency: string;
  height?: number;
};

const PADDING_X = 4;
const PADDING_TOP = 8;
const PADDING_BOTTOM = 18; // room for axis labels
const BAR_GAP = 4;

export function MonthlyNetChart({ series, currency, height = 140 }: Props) {
  if (series.length === 0) {
    return (
      <p className="text-sm text-stone-500">No monthly activity to chart.</p>
    );
  }

  const maxAbs = Math.max(1, ...series.map((b) => Math.abs(b.net)));
  // Use a viewBox so we render at any width without per-pixel math.
  const VBW = 600;
  const VBH = height;
  const innerW = VBW - PADDING_X * 2;
  const innerH = VBH - PADDING_TOP - PADDING_BOTTOM;
  const baselineY = PADDING_TOP + innerH / 2;
  const colW = innerW / series.length;

  return (
    <div className="space-y-2">
      <svg
        viewBox={`0 0 ${VBW} ${VBH}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`Monthly net in ${currency} over the last ${series.length} months`}
        className="block w-full"
      >
        {/* Zero baseline */}
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
          const fill = isPos
            ? "#047857"
            : isNeg
              ? "#b91c1c"
              : "#d6d3d1";
          return (
            <g key={b.month}>
              <rect
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
            </g>
          );
        })}

        {/* X-axis labels — we only render every Nth month label so
            12 of them don't overlap on narrow viewports. */}
        {series.map((b, i) => {
          // Show first, last, and every third in between.
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
    </div>
  );
}
