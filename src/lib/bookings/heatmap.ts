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

// First UTC day of (now − (monthsBack − 1) months). The window is
// inclusive of the current month, so monthsBack=1 returns the start
// of the current month.
export function heatmapWindowStart(now: Date, monthsBack: number): Date {
  const thisMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  );
  return new Date(
    Date.UTC(
      thisMonth.getUTCFullYear(),
      thisMonth.getUTCMonth() - (monthsBack - 1),
      1,
    ),
  );
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
