import { describe, expect, it } from "vitest";
import { groupEventsByDay } from "./audit";

// Audit-log day grouping. The interesting failure mode is the
// Today / Yesterday / dated bucket boundaries straddling midnight UTC,
// which is what the timeline UI keys off. summariseAction is a label
// map; a missing entry gracefully degrades to the raw action and
// isn't worth a standalone test.

describe("groupEventsByDay", () => {
  it("buckets events into Today / Yesterday / dated and returns ISO keys", () => {
    const buckets = groupEventsByDay(
      [
        { id: "a", createdAt: new Date("2026-05-01T11:00:00Z") },
        { id: "b", createdAt: new Date("2026-05-01T08:00:00Z") },
        { id: "c", createdAt: new Date("2026-04-30T22:00:00Z") },
        { id: "d", createdAt: new Date("2026-04-15T09:00:00Z") },
      ],
      new Date("2026-05-01T12:00:00Z"),
    );
    expect(buckets.map((b) => b.label)).toEqual([
      "Today",
      "Yesterday",
      "15 Apr 2026",
    ]);
    expect(buckets[0]!.events.map((e) => e.id)).toEqual(["a", "b"]);
    expect(buckets[2]!.isoDate).toBe("2026-04-15");
  });
});
