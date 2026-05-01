import { describe, expect, it } from "vitest";
import {
  buildHref,
  clampPage,
  nextSortFor,
  pageWindow,
  parsePagination,
  parseSort,
  sortToParam,
  totalPages,
} from "./table";

describe("parseSort", () => {
  const allowed = ["createdAt", "fullName"];
  const fallback = { column: "createdAt", direction: "desc" as const };

  it("returns the fallback when raw is undefined", () => {
    expect(parseSort(undefined, allowed, fallback)).toEqual(fallback);
  });

  it("rejects columns not in the allowed list", () => {
    expect(parseSort("password:asc", allowed, fallback)).toEqual(fallback);
  });

  it("normalises any non-asc direction to desc", () => {
    expect(parseSort("fullName:weird", allowed, fallback)).toEqual({
      column: "fullName",
      direction: "desc",
    });
  });

  it("accepts a valid column + direction", () => {
    expect(parseSort("fullName:asc", allowed, fallback)).toEqual({
      column: "fullName",
      direction: "asc",
    });
  });
});

describe("nextSortFor", () => {
  it("flips direction when clicking the active column", () => {
    expect(
      nextSortFor("createdAt", { column: "createdAt", direction: "desc" }),
    ).toEqual({ column: "createdAt", direction: "asc" });
  });

  it("starts a different column at desc", () => {
    expect(
      nextSortFor("fullName", { column: "createdAt", direction: "asc" }),
    ).toEqual({ column: "fullName", direction: "desc" });
  });
});

describe("sortToParam", () => {
  it("serialises to column:direction", () => {
    expect(sortToParam({ column: "fullName", direction: "asc" })).toBe(
      "fullName:asc",
    );
  });
});

describe("parsePagination", () => {
  it("falls back when no params", () => {
    expect(parsePagination({})).toEqual({ page: 1, pageSize: 25 });
  });

  it("clamps page to >= 1", () => {
    expect(parsePagination({ page: "0" }).page).toBe(1);
    expect(parsePagination({ page: "-3" }).page).toBe(1);
  });

  it("clamps pageSize to the max", () => {
    expect(parsePagination({ pageSize: "9999" }).pageSize).toBe(200);
  });
});

describe("buildHref", () => {
  it("merges params and drops empty values", () => {
    expect(
      buildHref(
        "/admin/owners",
        { q: "asha", country: "KE", page: undefined },
        { sort: "fullName:asc", page: "2" },
      ),
    ).toBe("/admin/owners?q=asha&country=KE&page=2&sort=fullName%3Aasc");
  });

  it("returns the base path when nothing is set", () => {
    expect(buildHref("/admin/owners", {}, {})).toBe("/admin/owners");
  });
});

describe("totalPages / clampPage / pageWindow", () => {
  it("computes total pages with ceiling", () => {
    expect(totalPages(0, 25)).toBe(1);
    expect(totalPages(26, 25)).toBe(2);
    expect(totalPages(50, 25)).toBe(2);
    expect(totalPages(51, 25)).toBe(3);
  });

  it("clampPage stays inside bounds", () => {
    expect(clampPage(0, 5)).toBe(1);
    expect(clampPage(99, 5)).toBe(5);
    expect(clampPage(3, 5)).toBe(3);
  });

  it("pageWindow returns all pages when total <= count", () => {
    expect(pageWindow(2, 3, 5)).toEqual([1, 2, 3]);
  });

  it("pageWindow centres around current", () => {
    expect(pageWindow(5, 10, 5)).toEqual([3, 4, 5, 6, 7]);
  });

  it("pageWindow shifts at edges", () => {
    expect(pageWindow(1, 10, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(pageWindow(10, 10, 5)).toEqual([6, 7, 8, 9, 10]);
  });
});
