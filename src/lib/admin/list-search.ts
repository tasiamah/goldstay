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

export type OwnerListFilters = {
  q: string;
  country: "KE" | "GH" | null;
};

export function parseOwnerListFilters(
  searchParams?: RawSearchParams,
): OwnerListFilters {
  const country = readString(searchParams, "country");
  return {
    q: readString(searchParams, "q"),
    country: country === "KE" || country === "GH" ? country : null,
  };
}

export type PropertyListFilters = {
  q: string;
  country: "KE" | "GH" | null;
  status: "ONBOARDING" | "ACTIVE" | "EXITED" | null;
  type: "LONG_TERM" | "SHORT_TERM" | null;
};

export function parsePropertyListFilters(
  searchParams?: RawSearchParams,
): PropertyListFilters {
  const country = readString(searchParams, "country");
  const status = readString(searchParams, "status");
  const type = readString(searchParams, "type");
  return {
    q: readString(searchParams, "q"),
    country: country === "KE" || country === "GH" ? country : null,
    status:
      status === "ONBOARDING" || status === "ACTIVE" || status === "EXITED"
        ? status
        : null,
    type:
      type === "LONG_TERM" || type === "SHORT_TERM" ? type : null,
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
