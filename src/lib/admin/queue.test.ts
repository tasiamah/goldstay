import { describe, expect, it } from "vitest";
import { computeDelta, daysAgo, daysUntil, meanDaysBetween } from "./queue";

// daysAgo is the only pure helper in queue.ts beyond computeDelta.
// The rest of the file is Prisma I/O, exercised via integration
// tests against a real DB.

describe("daysAgo", () => {
  it("subtracts whole days from the anchor and returns the anchor for 0", () => {
    const anchor = new Date("2026-05-01T12:00:00.000Z");
    expect(daysAgo(3, anchor).toISOString()).toBe("2026-04-28T12:00:00.000Z");
    expect(daysAgo(0, anchor).getTime()).toBe(anchor.getTime());
  });
});

describe("computeDelta", () => {
  // Powers every MoM badge on the admin overview KPI strip. The
  // edge cases below are the ones that have historically lied on
  // ops dashboards: prior=0 quietly rendering "+infinity%", flat
  // months rendering as a green up-arrow, and negative movements
  // colour-coded as gains.
  it("flags growth, decline and flat as the right direction with the right pct", () => {
    expect(computeDelta(12, 10)).toEqual({
      current: 12,
      prior: 10,
      pct: 20,
      direction: "up",
    });
    expect(computeDelta(8, 10)).toEqual({
      current: 8,
      prior: 10,
      pct: -20,
      direction: "down",
    });
    expect(computeDelta(10, 10)).toEqual({
      current: 10,
      prior: 10,
      pct: 0,
      direction: "flat",
    });
  });

  it("returns pct=null when prior is 0 instead of emitting infinity", () => {
    // The UI prints "new" for this case. Regressing this would put
    // "+Infinity%" or "NaN%" on the dashboard the next time a
    // pipeline metric goes from cold-start to first conversion.
    expect(computeDelta(5, 0)).toEqual({
      current: 5,
      prior: 0,
      pct: null,
      direction: "up",
    });
    expect(computeDelta(0, 0)).toEqual({
      current: 0,
      prior: 0,
      pct: null,
      direction: "flat",
    });
  });
});

describe("meanDaysBetween", () => {
  // Powers the "Lead → owner days" KPI on the admin growth strip.
  // The empty-input case is the one that matters: returning 0 (or
  // NaN) instead of null would print "0.0 d" on the dashboard for
  // a market with no recent conversions, which is materially
  // misleading.
  it("averages the day diff across multiple pairs", () => {
    expect(
      meanDaysBetween([
        {
          from: new Date("2026-05-01T00:00:00Z"),
          to: new Date("2026-05-04T00:00:00Z"),
        },
        {
          from: new Date("2026-05-10T00:00:00Z"),
          to: new Date("2026-05-15T00:00:00Z"),
        },
      ]),
    ).toBe(4); // (3 + 5) / 2
  });

  it("returns null for an empty cohort instead of NaN or 0", () => {
    expect(meanDaysBetween([])).toBeNull();
  });
});

describe("daysUntil", () => {
  // Powers the "ends in Nd" hint on the leases-expiring-soon
  // attention bucket. The two corners that matter:
  //   * sub-day windows still read as 1d, never 0d (otherwise a
  //     lease ending tonight looks like it's already over).
  //   * past dates clamp to 0 so we don't print negative days for a
  //     just-expired lease that's still awaiting cleanup.
  it("rounds partial days up to a whole day of warning", () => {
    const now = new Date("2026-05-01T12:00:00.000Z");
    const sixHoursLater = new Date("2026-05-01T18:00:00.000Z");
    const fiveDaysLater = new Date("2026-05-06T12:00:00.000Z");
    expect(daysUntil(sixHoursLater, now)).toBe(1);
    expect(daysUntil(fiveDaysLater, now)).toBe(5);
  });

  it("clamps to zero for past dates instead of going negative", () => {
    const now = new Date("2026-05-01T12:00:00.000Z");
    const yesterday = new Date("2026-04-30T12:00:00.000Z");
    expect(daysUntil(yesterday, now)).toBe(0);
  });
});
