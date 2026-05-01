import { describe, expect, it } from "vitest";
import { categoriseTask, sortTasksByPriority } from "./tasks";

const now = new Date("2026-05-01T12:00:00Z");
const t = (
  dueAt: string | null,
  completedAt: string | null = null,
  id = "t",
) => ({
  id,
  dueAt: dueAt ? new Date(dueAt) : null,
  completedAt: completedAt ? new Date(completedAt) : null,
});

// Task scheduler. The overdue / today / this-week / later boundaries
// are the only thing the ops kanban actually shows; the senior risks
// are tz drift across midnight and the global priority order. One
// joint test on each captures the whole behaviour.

describe("categoriseTask", () => {
  it("classifies relative to UTC start-of-day with completedAt as the override", () => {
    expect(categoriseTask(t(null), now)).toBe("noDate");
    expect(
      categoriseTask(t("2026-04-01T00:00:00Z", "2026-04-15T00:00:00Z"), now),
    ).toBe("completed");
    expect(categoriseTask(t("2026-04-30T22:00:00Z"), now)).toBe("overdue");
    expect(categoriseTask(t("2026-05-01T23:59:00Z"), now)).toBe("today");
    expect(categoriseTask(t("2026-05-08T08:00:00Z"), now)).toBe("thisWeek");
    expect(categoriseTask(t("2026-05-09T08:00:00Z"), now)).toBe("later");
  });
});

describe("sortTasksByPriority", () => {
  it("orders buckets and tie-breaks by earliest dueAt", () => {
    const sorted = sortTasksByPriority(
      [
        t(null, "2026-04-01T00:00:00Z", "done"),
        t(null, null, "noDate"),
        t("2026-05-08T00:00:00Z", null, "thisWeek"),
        t("2026-04-29T00:00:00Z", null, "second-overdue"),
        t("2026-04-15T00:00:00Z", null, "first-overdue"),
        t("2026-05-30T00:00:00Z", null, "later"),
        t("2026-05-01T15:00:00Z", null, "today"),
      ],
      now,
    ).map((x) => x.id);
    expect(sorted).toEqual([
      "first-overdue",
      "second-overdue",
      "today",
      "thisWeek",
      "later",
      "noDate",
      "done",
    ]);
  });
});
