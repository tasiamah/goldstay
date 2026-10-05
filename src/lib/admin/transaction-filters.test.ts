import { describe, expect, it } from "vitest";
import {
  filtersToParams,
  monthParam,
  occurredOnRange,
  parseMonthParam,
  parseTransactionFilters,
  summariseByCurrency,
} from "./transaction-filters";

describe("parseMonthParam", () => {
  it("accepts YYYY-MM with or without a leading zero", () => {
    expect(parseMonthParam("2026-09")).toEqual({ year: 2026, month: 9 });
    expect(parseMonthParam("2026-9")).toEqual({ year: 2026, month: 9 });
    expect(parseMonthParam(" 2026-12 ")).toEqual({ year: 2026, month: 12 });
  });

  it("rejects anything that is not a real month rather than guessing", () => {
    expect(parseMonthParam(undefined)).toBeNull();
    expect(parseMonthParam("")).toBeNull();
    expect(parseMonthParam("2026-13")).toBeNull();
    expect(parseMonthParam("2026-00")).toBeNull();
    expect(parseMonthParam("September")).toBeNull();
    expect(parseMonthParam("2026")).toBeNull();
    expect(parseMonthParam("26-09")).toBeNull();
  });
});

describe("parseTransactionFilters", () => {
  it("reads both filters and treats blanks as absent", () => {
    expect(
      parseTransactionFilters({ propertyId: "prop-1", month: "2026-09" }),
    ).toEqual({ propertyId: "prop-1", period: { year: 2026, month: 9 } });

    expect(parseTransactionFilters({ propertyId: "   ", month: "" })).toEqual({
      propertyId: null,
      period: null,
    });
    expect(parseTransactionFilters({})).toEqual({
      propertyId: null,
      period: null,
    });
  });
});

describe("filtersToParams", () => {
  // A sort click that drops the filter would relabel the totals
  // without changing the heading, so this round-trip is load-bearing.
  it("round-trips through parse unchanged", () => {
    const filters = parseTransactionFilters({
      propertyId: "prop-1",
      month: "2026-9",
    });
    const params = filtersToParams(filters);
    expect(params).toEqual({ propertyId: "prop-1", month: "2026-09" });
    expect(parseTransactionFilters(params)).toEqual(filters);
  });

  it("omits keys that are not set, rather than emitting empty values", () => {
    expect(filtersToParams({ propertyId: null, period: null })).toEqual({});
    expect(
      filtersToParams({ propertyId: "prop-1", period: null }),
    ).toEqual({ propertyId: "prop-1" });
  });
});

describe("monthParam", () => {
  it("zero-pads so the select option matches the parsed value", () => {
    expect(monthParam({ year: 2026, month: 9 })).toBe("2026-09");
    expect(monthParam({ year: 2026, month: 12 })).toBe("2026-12");
  });
});

describe("occurredOnRange", () => {
  it("is half-open, so the 1st of the next month is excluded", () => {
    expect(occurredOnRange({ year: 2026, month: 9 })).toEqual({
      gte: new Date("2026-09-01T00:00:00.000Z"),
      lt: new Date("2026-10-01T00:00:00.000Z"),
    });
  });

  it("rolls over the year on December", () => {
    expect(occurredOnRange({ year: 2026, month: 12 })).toEqual({
      gte: new Date("2026-12-01T00:00:00.000Z"),
      lt: new Date("2027-01-01T00:00:00.000Z"),
    });
  });

  it("returns null when no month is selected", () => {
    expect(occurredOnRange(null)).toBeNull();
  });
});

describe("summariseByCurrency", () => {
  it("nets inflows against outflows", () => {
    expect(
      summariseByCurrency([
        { direction: "INFLOW", amount: 40_000, currency: "KES" },
        { direction: "OUTFLOW", amount: 5_000, currency: "KES" },
        { direction: "OUTFLOW", amount: 1_200, currency: "KES" },
      ]),
    ).toEqual([
      { currency: "KES", inflow: 40_000, outflow: 6_200, net: 33_800 },
    ]);
  });

  it("keeps currencies apart instead of producing one wrong figure", () => {
    expect(
      summariseByCurrency([
        { direction: "OUTFLOW", amount: 650, currency: "KES" },
        { direction: "OUTFLOW", amount: 5, currency: "USD" },
      ]),
    ).toEqual([
      { currency: "KES", inflow: 0, outflow: 650, net: -650 },
      { currency: "USD", inflow: 0, outflow: 5, net: -5 },
    ]);
  });

  it("accepts Decimal-as-string amounts, which is what Prisma returns", () => {
    expect(
      summariseByCurrency([
        { direction: "OUTFLOW", amount: "1500.50", currency: "KES" },
      ]),
    ).toEqual([
      { currency: "KES", inflow: 0, outflow: 1_500.5, net: -1_500.5 },
    ]);
  });

  it("drops rows with no currency or an unparseable amount rather than corrupting a bucket", () => {
    expect(
      summariseByCurrency([
        { direction: "INFLOW", amount: 100, currency: "" },
        { direction: "INFLOW", amount: "not a number", currency: "KES" },
        { direction: "INFLOW", amount: 100, currency: "KES" },
      ]),
    ).toEqual([{ currency: "KES", inflow: 100, outflow: 0, net: 100 }]);
  });

  it("returns nothing for an empty month", () => {
    expect(summariseByCurrency([])).toEqual([]);
  });
});
