import { describe, expect, it } from "vitest";
import { daysAgo } from "./queue";

describe("daysAgo", () => {
  it("subtracts whole days from the given anchor", () => {
    const anchor = new Date("2026-05-01T12:00:00.000Z");
    const three = daysAgo(3, anchor);
    expect(three.toISOString()).toBe("2026-04-28T12:00:00.000Z");
  });

  it("treats 0 as the anchor itself", () => {
    const anchor = new Date("2026-05-01T12:00:00.000Z");
    expect(daysAgo(0, anchor).getTime()).toBe(anchor.getTime());
  });
});
