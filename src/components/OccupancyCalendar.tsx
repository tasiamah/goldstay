// Server-rendered, dependency-free monthly occupancy heatmap.
// Renders the last N months (default 3) with one square per night,
// shaded by booking source. Columns are day-of-week (Mon → Sun) and
// the leftmost column shows the Monday's day-of-month so the
// operator can quickly say "the week of the 11th was fully booked".
// Everything is computed in UTC midnights to avoid timezone
// foot-guns; same anchor the booking aggregation uses.
//
// Layout: a single CSS grid with a fixed track size for each
// column, so the weekday header letters sit dead-centre over their
// squares (no sub-pixel wobble).
//
// Each square shows a tooltip on hover with check-in/out info. No
// client JS required — it's <span title="...">.

import {
  buildOccupancyIndex,
  dayKeyUTC,
  heatmapWindowEnd,
  HEATMAP_MONTHS_AHEAD,
  type Occupant,
  type OccupantBooking,
  type OccupantLease,
} from "@/lib/bookings/heatmap";

// Colour per channel. Vrbo / Booking.com are kept in the map so
// historical bookings still render if they exist, but they don't
// appear in the legend until we re-enable them in
// src/lib/booking-sources.ts.
// A tenancy is not a channel, so it gets its own colour rather than
// borrowing one and reading as a booking that never happened.
const LEASE_COLOR = "bg-indigo-400";

const SOURCE_COLOR: Record<string, string> = {
  AIRBNB: "bg-rose-400",
  BOOKING_COM: "bg-sky-500",
  VRBO: "bg-amber-400",
  DIRECT: "bg-emerald-500",
};

const LEGEND_SOURCES: { src: keyof typeof SOURCE_COLOR; label: string }[] = [
  { src: "AIRBNB", label: "Airbnb" },
  { src: "DIRECT", label: "Direct" },
];

function startOfMonthUTC(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

function addMonthsUTC(d: Date, n: number): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1));
}

function daysInMonthUTC(d: Date): number {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0),
  ).getUTCDate();
}

