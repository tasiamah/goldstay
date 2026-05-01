import { describe, expect, it } from "vitest";
import {
  parseOwnerListFilters,
  parsePropertyListFilters,
  periodRange,
  toQueryString,
} from "./list-search";

// Filter parsers for the admin list pages. The senior risks are:
//   - accepting an arbitrary `country` / `status` / `type` /
//     `vacancy` / `period` value and forwarding it into a Prisma
//     `where` (would 500 the page or, worse, leak rows from another
//     bucket), and
//   - toQueryString building a malformed URL that breaks pagination
//     and KPI drill-in deep-links.
// Defaults / array-handling / trim are exercised in the same tests.

describe("parseOwnerListFilters + parsePropertyListFilters", () => {
  it("only accepts known enum values and trims free-text", () => {
    expect(parseOwnerListFilters({ q: "  asha  " })).toEqual({
      q: "asha",
      country: null,
      period: null,
    });
    expect(parseOwnerListFilters({ country: "ZA" }).country).toBeNull();
    expect(parseOwnerListFilters({ country: "KE" }).country).toBe("KE");
    expect(parseOwnerListFilters({ q: ["asha", "kim"] }).q).toBe("asha");
    expect(parseOwnerListFilters({ period: "yesterday" }).period).toBeNull();
    expect(parseOwnerListFilters({ period: "this-month" }).period).toBe(
      "this-month",
    );

    const props = parsePropertyListFilters({
      status: "DRAFT",
      type: "MONTHLY",
      vacancy: "everything",
    });
    expect(props.status).toBeNull();
    expect(props.type).toBeNull();
    expect(props.vacancy).toBeNull();
    expect(parsePropertyListFilters({ vacancy: "vacant" }).vacancy).toBe(
      "vacant",
    );
  });
});

describe("toQueryString", () => {
  it("strips empties and URL-encodes special chars", () => {
    expect(
      toQueryString({ q: "a b&c", country: "KE", status: "", type: null }),
    ).toBe("?q=a+b%26c&country=KE");
    expect(toQueryString({ q: "", country: null })).toBe("");
  });
});

describe("periodRange", () => {
  // Anchors the drill-in URLs from the admin overview KPI strip.
  // The boundary maths (month start = day 1 inclusive, end =
  // first-of-next inclusive-exclusive) is the kind of thing that
  // silently misclassifies a midnight signup if it regresses.
  it("resolves this-month and last-month against a stable anchor", () => {
    const anchor = new Date("2026-05-15T12:00:00Z");
    expect(periodRange("this-month", anchor)).toEqual({
      gte: new Date(2026, 4, 1),
      lt: new Date(2026, 5, 1),
    });
    expect(periodRange("last-month", anchor)).toEqual({
      gte: new Date(2026, 3, 1),
      lt: new Date(2026, 4, 1),
    });
  });

  it("returns null for the no-filter case", () => {
    expect(periodRange(null)).toBeNull();
  });
});
