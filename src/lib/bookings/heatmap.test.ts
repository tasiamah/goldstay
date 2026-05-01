import { describe, expect, it } from "vitest";
import {
  HEATMAP_MAX_MONTHS,
  HEATMAP_MIN_MONTHS,
  clampHeatmapMonths,
  heatmapWindowStart,
} from "./heatmap";

// Heatmap window controls. The interesting bug class: an unbounded
// `months` query param would pull years of bookings into a single
// grid render. Window-start arithmetic also has the usual UTC/year
// boundary trap.

describe("clampHeatmapMonths", () => {
  it("clamps junk + out-of-range to safe bounds and snaps to 3-month steps", () => {
    expect(clampHeatmapMonths("nonsense")).toBe(HEATMAP_MIN_MONTHS);
    expect(clampHeatmapMonths("100")).toBe(HEATMAP_MAX_MONTHS);
    expect(clampHeatmapMonths("-5")).toBe(HEATMAP_MIN_MONTHS);
    expect(clampHeatmapMonths("8")).toBe(9);
  });
});

describe("heatmapWindowStart", () => {
  it("returns the first day of the month N-1 months back, in UTC, across year boundaries", () => {
    expect(
      heatmapWindowStart(new Date(Date.UTC(2026, 3, 15)), 3).toISOString(),
    ).toBe("2026-02-01T00:00:00.000Z");
    expect(
      heatmapWindowStart(new Date(Date.UTC(2026, 0, 5)), 12).toISOString(),
    ).toBe("2025-02-01T00:00:00.000Z");
  });
});
