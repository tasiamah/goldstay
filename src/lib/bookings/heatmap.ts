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
  return Math.min(
    HEATMAP_MAX_MONTHS,
    Math.max(HEATMAP_MIN_MONTHS, rounded),
  );
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
