import { describe, expect, it } from "vitest";
import {
  formatPeriod,
  parsePeriod,
  periodRange,
  periodSlug,
  periodsSince,
  recentPeriods,
} from "./period";

describe("parsePeriod", () => {
  it("parses URL fragments into a Period", () => {
    expect(parsePeriod("2026", "4")).toEqual({ year: 2026, month: 4 });
  });

  it("returns null for missing or out-of-range input", () => {
    expect(parsePeriod(undefined, "4")).toBeNull();
    expect(parsePeriod("2026", "13")).toBeNull();
    expect(parsePeriod("1999", "1")).toBeNull(); // outside supported range
  });
});

describe("periodRange", () => {
  it("returns inclusive start and exclusive end in UTC", () => {
    const { start, end } = periodRange({ year: 2026, month: 4 });
    expect(start.toISOString()).toBe("2026-04-01T00:00:00.000Z");
    expect(end.toISOString()).toBe("2026-05-01T00:00:00.000Z");
  });

  it("rolls into the next year on December", () => {
    const { end } = periodRange({ year: 2026, month: 12 });
    expect(end.toISOString()).toBe("2027-01-01T00:00:00.000Z");
  });
});

describe("formatPeriod + periodSlug", () => {
  it("formats human-readable label and zero-padded slug", () => {
    expect(formatPeriod({ year: 2026, month: 4 })).toBe("April 2026");
    expect(periodSlug({ year: 2026, month: 4 })).toBe("2026-04");
  });
});

describe("recentPeriods", () => {
  it("returns N periods ending in the given month, most recent first", () => {
    const out = recentPeriods(new Date("2026-04-15T00:00:00Z"), 3);
    expect(out).toEqual([
      { year: 2026, month: 4 },
      { year: 2026, month: 3 },
      { year: 2026, month: 2 },
    ]);
  });

  it("rolls back across the year boundary", () => {
    const out = recentPeriods(new Date("2026-02-15T00:00:00Z"), 4);
    expect(out).toEqual([
      { year: 2026, month: 2 },
      { year: 2026, month: 1 },
      { year: 2025, month: 12 },
      { year: 2025, month: 11 },
    ]);
  });
});

describe("periodsSince", () => {
  const now = new Date("2026-04-15T00:00:00Z");

  it("returns just the current month for an owner who joined this month", () => {
    const out = periodsSince(new Date("2026-04-02T00:00:00Z"), now);
    expect(out).toEqual([{ year: 2026, month: 4 }]);
  });

  it("includes every month from earliest to now, most recent first", () => {
    const out = periodsSince(new Date("2026-01-20T00:00:00Z"), now);
    expect(out).toEqual([
      { year: 2026, month: 4 },
      { year: 2026, month: 3 },
      { year: 2026, month: 2 },
      { year: 2026, month: 1 },
    ]);
  });

  it("caps at maxCount even if earliest is years back", () => {
    const out = periodsSince(new Date("2020-01-01T00:00:00Z"), now, 6);
    expect(out).toHaveLength(6);
    expect(out[0]).toEqual({ year: 2026, month: 4 });
    expect(out[5]).toEqual({ year: 2025, month: 11 });
  });
});
