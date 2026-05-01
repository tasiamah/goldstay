import { describe, expect, it } from "vitest";
import {
  hasActiveFilters,
  parseOwnerListFilters,
  parsePropertyListFilters,
  toQueryString,
} from "./list-search";

describe("parseOwnerListFilters", () => {
  it("returns empty defaults when nothing is set", () => {
    expect(parseOwnerListFilters({})).toEqual({ q: "", country: null });
    expect(parseOwnerListFilters(undefined)).toEqual({ q: "", country: null });
  });

  it("trims the search query", () => {
    expect(parseOwnerListFilters({ q: "  asha  " })).toEqual({
      q: "asha",
      country: null,
    });
  });

  it("only accepts known country codes", () => {
    expect(parseOwnerListFilters({ country: "KE" }).country).toBe("KE");
    expect(parseOwnerListFilters({ country: "GH" }).country).toBe("GH");
    expect(parseOwnerListFilters({ country: "ZA" }).country).toBeNull();
  });

  it("uses the first value when an array is passed", () => {
    expect(parseOwnerListFilters({ q: ["asha", "kim"] }).q).toBe("asha");
  });
});

describe("parsePropertyListFilters", () => {
  it("only accepts known statuses and types", () => {
    expect(
      parsePropertyListFilters({ status: "ACTIVE", type: "SHORT_TERM" }),
    ).toMatchObject({
      status: "ACTIVE",
      type: "SHORT_TERM",
    });
    expect(parsePropertyListFilters({ status: "DRAFT" }).status).toBeNull();
    expect(parsePropertyListFilters({ type: "MONTHLY" }).type).toBeNull();
  });
});

describe("toQueryString", () => {
  it("strips empty / null / undefined", () => {
    expect(
      toQueryString({ q: "asha", country: "KE", status: "", type: null }),
    ).toBe("?q=asha&country=KE");
  });

  it("returns empty string when nothing remains", () => {
    expect(toQueryString({ q: "", country: null })).toBe("");
  });

  it("URL-encodes special chars", () => {
    expect(toQueryString({ q: "a b&c" })).toBe("?q=a+b%26c");
  });
});

describe("hasActiveFilters", () => {
  it("treats empty strings and nulls as inactive", () => {
    expect(hasActiveFilters({ q: "", country: null })).toBe(false);
  });

  it("flags any non-empty filter", () => {
    expect(hasActiveFilters({ q: "asha" })).toBe(true);
  });
});
