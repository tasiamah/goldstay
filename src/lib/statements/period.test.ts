import { describe, expect, it } from "vitest";
import {
  periodRange,
  periodsSince,
  previousPeriod,
} from "./period";

// Statement-period maths. Every monthly owner statement, every "last
// month" comparison and every URL slug runs through here, so the
// only interesting failure modes are:
//   - month / year rollover at boundaries (Jan, Dec)
//   - UTC vs local-clock drift (servers run in many tz)
//   - earliest-month → now traversal for the period dropdown
// Label formatting and parse-from-URL guards are exercised by the
// pages that consume them and aren't worth standalone tests.

describe("previousPeriod", () => {
  it("rolls back across year and tz boundaries in UTC", () => {
    expect(previousPeriod(new Date("2026-05-15T00:00:00Z"))).toEqual({
      year: 2026,
      month: 4,
    });
    // Jan in UTC → previous = Dec of prior year, even when the local
    // clock is already in Feb.
    expect(previousPeriod(new Date("2026-01-31T23:00:00Z"))).toEqual({
      year: 2025,
      month: 12,
    });
  });
});

describe("periodRange", () => {
  it("returns inclusive UTC start + exclusive end across December", () => {
    const apr = periodRange({ year: 2026, month: 4 });
    expect(apr.start.toISOString()).toBe("2026-04-01T00:00:00.000Z");
    expect(apr.end.toISOString()).toBe("2026-05-01T00:00:00.000Z");
    expect(periodRange({ year: 2026, month: 12 }).end.toISOString()).toBe(
      "2027-01-01T00:00:00.000Z",
    );
  });
});

describe("periodsSince", () => {
  it("walks earliest → now most-recent first and caps at maxCount", () => {
    const now = new Date("2026-04-15T00:00:00Z");
    expect(periodsSince(new Date("2026-01-20T00:00:00Z"), now)).toEqual([
      { year: 2026, month: 4 },
      { year: 2026, month: 3 },
      { year: 2026, month: 2 },
      { year: 2026, month: 1 },
    ]);
    const capped = periodsSince(new Date("2020-01-01T00:00:00Z"), now, 6);
    expect(capped).toHaveLength(6);
    expect(capped[0]).toEqual({ year: 2026, month: 4 });
  });
});
