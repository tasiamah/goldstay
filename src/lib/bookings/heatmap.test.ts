import { describe, expect, it } from "vitest";
import {
  HEATMAP_MAX_MONTHS,
  HEATMAP_MIN_MONTHS,
  buildOccupancyIndex,
  clampHeatmapMonths,
  heatmapWindowEnd,
  heatmapWindowLabel,
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

describe("the window the board draws", () => {
  // The default three blocks are last month, this month and next, so
  // a landlord sees who is coming rather than only who has been.
  it("starts one month back for the default window", () => {
    expect(
      heatmapWindowStart(new Date(Date.UTC(2026, 3, 15)), 3).toISOString(),
    ).toBe("2026-03-01T00:00:00.000Z");
  });

  it("ends on the last day of next month", () => {
    expect(
      heatmapWindowEnd(new Date(Date.UTC(2026, 3, 15))).toISOString(),
    ).toBe("2026-05-31T00:00:00.000Z");
  });

  it("crosses a year boundary at both ends", () => {
    expect(
      heatmapWindowStart(new Date(Date.UTC(2026, 0, 5)), 12).toISOString(),
    ).toBe("2025-03-01T00:00:00.000Z");
    expect(
      heatmapWindowEnd(new Date(Date.UTC(2026, 11, 5))).toISOString(),
    ).toBe("2027-01-31T00:00:00.000Z");
  });

  it("widens backwards, keeping next month at the far end", () => {
    const now = new Date(Date.UTC(2026, 9, 27));
    const three = heatmapWindowStart(now, 3);
    const six = heatmapWindowStart(now, 6);
    expect(three.toISOString()).toBe("2026-09-01T00:00:00.000Z");
    expect(six.toISOString()).toBe("2026-06-01T00:00:00.000Z");
    // "Show 3 more months" reveals history; the future end is fixed.
    expect(heatmapWindowEnd(now).toISOString()).toBe(
      "2026-11-30T00:00:00.000Z",
    );
  });
});

describe("who is in the flat on a given night", () => {
  const d = (iso: string) => new Date(`${iso}T00:00:00.000Z`);
  const windowEnd = d("2026-10-31");
  const keys = (m: Map<string, unknown>) => [...m.keys()];

  it("fills the nights of a stay, but not the checkout morning", () => {
    const index = buildOccupancyIndex({
      bookings: [
        {
          source: "AIRBNB",
          guestName: "Jefferson George",
          checkIn: d("2026-10-23"),
          checkOut: d("2026-10-26"),
          status: "CONFIRMED",
        },
      ],
      windowEnd,
    });
    // 23rd, 24th, 25th. The guest is gone on the morning of the 26th.
    expect(keys(index)).toEqual(["2026-9-23", "2026-9-24", "2026-9-25"]);
  });

  it("fills the term of a tenancy, end date included", () => {
    // A tenancy's end date is the last day someone lives there, so
    // unlike a checkout it counts. Reading bookings alone reported
    // every tenanted flat as empty for its whole term.
    const index = buildOccupancyIndex({
      leases: [
        {
          tenantName: "Jane Wambui",
          startDate: d("2026-10-01"),
          endDate: d("2026-10-03"),
          status: "ACTIVE",
        },
      ],
      windowEnd,
    });
    expect(keys(index)).toEqual(["2026-9-1", "2026-9-2", "2026-9-3"]);
    expect(index.get("2026-9-2")).toEqual({
      kind: "lease",
      label: "Jane Wambui",
    });
  });

  it("fills an open-ended tenancy only as far as the board is drawn", () => {
    const index = buildOccupancyIndex({
      leases: [
        {
          tenantName: "Jane Wambui",
          startDate: d("2026-10-29"),
          endDate: null,
          status: "ACTIVE",
        },
      ],
      windowEnd,
    });
    expect(keys(index)).toEqual(["2026-9-29", "2026-9-30", "2026-9-31"]);
  });

  it("counts a tenancy that has since ended, because the board shows history", () => {
    const index = buildOccupancyIndex({
      leases: [
        {
          tenantName: "Jane Wambui",
          startDate: d("2026-10-01"),
          endDate: d("2026-10-01"),
          status: "ENDED",
        },
      ],
      windowEnd,
    });
    expect(keys(index)).toHaveLength(1);
  });

  it("ignores a tenancy that has not started and a cancelled stay", () => {
    const index = buildOccupancyIndex({
      leases: [
        {
          tenantName: "Not moved in",
          startDate: d("2026-10-01"),
          endDate: d("2026-10-20"),
          status: "PENDING",
        },
      ],
      bookings: [
        {
          source: "AIRBNB",
          guestName: "Cancelled",
          checkIn: d("2026-10-05"),
          checkOut: d("2026-10-09"),
          status: "CANCELLED",
        },
      ],
      windowEnd,
    });
    expect(index.size).toBe(0);
  });

  it("shows the stay that happened when a flat switched from long to short", () => {
    const index = buildOccupancyIndex({
      leases: [
        {
          tenantName: "Jane Wambui",
          startDate: d("2026-10-01"),
          endDate: d("2026-10-05"),
          status: "TERMINATED",
        },
      ],
      bookings: [
        {
          source: "AIRBNB",
          guestName: "Jefferson George",
          checkIn: d("2026-10-04"),
          checkOut: d("2026-10-06"),
          status: "CONFIRMED",
        },
      ],
      windowEnd,
    });
    expect(index.get("2026-9-1")).toMatchObject({ kind: "lease" });
    // Overlap resolves to the stay, not the tenancy it was still
    // nominally under.
    expect(index.get("2026-9-4")).toMatchObject({ kind: "booking" });
    expect(index.get("2026-9-5")).toMatchObject({ kind: "booking" });
  });

  it("is empty for a flat between tenants", () => {
    expect(buildOccupancyIndex({ windowEnd }).size).toBe(0);
  });
});

describe("heatmapWindowLabel", () => {
  it("names the span, including the month ahead", () => {
    expect(heatmapWindowLabel(new Date(Date.UTC(2026, 9, 27)), 3)).toBe(
      "Sept – Nov 2026",
    );
  });

  it("spells out both years when the span crosses one", () => {
    expect(heatmapWindowLabel(new Date(Date.UTC(2026, 11, 5)), 3)).toBe(
      "Nov 2026 – Jan 2027",
    );
  });
});
