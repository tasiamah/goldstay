import { describe, expect, it } from "vitest";

import { buildShortTermSummary } from "@/lib/statements/short-term";

const september = {
  start: new Date(Date.UTC(2026, 8, 1)),
  end: new Date(Date.UTC(2026, 9, 1)),
};
const october = {
  start: new Date(Date.UTC(2026, 9, 1)),
  end: new Date(Date.UTC(2026, 10, 1)),
};

function stay(
  overrides: Partial<Parameters<typeof buildShortTermSummary>[0][number]> = {},
) {
  return {
    propertyId: "polaris",
    propertyName: "Polaris Residency",
    checkIn: new Date(Date.UTC(2026, 8, 13)),
    checkOut: new Date(Date.UTC(2026, 8, 19)),
    nights: 6,
    grossAmount: 60_000,
    otaCommission: 1_800,
    cleaningFee: 1_030,
    netPayout: 57_170,
    currency: "KES",
    status: "CONFIRMED" as const,
    ...overrides,
  };
}

describe("buildShortTermSummary", () => {
  it("sums a stay that sits wholly inside the period", () => {
    const [row] = buildShortTermSummary([stay()], [], september);
    expect(row).toMatchObject({
      bookings: 1,
      nights: 6,
      gross: 60_000,
      otaFees: 1_800,
      cleaning: 1_030,
      payout: 57_170,
    });
  });

  it("counts a boundary stay's money once, in the month it began", () => {
    // 28 Sep -> 5 Oct. Counting the full gross in both months would
    // bill the same guest payment to two statements, and the owner
    // would be shown revenue in October they were already paid for
    // in September.
    const boundary = stay({
      checkIn: new Date(Date.UTC(2026, 8, 28)),
      checkOut: new Date(Date.UTC(2026, 9, 5)),
      nights: 7,
    });

    const [sept] = buildShortTermSummary([boundary], [], september);
    const [oct] = buildShortTermSummary([boundary], [], october);

    expect(sept.gross).toBe(60_000);
    expect(oct.gross).toBe(0);
    expect(sept.gross + oct.gross).toBe(60_000);

    expect(sept.bookings).toBe(1);
    expect(oct.bookings).toBe(0);
  });

  it("still reports the nights that fell in each month", () => {
    const boundary = stay({
      checkIn: new Date(Date.UTC(2026, 8, 28)),
      checkOut: new Date(Date.UTC(2026, 9, 5)),
      nights: 7,
    });

    const [sept] = buildShortTermSummary([boundary], [], september);
    const [oct] = buildShortTermSummary([boundary], [], october);

    // Occupancy is genuinely split: 28, 29, 30 September and then
    // four nights of October.
    expect(sept.nights).toBe(3);
    expect(oct.nights).toBe(4);
    expect(sept.nights + oct.nights).toBe(7);
  });

  it("attributes a stay that began before the period to the earlier month", () => {
    const boundary = stay({
      checkIn: new Date(Date.UTC(2026, 7, 28)),
      checkOut: new Date(Date.UTC(2026, 8, 3)),
      nights: 6,
    });

    const [sept] = buildShortTermSummary([boundary], [], september);
    expect(sept.gross).toBe(0);
    expect(sept.nights).toBe(2);
  });

  it("ignores cancelled stays", () => {
    const rows = buildShortTermSummary(
      [stay({ status: "CANCELLED" })],
      [],
      september,
    );
    expect(rows).toEqual([]);
  });

  it("keeps currencies apart rather than adding them together", () => {
    const rows = buildShortTermSummary(
      [stay(), stay({ currency: "USD", grossAmount: 400, netPayout: 380 })],
      [],
      september,
    );
    expect(rows).toHaveLength(2);
    expect(rows.map((r) => r.currency)).toEqual(["KES", "USD"]);
  });

  it("deducts commission from the payout it reports", () => {
    const [row] = buildShortTermSummary(
      [stay()],
      [
        {
          propertyId: "polaris",
          type: "GOLDSTAY_COMMISSION",
          amount: 12_000,
          currency: "KES",
        },
      ],
      september,
    );
    expect(row.goldstayCommission).toBe(12_000);
    expect(row.payout).toBe(57_170 - 12_000);
  });
});
