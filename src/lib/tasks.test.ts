import { describe, expect, it } from "vitest";
import {
  categoriseTask,
  isTaskOverdue,
  sortTasksByPriority,
} from "./tasks";

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

describe("categoriseTask", () => {
  it("returns 'completed' regardless of dueAt when completedAt is set", () => {
    expect(
      categoriseTask(t("2026-04-01T00:00:00Z", "2026-04-15T00:00:00Z"), now),
    ).toBe("completed");
  });

  it("returns 'noDate' when there is no dueAt", () => {
    expect(categoriseTask(t(null), now)).toBe("noDate");
  });

  it("classifies relative to UTC start-of-day", () => {
    expect(categoriseTask(t("2026-04-30T22:00:00Z"), now)).toBe("overdue");
    // Same UTC day as `now` (2026-05-01) → today, even at 23:59
    expect(categoriseTask(t("2026-05-01T23:59:00Z"), now)).toBe("today");
    expect(categoriseTask(t("2026-05-05T08:00:00Z"), now)).toBe("thisWeek");
    expect(categoriseTask(t("2026-05-08T08:00:00Z"), now)).toBe("thisWeek");
    expect(categoriseTask(t("2026-05-09T08:00:00Z"), now)).toBe("later");
  });
});

describe("isTaskOverdue", () => {
  it("only returns true for past, incomplete dueAt", () => {
    expect(isTaskOverdue(t("2026-04-01T00:00:00Z"), now)).toBe(true);
    expect(
      isTaskOverdue(t("2026-04-01T00:00:00Z", "2026-04-15T00:00:00Z"), now),
    ).toBe(false);
    expect(isTaskOverdue(t("2026-06-01T00:00:00Z"), now)).toBe(false);
  });
});

describe("sortTasksByPriority", () => {
  it("orders overdue → today → thisWeek → later → noDate → completed", () => {
    const tasks = [
      t(null, "2026-04-01T00:00:00Z", "done"),
      t(null, null, "noDate"),
      t("2026-05-08T00:00:00Z", null, "thisWeek"),
      t("2026-04-25T00:00:00Z", null, "overdue"),
      t("2026-05-30T00:00:00Z", null, "later"),
      t("2026-05-01T15:00:00Z", null, "today"),
    ];
    const sorted = sortTasksByPriority(tasks, now).map((x) => x.id);
    expect(sorted).toEqual([
      "overdue",
      "today",
      "thisWeek",
      "later",
      "noDate",
      "done",
    ]);
  });

  it("within a bucket, earlier dueAt comes first", () => {
    const tasks = [
      t("2026-04-29T00:00:00Z", null, "second-overdue"),
      t("2026-04-15T00:00:00Z", null, "first-overdue"),
    ];
    expect(sortTasksByPriority(tasks, now).map((x) => x.id)).toEqual([
      "first-overdue",
      "second-overdue",
    ]);
  });
});
