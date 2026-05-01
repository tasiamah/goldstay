import { describe, expect, it } from "vitest";
import { groupEventsByDay, summariseAction } from "./audit";

describe("summariseAction", () => {
  it("returns the canonical summary for a known action", () => {
    expect(summariseAction("property.verified")).toBe("Property marked active");
    expect(summariseAction("agreement.signed")).toBe(
      "Management agreement signed",
    );
  });

  it("falls back to the raw action for unknown keys", () => {
    expect(summariseAction("totally.new.action")).toBe("totally.new.action");
  });
});

describe("groupEventsByDay", () => {
  const now = new Date("2026-05-01T12:00:00Z");

  it("groups events into Today / Yesterday / dated buckets and preserves order", () => {
    const events = [
      { id: "a", createdAt: new Date("2026-05-01T11:00:00Z") },
      { id: "b", createdAt: new Date("2026-05-01T08:00:00Z") },
      { id: "c", createdAt: new Date("2026-04-30T22:00:00Z") },
      { id: "d", createdAt: new Date("2026-04-15T09:00:00Z") },
    ];
    const buckets = groupEventsByDay(events, now);
    expect(buckets.map((b) => b.label)).toEqual([
      "Today",
      "Yesterday",
      "15 Apr 2026",
    ]);
    expect(buckets[0].events.map((e) => e.id)).toEqual(["a", "b"]);
    expect(buckets[1].events.map((e) => e.id)).toEqual(["c"]);
    expect(buckets[2].events.map((e) => e.id)).toEqual(["d"]);
  });

  it("returns isoDate suitable for stable React keys", () => {
    const buckets = groupEventsByDay(
      [{ id: "x", createdAt: new Date("2026-04-15T09:00:00Z") }],
      now,
    );
    expect(buckets[0].isoDate).toBe("2026-04-15");
  });

  it("returns an empty array for an empty input", () => {
    expect(groupEventsByDay([], now)).toEqual([]);
  });
});
