// URL-driven table state.
//
// All admin list pages share the same query-string shape:
//   ?sort=createdAt:desc&page=2&pageSize=25&q=&country=KE
//
// These helpers are pure so the test suite can pin behaviour
// (parsers + URL builders) without spinning up Next.

export type SortDir = "asc" | "desc";

export type SortState = {
  column: string;
  direction: SortDir;
};

export type PaginationState = {
  page: number; // 1-indexed
  pageSize: number;
};

export type RawParams = Record<string, string | string[] | undefined>;

export const DEFAULT_PAGE_SIZE = 25;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const MAX_PAGE_SIZE = 200;

export function parseSort(
  raw: string | undefined,
  allowed: readonly string[],
  fallback: SortState,
): SortState {
  if (!raw) return fallback;
  const [col, dir] = raw.split(":");
  if (!col || !allowed.includes(col)) return fallback;
  const direction: SortDir = dir === "asc" ? "asc" : "desc";
  return { column: col, direction };
}

export function parsePagination(
  raw: RawParams,
  defaults: Partial<PaginationState> = {},
): PaginationState {
  const fallbackSize = defaults.pageSize ?? DEFAULT_PAGE_SIZE;
  const fallbackPage = defaults.page ?? 1;
  const page = clampInt(first(raw.page), fallbackPage, 1, 100_000);
  const pageSize = clampInt(first(raw.pageSize), fallbackSize, 1, MAX_PAGE_SIZE);
  return { page, pageSize };
}

export function buildHref(
  basePath: string,
  params: RawParams,
  overrides: RawParams,
): string {
  const merged = { ...params, ...overrides };
  const qs = serialize(merged);
  return qs ? `${basePath}?${qs}` : basePath;
}

// Toggle the sort for a column. Clicking the active column flips
// direction; clicking another column starts at desc (the most useful
// default for created/updated/amount lists).
export function nextSortFor(
  column: string,
  current: SortState,
): SortState {
  if (current.column === column) {
    return {
      column,
      direction: current.direction === "asc" ? "desc" : "asc",
    };
  }
  return { column, direction: "desc" };
}

export function sortToParam(state: SortState): string {
  return `${state.column}:${state.direction}`;
}

// ---------- Pagination math ----------

export function totalPages(totalRows: number, pageSize: number): number {
  if (totalRows <= 0) return 1;
  return Math.max(1, Math.ceil(totalRows / pageSize));
}

export function clampPage(page: number, total: number): number {
  if (page < 1) return 1;
  if (page > total) return total;
  return page;
}

// Returns at most `count` page numbers around the current page,
// always including the first and last. Used by the pagination UI.
export function pageWindow(
  current: number,
  total: number,
  count = 5,
): number[] {
  if (total <= count) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const half = Math.floor(count / 2);
  let start = Math.max(1, current - half);
  let end = Math.min(total, start + count - 1);
  if (end - start < count - 1) {
    start = Math.max(1, end - count + 1);
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

// ---------- Internal ----------

function first(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

function clampInt(
  raw: string | undefined,
  fallback: number,
  min: number,
  max: number,
): number {
  if (!raw) return fallback;
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(n, min), max);
}

function serialize(params: RawParams): string {
  const out = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    if (Array.isArray(v)) {
      for (const item of v) {
        if (item) out.append(k, item);
      }
    } else {
      out.set(k, String(v));
    }
  }
  return out.toString();
}
