// Period helpers for monthly statements.
//
// Every helper is timezone-naive and works in UTC. The dashboard and
// the PDF both want the same answer to "which transactions belong in
// the April 2026 statement?" regardless of where the landlord opens
// the page from, so we anchor everything to UTC.

export type Period = {
  year: number;
  // 1..12, NOT the JavaScript 0..11 month index. We accept human input
  // in the URL (/owner/statements/2026/4) and storing 1-12 internally
  // avoids off-by-one bugs at every boundary.
  month: number;
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function isValidPeriod(input: { year: number; month: number }): boolean {
  const { year, month } = input;
  if (!Number.isInteger(year) || !Number.isInteger(month)) return false;
  if (year < 2020 || year > 2100) return false;
  if (month < 1 || month > 12) return false;
  return true;
}

export function parsePeriod(
  yearRaw: string | undefined,
  monthRaw: string | undefined,
): Period | null {
  if (!yearRaw || !monthRaw) return null;
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  if (!isValidPeriod({ year, month })) return null;
  return { year, month };
}

// Inclusive start, exclusive end. Used as the range filter on
// Transaction.occurredOn so the boundary day doesn't double-count
// across months.
export function periodRange(period: Period): { start: Date; end: Date } {
  if (!isValidPeriod(period)) {
    throw new Error(`invalid period: ${JSON.stringify(period)}`);
  }
  const start = new Date(Date.UTC(period.year, period.month - 1, 1));
  const end = new Date(Date.UTC(period.year, period.month, 1));
  return { start, end };
}

export function formatPeriod(period: Period): string {
  return `${MONTHS[period.month - 1]} ${period.year}`;
}

// Slug used in filenames. Avoids spaces / special chars so it survives
// email forwarding and Windows downloads.
export function periodSlug(period: Period): string {
  const mm = String(period.month).padStart(2, "0");
  return `${period.year}-${mm}`;
}

// Generates the previous N periods including the current one, ordered
// most recent first. Used by /owner/statements to list 12 months of
// statements as a clickable grid.
export function recentPeriods(now: Date, count: number): Period[] {
  const out: Period[] = [];
  let year = now.getUTCFullYear();
  let month = now.getUTCMonth() + 1;
  for (let i = 0; i < count; i++) {
    out.push({ year, month });
    month -= 1;
    if (month < 1) {
      month = 12;
      year -= 1;
    }
  }
  return out;
}
