// Server-rendered, dependency-free monthly occupancy heatmap.
// Renders the last N months (default 3) with one square per night,
// shaded by booking source. Columns are day-of-week (Mon → Sun) so
// the operator can read patterns at a glance — weekend-heavy vs
// midweek vacancy etc. Computes everything in UTC midnights to
// avoid timezone foot-guns; same anchor the booking aggregation
// uses.
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

const SOURCE_COLOR: Record<string, string> = {
  AIRBNB: "bg-rose-400",
  BOOKING_COM: "bg-sky-500",
  VRBO: "bg-amber-400",
  DIRECT: "bg-emerald-500",
};

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
}: {
  bookings: BookingForCalendar[];
  monthsBack?: number;
  now?: Date;
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
    </div>
  );
}

// Monday-first week order, matching local norms in Kenya / Ghana.
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;

// JS getUTCDay() is Sun=0..Sat=6. Convert to Mon=0..Sun=6.
function mondayIndex(date: Date): number {
  return (date.getUTCDay() + 6) % 7;
}

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

  const cells: React.ReactNode[] = [];

  // Pad so day 1 lands under its actual weekday column.
  for (let i = 0; i < leadingBlanks; i++) {
    cells.push(<span key={`pad-${i}`} className="block h-4 w-4" />);
  }

  for (let day = 1; day <= days; day++) {
    const date = new Date(
      Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), day),
    );
    const booking = dayIndex.get(dayKey(date));
    const colour = booking
      ? (SOURCE_COLOR[booking.source] ?? "bg-stone-400")
      : "bg-stone-100";
    const monthShort = fmtMonth(month).split(" ")[0];
    const tooltip = booking
      ? `${day} ${monthShort} · ${booking.guestName} (${booking.source})`
      : `${day} ${monthShort} · vacant`;
    cells.push(
      <span
        key={day}
        title={tooltip}
        className={`block h-4 w-4 rounded-sm ${colour}`}
      />,
    );
  }

  return (
    <div className="rounded-md border border-stone-200 bg-white p-3">
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-stone-500">
        {fmtMonth(month)}
      </p>
      <div className="grid grid-cols-7 gap-1 text-[10px] font-medium uppercase tracking-wider text-stone-400">
        {WEEKDAYS.map((d) => (
          <span key={d} className="block h-3 text-center">
            {d}
          </span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">{cells}</div>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
      <span className="font-medium uppercase tracking-wider text-stone-500">
        Sources
      </span>
      {(
        [
          { src: "AIRBNB", label: "Airbnb" },
          { src: "BOOKING_COM", label: "Booking.com" },
          { src: "VRBO", label: "Vrbo" },
          { src: "DIRECT", label: "Direct" },
        ] as const
      ).map(({ src, label }) => (
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
