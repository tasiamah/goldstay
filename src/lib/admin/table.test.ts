import { describe, expect, it } from "vitest";
import {
  buildHref,
  pageWindow,
  parsePagination,
  parseSort,
  totalPages,
} from "./table";

// Admin table helpers. Risks worth a test:
//   - parseSort accepting a column outside the allow-list → SQL-shape
//     bug if the value lands in a Prisma orderBy.
//   - parsePagination accepting an unbounded pageSize → OOM the DB.
//   - buildHref serialising the URL the pagination/sort UI navigates
//     to — must merge incoming params, drop empties, and URL-encode.
// The trivial helpers (sortToParam, nextSortFor, clampPage) are
// exercised end-to-end through these and aren't worth standalone tests.

describe("admin table helpers", () => {
  it("parseSort enforces the allow-list and falls back on missing input", () => {
    const allowed = ["createdAt", "fullName"];
    const fallback = { column: "createdAt", direction: "desc" as const };
    expect(parseSort("password:asc", allowed, fallback)).toEqual(fallback);
    expect(parseSort(undefined, allowed, fallback)).toEqual(fallback);
    expect(parseSort("fullName:asc", allowed, fallback)).toEqual({
      column: "fullName",
      direction: "asc",
    });
  });

  it("parsePagination clamps page and pageSize to defendable bounds", () => {
    expect(parsePagination({})).toEqual({ page: 1, pageSize: 25 });
    expect(parsePagination({ page: "-3" }).page).toBe(1);
    expect(parsePagination({ pageSize: "9999" }).pageSize).toBe(200);
  });

  it("buildHref merges params, drops empties, and URL-encodes", () => {
    expect(
      buildHref(
        "/admin/owners",
        { q: "asha", country: "KE", page: undefined },
        { sort: "fullName:asc", page: "2" },
      ),
    ).toBe("/admin/owners?q=asha&country=KE&page=2&sort=fullName%3Aasc");
  });

  it("totalPages ceilings the count and pageWindow shifts at both edges", () => {
    expect(totalPages(51, 25)).toBe(3);
    expect(pageWindow(5, 10, 5)).toEqual([3, 4, 5, 6, 7]);
    expect(pageWindow(1, 10, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(pageWindow(10, 10, 5)).toEqual([6, 7, 8, 9, 10]);
  });
});
