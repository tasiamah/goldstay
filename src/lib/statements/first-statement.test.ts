import { describe, expect, it } from "vitest";

import {
  firstStatementFacts,
  firstStatementNote,
} from "./first-statement";

const SEPTEMBER = {
  start: new Date(Date.UTC(2026, 8, 1)),
  end: new Date(Date.UTC(2026, 9, 1)),
};
const PERIOD = { year: 2026, month: 9 };

describe("firstStatementFacts", () => {
  it("counts the days a mid-month joiner was actually with us", () => {
    // Yar joined on 5 September, so 26 of September's 30 days.
    const f = firstStatementFacts({
      joinedOn: new Date(Date.UTC(2026, 8, 5)),
      period: SEPTEMBER,
    });
    expect(f).toEqual({
      daysLive: 26,
      daysInPeriod: 30,
      joinedOn: new Date(Date.UTC(2026, 8, 5)),
    });
  });

  it("counts the join day as a whole day whatever time they signed up", () => {
    // The stored createdAt carries a time. Counting from the
    // timestamp gives 25, which sits next to a sentence naming the
    // 5th — and anyone counting the 5th to the 30th gets 26.
    const f = firstStatementFacts({
      joinedOn: new Date("2026-09-05T14:23:47.000Z"),
      period: SEPTEMBER,
    });
    expect(f.daysLive).toBe(26);
    expect(f.joinedOn).toEqual(new Date(Date.UTC(2026, 8, 5)));
  });

  it("reports no part month for someone who joined before it started", () => {
    // The month was a full one for them, and claiming otherwise is
    // the kind of excuse a client can disprove from their own records.
    const f = firstStatementFacts({
      joinedOn: new Date(Date.UTC(2026, 7, 20)),
      period: SEPTEMBER,
    });
    expect(f.daysLive).toBeNull();
  });

  it("treats joining on the first as a full month", () => {
    const f = firstStatementFacts({
      joinedOn: new Date(Date.UTC(2026, 8, 1)),
      period: SEPTEMBER,
    });
    expect(f.daysLive).toBeNull();
  });

  it("gets the length of a 31-day month right", () => {
    const f = firstStatementFacts({
      joinedOn: new Date(Date.UTC(2026, 9, 10)),
      period: {
        start: new Date(Date.UTC(2026, 9, 1)),
        end: new Date(Date.UTC(2026, 10, 1)),
      },
    });
    expect(f.daysInPeriod).toBe(31);
    expect(f.daysLive).toBe(22);
  });

  it("survives a missing join date", () => {
    const f = firstStatementFacts({ joinedOn: null, period: SEPTEMBER });
    expect(f.daysLive).toBeNull();
    expect(f.daysInPeriod).toBe(30);
  });

  it("never reports more days than the month has", () => {
    const f = firstStatementFacts({
      joinedOn: new Date(Date.UTC(2026, 10, 4)),
      period: SEPTEMBER,
    });
    expect(f.daysLive).toBe(0);
  });
});

describe("firstStatementNote", () => {
  it("states the real dates rather than claiming a partial month", () => {
    const note = firstStatementNote(
      firstStatementFacts({
        joinedOn: new Date(Date.UTC(2026, 8, 5)),
        period: SEPTEMBER,
      }),
      PERIOD,
    );
    expect(note[0]).toBe(
      "You joined Goldstay on 5 September, so this statement covers 26 of September 2026's 30 days rather than a full month.",
    );
  });

  it("omits the part-month sentence when the month was not short", () => {
    const note = firstStatementNote(
      firstStatementFacts({
        joinedOn: new Date(Date.UTC(2026, 7, 1)),
        period: SEPTEMBER,
      }),
      PERIOD,
    );
    expect(note.join(" ")).not.toContain("rather than a full month");
    expect(note.join(" ")).not.toContain("joined Goldstay");
  });

  it("always explains the review ramp and frames the month as a baseline", () => {
    for (const joinedOn of [
      new Date(Date.UTC(2026, 8, 5)),
      new Date(Date.UTC(2026, 7, 1)),
      null,
    ]) {
      const note = firstStatementNote(
        firstStatementFacts({ joinedOn, period: SEPTEMBER }),
        PERIOD,
      );
      const text = note.join(" ");
      expect(text).toContain("no reviews");
      expect(text).toContain("starting point rather than a run rate");
    }
  });

  it("promises nothing about future earnings", () => {
    // A statement is a financial document. "Usually climb" is a
    // description; "will climb" is a forecast we cannot honour.
    const text = firstStatementNote(
      firstStatementFacts({ joinedOn: null, period: SEPTEMBER }),
      PERIOD,
    ).join(" ");
    expect(text).toContain("usually climb");
    expect(text).not.toMatch(/will (climb|increase|rise|grow)/);
    expect(text).not.toMatch(/guarantee/i);
  });
});
