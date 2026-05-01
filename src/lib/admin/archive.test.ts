import { describe, expect, it } from "vitest";
import {
  ARCHIVE_RESTORE_WINDOW_DAYS,
  formatEntity,
  isWithinRestoreWindow,
} from "./archive";

describe("isWithinRestoreWindow", () => {
  const now = new Date("2026-05-01T12:00:00.000Z");

  it("returns false for null archivedAt", () => {
    expect(isWithinRestoreWindow(null, now)).toBe(false);
  });

  it("returns true when archived less than the window ago", () => {
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    expect(isWithinRestoreWindow(fiveDaysAgo, now)).toBe(true);
  });

  it("returns false past the window edge", () => {
    const pastWindow = new Date(
      now.getTime() - (ARCHIVE_RESTORE_WINDOW_DAYS + 1) * 24 * 60 * 60 * 1000,
    );
    expect(isWithinRestoreWindow(pastWindow, now)).toBe(false);
  });
});

describe("formatEntity", () => {
  it("turns enum keys into human strings", () => {
    expect(formatEntity("OWNER")).toBe("Owner");
    expect(formatEntity("PROPERTY")).toBe("Property");
    expect(formatEntity("LEASE")).toBe("Lease");
    expect(formatEntity("TRANSACTION")).toBe("Transaction");
  });
});
