// Pure helpers for the property occupancy heatmap. Live here, not
// in the React component file, so they can be imported by Server
// Components and unit-tested without dragging Vite/JSX into Vitest.
//
// All dates are anchored at UTC midnight so the heatmap window
// matches what we filter on the database side (Booking.checkOut is
// stored in UTC).

export const HEATMAP_MIN_MONTHS = 3;
export const HEATMAP_MAX_MONTHS = 12;
export const HEATMAP_STEP = 3;

// Snap an arbitrary query-string value to the nearest valid window
// size, then clamp into [min, max]. Defaults to the minimum window
// for empty / non-numeric input so the URL stays well-formed even
// if a user hand-edits it.
export function clampHeatmapMonths(raw: unknown): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return HEATMAP_MIN_MONTHS;
  const rounded = Math.round(n / HEATMAP_STEP) * HEATMAP_STEP;
  return Math.min(HEATMAP_MAX_MONTHS, Math.max(HEATMAP_MIN_MONTHS, rounded));
}

// The board always ends one month ahead. A landlord looking at
// occupancy mostly wants to know who is coming, and a board that
// stopped at today could only ever show what they had already been
// paid for. So the three default blocks are last month, this month
// and next.
export const HEATMAP_MONTHS_AHEAD = 1;

// First UTC day of the window. `months` counts every block drawn,
// one of which is next month, so months=3 starts one month back.
export function heatmapWindowStart(now: Date, months: number): Date {
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth() - (months - 1 - HEATMAP_MONTHS_AHEAD),
      1,
    ),
  );
}

// Last UTC day of the window — the end of next month. Day 0 of the
// month after gives the last day of the one before it.
export function heatmapWindowEnd(now: Date): Date {
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth() + HEATMAP_MONTHS_AHEAD + 1,
      0,
    ),
  );
}

// Names the span the board covers, e.g. "Sep – Nov 2026". The old
// headings said "Last 3 months", which stopped being true the moment
// the board started drawing next month.
export function heatmapWindowLabel(now: Date, months: number): string {
  const start = heatmapWindowStart(now, months);
  const end = heatmapWindowEnd(now);
  const mon = (d: Date) =>
    d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });
  const year = (d: Date) => d.getUTCFullYear();
  return year(start) === year(end)
    ? `${mon(start)} – ${mon(end)} ${year(end)}`
    : `${mon(start)} ${year(start)} – ${mon(end)} ${year(end)}`;
}

// ---------- What is in the property on a given night ----------

// The board answers one question — who is in the property — and that
// has two answers depending on how the flat is let. A short let is
// occupied by a guest for the nights of a booking; a long let is
// occupied by a tenant for the term of a lease. Reading bookings
// alone reported every tenanted flat as empty for its whole term.

export type OccupantBooking = {
  source: string;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  status: string;
};

export type OccupantLease = {
  tenantName: string;
  startDate: Date;
  endDate: Date | null;
  status: string;
};

export type Occupant =
  | { kind: "booking"; label: string; source: string }
  | { kind: "lease"; label: string };

export function dayKeyUTC(d: Date): string {
  return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
}

function utcMidnight(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
}

// Maps "YYYY-M-D" to whoever was in the flat that night.
//
// Leases are laid down first and bookings painted over them, so a
// flat mid-switch from long to short reads as the stay that actually
// happened rather than the tenancy it was still nominally under.
export function buildOccupancyIndex(input: {
  bookings?: OccupantBooking[];
  leases?: OccupantLease[];
  // Open-ended leases have no end date, so they are filled only as
  // far as the board is drawn. Without a bound this never returns.
  windowEnd: Date;
}): Map<string, Occupant> {
  const index = new Map<string, Occupant>();

  for (const l of input.leases ?? []) {
    // PENDING is a tenancy that has been agreed but not started; no
    // one is in the flat yet. ENDED and TERMINATED still cover the
    // nights they ran for, which is the whole point of a board that
    // shows history.
    if (l.status === "PENDING") continue;

    // A tenancy's end date is the last day of the tenancy, so it is
    // inclusive — unlike a checkout date, where the guest is gone by
    // that morning.
    const last = l.endDate
      ? utcMidnight(l.endDate)
      : utcMidnight(input.windowEnd);
    const cur = utcMidnight(l.startDate);
    while (cur <= last) {
      index.set(dayKeyUTC(cur), { kind: "lease", label: l.tenantName });
      cur.setUTCDate(cur.getUTCDate() + 1);
    }
  }

  for (const b of input.bookings ?? []) {
    if (b.status === "CANCELLED") continue;
    const cur = utcMidnight(b.checkIn);
    while (cur < b.checkOut) {
      index.set(dayKeyUTC(cur), {
        kind: "booking",
        label: b.guestName,
        source: b.source,
      });
      cur.setUTCDate(cur.getUTCDate() + 1);
    }
  }

  return index;
}