function fmtMonth(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function OccupancyCalendar({
  bookings,
  leases,
  monthsBack = 3,
  now = new Date(),
  loadMoreHref,
}: {
  bookings?: OccupantBooking[];
  // Long lets fill the board for the term of the tenancy. Passing
  // neither is legitimate — a flat between tenants reads as vacant.
  leases?: OccupantLease[];
  monthsBack?: number;
  now?: Date;
  // When set, renders a "Show 3 more months" link below the grid.
  // The page decides whether to show it based on whether older
  // bookings actually exist and the window hasn't hit its cap.
  loadMoreHref?: string | null;
}) {
  // Last month, this month and next, for the default three blocks.
  // Widening reveals more history; next month stays at the far end,
  // because the point of drawing it is that it is always the edge of
  // what is known.
  const thisMonth = startOfMonthUTC(now);
  const months: Date[] = [];
  for (let i = monthsBack - 1 - HEATMAP_MONTHS_AHEAD; i >= 0; i--) {
    months.push(addMonthsUTC(thisMonth, -i));
  }
  for (let i = 1; i <= HEATMAP_MONTHS_AHEAD; i++) {
    months.push(addMonthsUTC(thisMonth, i));
  }

  // How far an open-ended lease is filled: the last day drawn.
  const windowEnd = heatmapWindowEnd(now);
  const dayIndex = buildOccupancyIndex({ bookings, leases, windowEnd });
  const showTenancy = [...dayIndex.values()].some((o) => o.kind === "lease");

  return (
    <div className="space-y-4">
      <Legend showTenancy={showTenancy} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {months.map((m) => (
          <MonthGrid
            key={m.toISOString()}
            month={m}
            dayIndex={dayIndex}
            todayKey={dayKeyUTC(now)}
          />
        ))}
      </div>
      {loadMoreHref ? (
        <div className="pt-1">
          <a
            href={loadMoreHref}
            className="inline-flex items-center gap-1 text-xs font-medium text-stone-600 hover:text-stone-900"
          >
            ← Show 3 more months
          </a>
        </div>
      ) : null}
    </div>
  );
}

// Re-export the heatmap helpers so callers only need to remember one
// import path. The actual definitions live in `lib/bookings/heatmap`
// so they're testable without pulling JSX into Vitest.
export {
  clampHeatmapMonths,
  heatmapWindowStart,
  heatmapWindowEnd,
  heatmapWindowLabel,
  HEATMAP_MIN_MONTHS,
  HEATMAP_MAX_MONTHS,
  HEATMAP_STEP,
} from "@/lib/bookings/heatmap";

// Monday-first week order, matching local norms in Kenya / Ghana.
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;

// JS getUTCDay() is Sun=0..Sat=6. Convert to Mon=0..Sun=6.
function mondayIndex(date: Date): number {
  return (date.getUTCDay() + 6) % 7;
}

// Day cells use `aspect-square w-full` so they grow with the
// column and stay square. We cap the inner grid at ~16rem and
// centre it in the card; without the cap the squares balloon to
// ~40px on a wide card and the heatmap takes up half the screen.
// 16rem yields ~22px squares which read like a real heatmap.
const CELL = "aspect-square w-full";
const GRID_COLS = "grid-cols-[1.5rem_repeat(7,minmax(0,1fr))]"; // [week#] [Mo..Su × 7]
const GRID_MAX_WIDTH = "max-w-[16rem]";

function MonthGrid({
  month,
  dayIndex,
  todayKey,
}: {
  month: Date;
  dayIndex: Map<string, Occupant>;
  todayKey: string;
}) {
  const days = daysInMonthUTC(month);
  const firstDate = new Date(
    Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), 1),
  );
  const leadingBlanks = mondayIndex(firstDate);

  const prevMonth = addMonthsUTC(month, -1);
  const prevDays = daysInMonthUTC(prevMonth);
  const monthShort = fmtMonth(month).split(" ")[0];

  // Build the grid as a single flat array, row-major: header row,
  // then one row per week. Each week row is [label] + 7 cells, and
  // the label is the Monday's day-of-month (rendered subtly even
  // when that Monday spilled in from the previous month).
  const elements: React.ReactNode[] = [];

  elements.push(<span key="hdr-blank" aria-hidden />);
  for (const d of WEEKDAYS) {
    elements.push(
      <span key={`hdr-${d}`} className="text-center">
        {d}
      </span>,
    );
  }

  for (let weekStart = 1 - leadingBlanks; weekStart <= days; weekStart += 7) {
    const weekLabel =
      weekStart >= 1 ? String(weekStart) : String(prevDays + weekStart);
    const isLeadingWeek = weekStart < 1;

    elements.push(
      <span
        key={`wk-${weekStart}`}
        className={`pr-1 text-right normal-case tabular-nums ${
          isLeadingWeek ? "text-stone-300" : "text-stone-400"
        }`}
      >
        {weekLabel}
      </span>,
    );

    for (let i = 0; i < 7; i++) {
      const day = weekStart + i;
      if (day < 1 || day > days) {
        elements.push(
          <span key={`blank-${weekStart}-${i}`} className={`block ${CELL}`} />,
        );
        continue;
      }
      const date = new Date(
        Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), day),
      );
      const isToday = dayKeyUTC(date) === todayKey;
      const occupant = dayIndex.get(dayKeyUTC(date));
      const colour = !occupant
        ? "bg-stone-100"
        : occupant.kind === "lease"
          ? LEASE_COLOR
          : (SOURCE_COLOR[occupant.source] ?? "bg-stone-400");
      const tooltip = !occupant
        ? `${day} ${monthShort} · vacant`
        : occupant.kind === "lease"
          ? `${day} ${monthShort} · ${occupant.label} (tenancy)`
          : `${day} ${monthShort} · ${occupant.label} (${occupant.source})`;
      elements.push(
        <span
          key={`d-${day}`}
          title={isToday ? `${tooltip} · today` : tooltip}
          className={`block rounded-[4px] ${CELL} ${colour}${
            // Now that the board runs into next month, "where am I"
            // is a real question. A ring rather than a colour so it
            // reads on an occupied square and a vacant one alike.
            isToday ? " ring-2 ring-stone-900 ring-offset-1" : ""
          }`}
        />,
      );
    }
  }

  return (
    <div className="rounded-md border border-stone-200 bg-white p-3">
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-stone-500">
        {fmtMonth(month)}
      </p>
      <div
        className={`mx-auto grid ${GRID_COLS} ${GRID_MAX_WIDTH} items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-stone-400`}
      >
        {elements}
      </div>
    </div>
  );
}

function Legend({ showTenancy }: { showTenancy: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
      <span className="font-medium uppercase tracking-wider text-stone-500">
        Sources
      </span>
      {showTenancy ? (
        <span className="inline-flex items-center gap-1.5">
          <span className={`h-3 w-3 rounded-sm ${LEASE_COLOR}`} />
          Tenancy
        </span>
      ) : null}
      {LEGEND_SOURCES.map(({ src, label }) => (
        <span key={src} className="inline-flex items-center gap-1.5">
          <span className={`h-3 w-3 rounded-sm ${SOURCE_COLOR[src]}`} />
          {label}
        </span>
      ))}
      <span className="inline-flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-sm bg-stone-100" />
        Vacant
      </span>
    </div>
  );
}
