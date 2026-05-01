import { describe, expect, it } from "vitest";
import {
  ARCHIVE_RESTORE_WINDOW_DAYS,
  isWithinRestoreWindow,
} from "./archive";

// Soft-delete restore window. The bug class that matters: an off-by-one
// at the window edge would either let ops restore something we'd
// already promised to forget about, or hide a still-recoverable record.
// formatEntity is a label map — not worth a test.

describe("isWithinRestoreWindow", () => {
  it("returns true inside the window and false past the edge or for null", () => {
    const now = new Date("2026-05-01T12:00:00.000Z");
    const day = 24 * 60 * 60 * 1000;
    expect(isWithinRestoreWindow(null, now)).toBe(false);
    expect(isWithinRestoreWindow(new Date(now.getTime() - 5 * day), now)).toBe(true);
    expect(
      isWithinRestoreWindow(
        new Date(now.getTime() - (ARCHIVE_RESTORE_WINDOW_DAYS + 1) * day),
        now,
      ),
    ).toBe(false);
  });
});
