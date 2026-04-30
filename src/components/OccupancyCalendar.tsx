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

type BookingForCalendar = {
  source: string;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  status: string;
};

// Colour per channel. Vrbo / Booking.com are kept in the map so
// historical bookings still render if they exist, but they don't
// appear in the legend until we re-enable them in
// src/lib/booking-sources.ts.
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

function dayKey(d: Date): string {
  return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
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
  monthsBack = 3,
  now = new Date(),
  loadMoreHref,
}: {
  bookings: BookingForCalendar[];
  monthsBack?: number;
  now?: Date;
  // When set, renders a "Show 3 more months" link below the grid.
  // The page decides whether to show it based on whether older
  // bookings actually exist and the window hasn't hit its cap.
  loadMoreHref?: string | null;
}) {
  // Map of "YYYY-M-D" -> first matching booking, used to colour the
  // square and source the tooltip.
  const dayIndex = new Map<string, BookingForCalendar>();
  for (const b of bookings) {
    if (b.status === "CANCELLED") continue;
    const cur = new Date(
      Date.UTC(
        b.checkIn.getUTCFullYear(),
        b.checkIn.getUTCMonth(),
        b.checkIn.getUTCDate(),
      ),
    );
    while (cur < b.checkOut) {
      dayIndex.set(dayKey(cur), b);
      cur.setUTCDate(cur.getUTCDate() + 1);
    }
  }

  const thisMonth = startOfMonthUTC(now);
  const months: Date[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    months.push(addMonthsUTC(thisMonth, -i));
  }

  return (
    <div className="space-y-4">
      <Legend />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {months.map((m) => (
          <MonthGrid
            key={m.toISOString()}
            month={m}
            dayIndex={dayIndex}
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
const GRID_COLS =
  "grid-cols-[1.5rem_repeat(7,minmax(0,1fr))]"; // [week#] [Mo..Su × 7]
const GRID_MAX_WIDTH = "max-w-[16rem]";

function MonthGrid({
  month,
  dayIndex,
}: {
  month: Date;
  dayIndex: Map<string, BookingForCalendar>;
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

  for (
    let weekStart = 1 - leadingBlanks;
    weekStart <= days;
    weekStart += 7
  ) {
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
      const booking = dayIndex.get(dayKey(date));
      const colour = booking
        ? (SOURCE_COLOR[booking.source] ?? "bg-stone-400")
        : "bg-stone-100";
      const tooltip = booking
        ? `${day} ${monthShort} · ${booking.guestName} (${booking.source})`
        : `${day} ${monthShort} · vacant`;
      elements.push(
        <span
          key={`d-${day}`}
          title={tooltip}
          className={`block rounded-[4px] ${CELL} ${colour}`}
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

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
      <span className="font-medium uppercase tracking-wider text-stone-500">
        Sources
      </span>
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
