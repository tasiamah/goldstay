import { describe, expect, it } from "vitest";
import {
  formatPeriod,
  isValidPeriod,
  parsePeriod,
  periodRange,
  periodSlug,
  recentPeriods,
} from "./period";

describe("isValidPeriod", () => {
  it("accepts a normal month", () => {
    expect(isValidPeriod({ year: 2026, month: 4 })).toBe(true);
  });
  it("rejects month 0 and 13", () => {
    expect(isValidPeriod({ year: 2026, month: 0 })).toBe(false);
    expect(isValidPeriod({ year: 2026, month: 13 })).toBe(false);
  });
  it("rejects non-integer values", () => {
    expect(isValidPeriod({ year: 2026.5, month: 4 })).toBe(false);
    expect(isValidPeriod({ year: 2026, month: 4.5 })).toBe(false);
  });
  it("rejects years outside the supported range", () => {
    expect(isValidPeriod({ year: 1999, month: 1 })).toBe(false);
    expect(isValidPeriod({ year: 2200, month: 1 })).toBe(false);
  });
});

describe("parsePeriod", () => {
  it("parses URL-style strings", () => {
    expect(parsePeriod("2026", "4")).toEqual({ year: 2026, month: 4 });
  });
  it("returns null for missing parts", () => {
    expect(parsePeriod(undefined, "4")).toBeNull();
    expect(parsePeriod("2026", undefined)).toBeNull();
  });
  it("returns null for non-numeric input", () => {
    expect(parsePeriod("twenty", "4")).toBeNull();
  });
  it("returns null for an out-of-range month", () => {
    expect(parsePeriod("2026", "13")).toBeNull();
  });
});

describe("periodRange", () => {
  it("returns inclusive start and exclusive end in UTC", () => {
    const { start, end } = periodRange({ year: 2026, month: 4 });
    expect(start.toISOString()).toBe("2026-04-01T00:00:00.000Z");
    expect(end.toISOString()).toBe("2026-05-01T00:00:00.000Z");
  });
  it("rolls over correctly at year boundary", () => {
    const { start, end } = periodRange({ year: 2026, month: 12 });
    expect(start.toISOString()).toBe("2026-12-01T00:00:00.000Z");
    expect(end.toISOString()).toBe("2027-01-01T00:00:00.000Z");
  });
  it("throws on an invalid period", () => {
    expect(() => periodRange({ year: 2026, month: 13 })).toThrow();
  });
});

describe("formatPeriod", () => {
  it("returns the human label", () => {
    expect(formatPeriod({ year: 2026, month: 4 })).toBe("April 2026");
  });
});

describe("periodSlug", () => {
  it("zero-pads the month", () => {
    expect(periodSlug({ year: 2026, month: 4 })).toBe("2026-04");
    expect(periodSlug({ year: 2026, month: 11 })).toBe("2026-11");
  });
});

describe("recentPeriods", () => {
  it("returns the requested number of periods, most recent first", () => {
    const out = recentPeriods(new Date("2026-04-15T00:00:00Z"), 3);
    expect(out).toEqual([
      { year: 2026, month: 4 },
      { year: 2026, month: 3 },
      { year: 2026, month: 2 },
    ]);
  });
  it("rolls back across year boundaries", () => {
    const out = recentPeriods(new Date("2026-02-15T00:00:00Z"), 4);
    expect(out).toEqual([
      { year: 2026, month: 2 },
      { year: 2026, month: 1 },
      { year: 2025, month: 12 },
      { year: 2025, month: 11 },
    ]);
  });
});
