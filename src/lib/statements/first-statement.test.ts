import { describe, expect, it } from "vitest";

import { firstStatementNote, joinedPartWayThrough } from "./first-statement";

const SEPTEMBER = {
  start: new Date(Date.UTC(2026, 8, 1)),
  end: new Date(Date.UTC(2026, 9, 1)),
};

describe("joinedPartWayThrough", () => {
  it("is true for someone who joined mid-month", () => {
    expect(
      joinedPartWayThrough({
        joinedOn: new Date("2026-09-05T14:23:47.000Z"),
        period: SEPTEMBER,
      }),
    ).toBe(true);
  });

  it("is false for someone who was with us before it started", () => {
    // Their month was a full one. Telling them otherwise is an
    // excuse they can disprove from their own records.
    expect(
      joinedPartWayThrough({
        joinedOn: new Date(Date.UTC(2026, 7, 20)),
        period: SEPTEMBER,
      }),
    ).toBe(false);
  });

  it("does not call a month short over a few hours", () => {
    // Joined at two in the afternoon on the 1st. They had the month.
    expect(
      joinedPartWayThrough({
        joinedOn: new Date("2026-09-01T14:00:00.000Z"),
        period: SEPTEMBER,
      }),
    ).toBe(false);
  });

  it("is true on the last day of the month", () => {
    expect(
      joinedPartWayThrough({
        joinedOn: new Date("2026-09-30T09:00:00.000Z"),
        period: SEPTEMBER,
      }),
    ).toBe(true);
  });

  it("is false for a date after the period and for no date at all", () => {
    expect(
      joinedPartWayThrough({
        joinedOn: new Date(Date.UTC(2026, 9, 4)),
        period: SEPTEMBER,
      }),
    ).toBe(false);
    expect(joinedPartWayThrough({ joinedOn: null, period: SEPTEMBER })).toBe(
      false,
    );
  });
});

describe("firstStatementNote", () => {
  it("names no dates or figures, so one wording serves every client", () => {
    for (const isPartMonth of [true, false]) {
      const text = firstStatementNote({ isPartMonth }).join(" ");
      expect(text).not.toMatch(/\d/);
      expect(text).not.toMatch(
        /January|February|March|April|May|June|July|August|September|October|November|December/,
      );
    }
  });

  it("mentions the part month only when there was one", () => {
    expect(firstStatementNote({ isPartMonth: true }).join(" ")).toContain(
      "You joined partway through the month",
    );
    expect(firstStatementNote({ isPartMonth: false }).join(" ")).not.toContain(
      "partway through",
    );
  });

  it("drops the 'also' when there is no preceding sentence to follow on from", () => {
    expect(firstStatementNote({ isPartMonth: true })[1]).toContain(
      "A new listing also starts with no reviews",
    );
    expect(firstStatementNote({ isPartMonth: false })[0]).toContain(
      "A new listing starts with no reviews",
    );
  });

  it("always explains the review ramp and frames the month as a baseline", () => {
    for (const isPartMonth of [true, false]) {
      const text = firstStatementNote({ isPartMonth }).join(" ");
      expect(text).toContain("no reviews");
      expect(text).toContain("starting point rather than a run rate");
    }
  });

  it("promises nothing about future earnings", () => {
    // A statement is a financial document. "Usually climb" is a
    // description; "will climb" is a forecast we cannot honour.
    const text = firstStatementNote({ isPartMonth: true }).join(" ");
    expect(text).toContain("usually climb");
    expect(text).not.toMatch(/will (climb|increase|rise|grow)/);
    expect(text).not.toMatch(/guarantee/i);
  });
});
