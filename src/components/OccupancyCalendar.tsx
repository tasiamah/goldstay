// Server-rendered, dependency-free monthly occupancy heatmap.
// Renders the last N months (default 6) with one square per night,
// shaded by booking source. We compute everything in UTC midnights
// to avoid timezone foot-guns; that's the same anchor the rest of
// the booking aggregation uses.
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
  monthsBack = 6,
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

function MonthGrid({
  month,
  dayIndex,
}: {
  month: Date;
  dayIndex: Map<string, BookingForCalendar>;
}) {
  const days = daysInMonthUTC(month);
  const cells: React.ReactNode[] = [];
  for (let day = 1; day <= days; day++) {
    const date = new Date(
      Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), day),
    );
    const booking = dayIndex.get(dayKey(date));
    const colour = booking
      ? (SOURCE_COLOR[booking.source] ?? "bg-stone-400")
      : "bg-stone-100";
    const tooltip = booking
      ? `${day} ${fmtMonth(month).split(" ")[0]} · ${booking.guestName} (${booking.source})`
      : `${day} ${fmtMonth(month).split(" ")[0]} · vacant`;
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
      <div className="grid grid-cols-7 gap-1">{cells}</div>
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
