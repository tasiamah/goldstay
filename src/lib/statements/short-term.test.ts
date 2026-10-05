import { describe, expect, it } from "vitest";

import {
  buildShortTermSummary,
  OWNER_COST_TYPES,
} from "@/lib/statements/short-term";

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

  // The September statement led with "Net payout = 365.57" while the
  // Summary immediately below it said 350.16. The gap was exactly the
  // month's electricity bill: this row subtracted commission but not
  // expenses, so the bold headline figure was the one number on the
  // page the owner was not actually going to be paid.
  it("deducts property expenses from the payout it reports", () => {
    const [row] = buildShortTermSummary(
      [stay()],
      [
        {
          propertyId: "polaris",
          type: "EXPENSE",
          amount: 2_000,
          currency: "KES",
        },
      ],
      september,
    );
    expect(row.expenses).toBe(2_000);
    expect(row.payout).toBe(57_170 - 2_000);
  });

  it("reports a payout its own line items add up to", () => {
    // The real failure was not a wrong total, it was two totals. This
    // asserts the row is internally consistent, so any future
    // deduction that forgets to touch `payout` fails here.
    const [row] = buildShortTermSummary(
      [stay()],
      [
        {
          propertyId: "polaris",
          type: "GOLDSTAY_COMMISSION",
          amount: 12_000,
          currency: "KES",
        },
        {
          propertyId: "polaris",
          type: "EXPENSE",
          amount: 2_000,
          currency: "KES",
        },
      ],
      september,
    );

    expect(row.payout).toBe(
      row.gross -
        row.otaFees -
        row.cleaning -
        row.goldstayCommission -
        row.expenses,
    );
    expect(row.payout).toBe(43_170);
  });

  // We convert no currency anywhere on the platform, so a shilling
  // receipt against a dollar-earning unit cannot be folded into the
  // dollar payout. It belongs to the Summary's KES block instead.
  it("leaves a cost in a currency the unit took no bookings in alone", () => {
    const [row] = buildShortTermSummary(
      [stay({ currency: "USD", grossAmount: 400, netPayout: 380 })],
      [
        {
          propertyId: "polaris",
          type: "EXPENSE",
          amount: 2_000,
          currency: "KES",
        },
      ],
      september,
    );
    expect(row.currency).toBe("USD");
    expect(row.expenses).toBe(0);
    expect(row.payout).toBe(380);
  });

  // Repairs are the most frequent cost on a unit, so a new type that
  // did not reach this row would quietly overpay the owner on most
  // statements rather than on the rare one.
  it("treats a repair as a cost to the owner, like any other", () => {
    const [row] = buildShortTermSummary(
      [stay()],
      [
        {
          propertyId: "polaris",
          type: "REPAIR",
          amount: 4_500,
          currency: "KES",
        },
      ],
      september,
    );
    expect(row.expenses).toBe(4_500);
    expect(row.payout).toBe(57_170 - 4_500);
  });

  it("every owner cost type is deducted, not just the ones we wrote tests for", () => {
    // Walks the exported list rather than naming members, so adding a
    // type to OWNER_COST_TYPES without wiring it into the row fails
    // here instead of on a client's PDF.
    expect(OWNER_COST_TYPES.length).toBeGreaterThan(0);
    for (const type of OWNER_COST_TYPES) {
      const [row] = buildShortTermSummary(
        [stay()],
        [{ propertyId: "polaris", type, amount: 1_000, currency: "KES" }],
        september,
      );
      expect(row.expenses, `${type} was not counted as a cost`).toBe(1_000);
      expect(row.payout, `${type} was not deducted from the payout`).toBe(
        57_170 - 1_000,
      );
    }
  });

  // "Costs on the property — 15.41" tells an owner money left without
  // telling them what for, which is the one question a deduction
  // always prompts.
  it("names each cost with what the operator wrote", () => {
    const [row] = buildShortTermSummary(
      [stay()],
      [
        {
          propertyId: "polaris",
          type: "UTILITIES",
          amount: 2_000,
          currency: "KES",
          description: "Electricity top-up",
        },
        {
          propertyId: "polaris",
          type: "REPAIR",
          amount: 4_500,
          currency: "KES",
          description: "Shower mixer replaced",
        },
      ],
      september,
    );

    expect(row.expenseItems).toEqual([
      { label: "Electricity top-up", amount: 2_000 },
      { label: "Shower mixer replaced", amount: 4_500 },
    ]);
    // The itemised lines have to add up to the figure subtracted from
    // the payout, or the statement argues with itself again.
    expect(
      row.expenseItems.reduce((sum, i) => sum + i.amount, 0),
    ).toBe(row.expenses);
  });

  it("falls back to the cost type when no description was written", () => {
    const [row] = buildShortTermSummary(
      [stay()],
      [
        {
          propertyId: "polaris",
          type: "REPAIR",
          amount: 4_500,
          currency: "KES",
          description: null,
        },
        {
          propertyId: "polaris",
          type: "UTILITIES",
          amount: 2_000,
          currency: "KES",
          description: "   ",
        },
      ],
      september,
    );
    expect(row.expenseItems.map((i) => i.label)).toEqual([
      "Repair",
      "Utilities",
    ]);
  });

  it("ignores transaction types that are not its own deductions", () => {
    // RENT already reached this row through the booking. Subtracting
    // it here too would double count.
    const [row] = buildShortTermSummary(
      [stay()],
      [
        {
          propertyId: "polaris",
          type: "RENT",
          amount: 60_000,
          currency: "KES",
        },
      ],
      september,
    );
    expect(row.payout).toBe(57_170);
  });
});
