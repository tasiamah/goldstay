import { describe, expect, it } from "vitest";
import {
  clampHeatmapMonths,
  heatmapWindowStart,
  HEATMAP_MIN_MONTHS,
  HEATMAP_MAX_MONTHS,
} from "./heatmap";

describe("clampHeatmapMonths", () => {
  it("defaults to the minimum window for missing or junk input", () => {
    expect(clampHeatmapMonths(undefined)).toBe(HEATMAP_MIN_MONTHS);
    expect(clampHeatmapMonths("")).toBe(HEATMAP_MIN_MONTHS);
    expect(clampHeatmapMonths("nonsense")).toBe(HEATMAP_MIN_MONTHS);
    expect(clampHeatmapMonths(NaN)).toBe(HEATMAP_MIN_MONTHS);
  });

  it("snaps to 3-month steps within the allowed range", () => {
    expect(clampHeatmapMonths("3")).toBe(3);
    expect(clampHeatmapMonths("6")).toBe(6);
    expect(clampHeatmapMonths("7")).toBe(6);
    expect(clampHeatmapMonths("8")).toBe(9);
    expect(clampHeatmapMonths("9")).toBe(9);
    expect(clampHeatmapMonths("12")).toBe(12);
  });

  it("never exceeds the cap or drops below the floor", () => {
    expect(clampHeatmapMonths("100")).toBe(HEATMAP_MAX_MONTHS);
    expect(clampHeatmapMonths("-5")).toBe(HEATMAP_MIN_MONTHS);
  });
});

describe("heatmapWindowStart", () => {
  it("returns the first day of the month N-1 months back, in UTC", () => {
    const now = new Date(Date.UTC(2026, 3, 15)); // 15 Apr 2026
    const start = heatmapWindowStart(now, 3);
    expect(start.toISOString()).toBe("2026-02-01T00:00:00.000Z");
  });

  it("a 1-month window starts at the current month", () => {
    const now = new Date(Date.UTC(2026, 3, 30));
    const start = heatmapWindowStart(now, 1);
    expect(start.toISOString()).toBe("2026-04-01T00:00:00.000Z");
  });

  it("a 12-month window walks across a year boundary", () => {
    const now = new Date(Date.UTC(2026, 0, 5)); // 5 Jan 2026
    const start = heatmapWindowStart(now, 12);
    expect(start.toISOString()).toBe("2025-02-01T00:00:00.000Z");
  });
});
