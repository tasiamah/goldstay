// Pure helpers for the admin list-page search/filter URL schema.
//
// We use plain query params (?q=, ?country=, ?status=, ?type=) so
// the lists are deep-linkable, browser back/forward works, and ops
// can paste filtered URLs into Slack. Each helper returns the data
// the page needs without leaking Prisma into the URL layer.

export type RawSearchParams = Record<string, string | string[] | undefined>;

function readString(
  searchParams: RawSearchParams | undefined,
  key: string,
): string {
  const v = searchParams?.[key];
  if (Array.isArray(v)) return v[0] ?? "";
  return (v ?? "").toString().trim();
}

// Period filter shared by /admin/owners and /admin/leads. Used by the
// admin overview KPI strip to deep-link straight to "the rows that
// fed this number this month". Kept as a single closed enum so the
// page parsers stay one line and the URL stays human-readable
// (?period=this-month, not ?from=2026-05-01&to=2026-06-01).
export type PeriodFilter = "this-month" | "last-month" | null;

export function parsePeriod(searchParams?: RawSearchParams): PeriodFilter {
  const v = readString(searchParams, "period");
  return v === "this-month" || v === "last-month" ? v : null;
}

// Resolves a PeriodFilter into a half-open [start, end) date range
// against a stable anchor (defaults to now). Returns null when no
// period is selected so callers can omit the where clause entirely.
// Pure — no Prisma — so it's trivially testable.
export function periodRange(
  period: PeriodFilter,
  now: Date = new Date(),
): { gte: Date; lt: Date } | null {
  if (period === null) return null;
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  if (period === "this-month") return { gte: monthStart, lt: monthEnd };
  return { gte: lastMonthStart, lt: monthStart };
}

export const PERIOD_LABEL: Record<Exclude<PeriodFilter, null>, string> = {
  "this-month": "This month",
  "last-month": "Last month",
};

export type OwnerListFilters = {
  q: string;
  country: "KE" | "GH" | null;
  period: PeriodFilter;
};

export function parseOwnerListFilters(
  searchParams?: RawSearchParams,
): OwnerListFilters {
  const country = readString(searchParams, "country");
  return {
    q: readString(searchParams, "q"),
    country: country === "KE" || country === "GH" ? country : null,
    period: parsePeriod(searchParams),
  };
}

export type PropertyListFilters = {
  q: string;
  country: "KE" | "GH" | null;
  status: "ONBOARDING" | "ACTIVE" | "EXITED" | null;
  type: "LONG_TERM" | "SHORT_TERM" | null;
  // Whether the property has any vacant unit ("vacant"), is fully
  // let ("let"), or unfiltered (null). Powers the Vacant-units
  // KPI drill-in. Property-level filter that aggregates across the
  // unit graph; cheaper than building a per-unit list page.
  vacancy: "vacant" | "let" | null;
};

export function parsePropertyListFilters(
  searchParams?: RawSearchParams,
): PropertyListFilters {
  const country = readString(searchParams, "country");
  const status = readString(searchParams, "status");
  const type = readString(searchParams, "type");
  const vacancy = readString(searchParams, "vacancy");
  return {
    q: readString(searchParams, "q"),
    country: country === "KE" || country === "GH" ? country : null,
    status:
      status === "ONBOARDING" || status === "ACTIVE" || status === "EXITED"
        ? status
        : null,
    type:
      type === "LONG_TERM" || type === "SHORT_TERM" ? type : null,
    vacancy: vacancy === "vacant" || vacancy === "let" ? vacancy : null,
  };
}

// Returns a filters object as a URLSearchParams string with empty
// keys stripped, so we can build clean ?a=1&b=2 URLs without
// trailing &c= bits. Used by the filter chips and reset links.
export function toQueryString(
  filters: Record<string, string | null | undefined>,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value === null || value === undefined || value === "") continue;
    params.set(key, value);
  }
  const s = params.toString();
  return s.length > 0 ? `?${s}` : "";
}

export function hasActiveFilters(
  filters: Record<string, string | null | undefined>,
): boolean {
  return Object.values(filters).some(
    (v) => v !== null && v !== undefined && v !== "",
  );
}
