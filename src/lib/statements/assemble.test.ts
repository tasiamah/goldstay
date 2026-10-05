import { describe, expect, it, vi } from "vitest";
import type { PrismaClient } from "@prisma/client";
import { assembleStatement } from "./assemble";

// These tests exist because of a specific class of bug rather than for
// coverage. Three code paths each built a statement from their own
// pair of queries and had quietly diverged, so the figures an operator
// approved were not the figures the client received. The assertions
// below pin the two differences that caused it: archived transactions
// must be excluded, and bookings must be loaded at all.

const PERIOD = { year: 2026, month: 9 };

function makePrisma(
  rows: {
    transactions?: unknown[];
    bookings?: unknown[];
    fxRates?: unknown[];
    earlierSend?: unknown;
    joinedOn?: Date | null;
  } = {},
) {
  const txFindMany = vi.fn().mockResolvedValue(rows.transactions ?? []);
  const bookingFindMany = vi.fn().mockResolvedValue(rows.bookings ?? []);
  const fxFindMany = vi.fn().mockResolvedValue(rows.fxRates ?? []);
  const sendFindFirst = vi.fn().mockResolvedValue(rows.earlierSend ?? null);
  const clientFindUnique = vi
    .fn()
    .mockResolvedValue(
      "joinedOn" in rows ? { createdAt: rows.joinedOn } : null,
    );
  const prisma = {
    transaction: { findMany: txFindMany },
    booking: { findMany: bookingFindMany },
    fxRate: { findMany: fxFindMany },
    statementSend: { findFirst: sendFindFirst },
    client: { findUnique: clientFindUnique },
  } as unknown as PrismaClient;
  return { prisma, txFindMany, bookingFindMany, fxFindMany, sendFindFirst };
}

function rate(day: number, value: number) {
  return {
    base: "USD",
    quote: "KES",
    asOf: new Date(Date.UTC(2026, 8, day)),
    rate: value,
  };
}

function tx(overrides: Record<string, unknown> = {}) {
  return {
    id: "tx-1",
    occurredOn: new Date("2026-09-10T00:00:00.000Z"),
    type: "RENT",
    direction: "INFLOW",
    amount: { toString: () => "40000" },
    currency: "KES",
    description: "Gross from a guest",
    reference: null,
    propertyId: "prop-1",
    property: { id: "prop-1", name: "Polaris Residency" },
    leaseId: null,
    lease: null,
    ...overrides,
  };
}

function booking(overrides: Record<string, unknown> = {}) {
  return {
    propertyId: "prop-1",
    property: { id: "prop-1", name: "Polaris Residency" },
    checkIn: new Date("2026-09-10T00:00:00.000Z"),
    checkOut: new Date("2026-09-14T00:00:00.000Z"),
    nights: 4,
    grossAmount: 40_000,
    otaCommission: 1_200,
    cleaningFee: 5_000,
    netPayout: 33_800,
    currency: "KES",
    status: "CONFIRMED",
    ...overrides,
  };
}

describe("assembleStatement", () => {
  it("excludes archived transactions, which is what leaked onto client PDFs", async () => {
    const { prisma, txFindMany } = makePrisma();
    await assembleStatement({
      prisma,
      client: { id: "client-1", preferredCurrency: "USD" },
      period: PERIOD,
    });

    expect(txFindMany).toHaveBeenCalledOnce();
    expect(txFindMany.mock.calls[0][0].where).toMatchObject({
      archivedAt: null,
      property: { clientId: "client-1" },
    });
  });

  it("scopes both queries to the period and to short-term properties", async () => {
    const { prisma, txFindMany, bookingFindMany } = makePrisma();
    await assembleStatement({
      prisma,
      client: { id: "client-1" },
      period: PERIOD,
    });

    const txWhere = txFindMany.mock.calls[0][0].where;
    expect(txWhere.occurredOn.gte).toEqual(new Date("2026-09-01T00:00:00.000Z"));
    expect(txWhere.occurredOn.lt).toEqual(new Date("2026-10-01T00:00:00.000Z"));

    // A stay that straddles the boundary has to be loaded so its
    // nights can be clipped, so this is an overlap test rather than
    // containment.
    const bookingWhere = bookingFindMany.mock.calls[0][0].where;
    expect(bookingWhere.property).toMatchObject({
      clientId: "client-1",
      propertyType: "SHORT_TERM",
    });
    expect(bookingWhere.checkIn.lt).toEqual(
      new Date("2026-10-01T00:00:00.000Z"),
    );
    expect(bookingWhere.checkOut.gt).toEqual(
      new Date("2026-09-01T00:00:00.000Z"),
    );
  });

  it("returns a short-stay rollup, which the admin preview previously had no way to show", async () => {
    const { prisma } = makePrisma({ bookings: [booking()] });
    const { shortTerm } = await assembleStatement({
      prisma,
      client: { id: "client-1" },
      period: PERIOD,
    });

    expect(shortTerm).toHaveLength(1);
    expect(shortTerm[0]).toMatchObject({
      propertyName: "Polaris Residency",
      bookings: 1,
      nights: 4,
      gross: 40_000,
      otaFees: 1_200,
      cleaning: 5_000,
      payout: 33_800,
    });
  });

  it("deducts Goldstay commission from the short-stay payout", async () => {
    const { prisma } = makePrisma({
      bookings: [booking()],
      transactions: [
        tx({
          id: "tx-commission",
          type: "GOLDSTAY_COMMISSION",
          direction: "OUTFLOW",
          amount: { toString: () => "8000" },
        }),
      ],
    });
    const { shortTerm } = await assembleStatement({
      prisma,
      client: { id: "client-1" },
      period: PERIOD,
    });

    expect(shortTerm[0].goldstayCommission).toBe(8_000);
    expect(shortTerm[0].payout).toBe(25_800);
  });

  it("reports an empty period only when there is neither a transaction nor a stay", async () => {
    const empty = makePrisma();
    await expect(
      assembleStatement({
        prisma: empty.prisma,
        client: { id: "client-1" },
        period: PERIOD,
      }).then((r) => r.isEmpty),
    ).resolves.toBe(true);

    // A short-let month can have stays and no ledger rows yet, and
    // that is not an empty statement.
    const staysOnly = makePrisma({ bookings: [booking()] });
    await expect(
      assembleStatement({
        prisma: staysOnly.prisma,
        client: { id: "client-1" },
        period: PERIOD,
      }).then((r) => r.isEmpty),
    ).resolves.toBe(false);
  });

  it("folds transactions into per-currency totals for the ledger section", async () => {
    const { prisma } = makePrisma({ transactions: [tx()] });
    const { statement } = await assembleStatement({
      prisma,
      client: { id: "client-1" },
      period: PERIOD,
    });

    expect(statement.transactionCount).toBe(1);
    expect(statement.totalsByCurrency).toEqual([
      { currency: "KES", inflow: 40_000, outflow: 0, net: 40_000 },
    ]);
    expect(statement.propertyGroups[0].propertyName).toBe("Polaris Residency");
  });
});

// A first statement is the worst one a client ever gets and arrives
// before they have any basis for judging us. These pin when the
// explaining note appears, because the failure modes run both ways:
// missing on the one statement that needs it, or still apologising
// for a quiet first month a year later.
describe("assembleStatement first-statement note", () => {
  it("explains the first statement a client receives", async () => {
    const { prisma } = makePrisma({
      transactions: [tx()],
      joinedOn: new Date("2026-09-05T00:00:00.000Z"),
    });
    const { firstStatementNote: note } = await assembleStatement({
      prisma,
      client: { id: "client-1" },
      period: PERIOD,
    });

    expect(note.join(" ")).toContain(
      "You joined Goldstay on 5 September, so this statement covers 26 of September 2026's 30 days",
    );
    expect(note.join(" ")).toContain("no reviews");
  });

  it("says nothing once an earlier statement has been sent", async () => {
    const { prisma } = makePrisma({
      transactions: [tx()],
      joinedOn: new Date("2026-09-05T00:00:00.000Z"),
      earlierSend: { id: "send-august" },
    });
    const { firstStatementNote: note } = await assembleStatement({
      prisma,
      client: { id: "client-1" },
      period: PERIOD,
    });
    expect(note).toEqual([]);
  });

  it("only counts statements for earlier periods, not this one", async () => {
    // September stays the first statement after September has been
    // sent, or the note would vanish from the portal copy the moment
    // the email went out.
    const { prisma, sendFindFirst } = makePrisma({
      transactions: [tx()],
      joinedOn: new Date("2026-09-05T00:00:00.000Z"),
    });
    await assembleStatement({
      prisma,
      client: { id: "client-1" },
      period: PERIOD,
    });
    expect(sendFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [
            { periodYear: { lt: 2026 } },
            { periodYear: 2026, periodMonth: { lt: 9 } },
          ],
        }),
      }),
    );
  });

  it("says nothing on an empty month", async () => {
    // There is no low figure to explain, and the note above a
    // statement showing nothing reads as an apology for nothing
    // having happened.
    const { prisma } = makePrisma({
      joinedOn: new Date("2026-09-05T00:00:00.000Z"),
    });
    const { firstStatementNote: note, isEmpty } = await assembleStatement({
      prisma,
      client: { id: "client-1" },
      period: PERIOD,
    });
    expect(isEmpty).toBe(true);
    expect(note).toEqual([]);
  });
});

// A property earning in USD could still be billed a cost in KES, and the
// statement then showed two currencies that could not be added together —
// a USD payout alongside a bare negative KES line. These pin the two
// halves of the fix: costs are converted into what the property earns,
// and the headline payout is additionally shown in the currency we will
// actually pay out in.
describe("assembleStatement currency conversion", () => {
  const usdRent = tx({
    id: "tx-rent",
    amount: { toString: () => "712" },
    currency: "USD",
  });
  const kesRepair = tx({
    id: "tx-repair",
    occurredOn: new Date("2026-09-28T00:00:00.000Z"),
    type: "REPAIR",
    direction: "OUTFLOW",
    amount: { toString: () => "6000" },
    currency: "KES",
    description: "Electricity token machine repair",
  });

  it("converts a cost into the currency the property earns in", async () => {
    const { prisma } = makePrisma({
      transactions: [usdRent, kesRepair],
      fxRates: [rate(16, 129.748), rate(28, 120)],
    });
    const { statement } = await assembleStatement({
      prisma,
      client: { id: "client-1", preferredCurrency: "KES" },
      period: PERIOD,
    });

    // One rate for the month, taken from its safest day and rounded
    // down from 129.748 to 120 — the whole-unit step at this
    // magnitude — so KES 6,000 bills at USD 50.
    expect(statement.totalsByCurrency).toEqual([
      { currency: "USD", inflow: 712, outflow: 50, net: 662 },
    ]);
    const repairRow = statement.propertyGroups[0].transactions.find(
      (t) => t.type === "REPAIR",
    );
    expect(repairRow?.currency).toBe("USD");
    expect(repairRow?.description).toContain("KES 6,000 at 1 USD = 120 KES");
  });

  it("leaves a cost in its own currency when the month published no rate", async () => {
    const { prisma } = makePrisma({
      transactions: [usdRent, kesRepair],
      // A rate, but from October. Valuing September with it would
      // restate the month using a number from outside it.
      fxRates: [
        { base: "USD", quote: "KES", asOf: new Date(Date.UTC(2026, 9, 3)), rate: 120 },
      ],
    });
    const { statement } = await assembleStatement({
      prisma,
      client: { id: "client-1", preferredCurrency: "KES" },
      period: PERIOD,
    });

    expect(statement.totalsByCurrency).toEqual([
      { currency: "KES", inflow: 0, outflow: 6_000, net: -6_000 },
      { currency: "USD", inflow: 712, outflow: 0, net: 712 },
    ]);
  });

  it("converts the costs and the payout at one rate for the month", async () => {
    // A statement that quoted one rate for a repair and another for
    // the payout invited exactly the question we cannot answer well.
    const { prisma } = makePrisma({
      transactions: [usdRent, kesRepair],
      fxRates: [rate(16, 129.748), rate(28, 129.2)],
    });
    const { statement, payoutInPreferred } = await assembleStatement({
      prisma,
      client: { id: "client-1", preferredCurrency: "KES" },
      period: PERIOD,
    });

    // September's lowest is 129.2, rounded down to a whole shilling.
    const repairRow = statement.propertyGroups[0].transactions.find(
      (t) => t.type === "REPAIR",
    );
    expect(repairRow?.description).toContain("1 USD = 129 KES");
    expect(payoutInPreferred?.rates[0].label).toBe("1 USD = 129 KES");

    // And the arithmetic holds end to end: 6000/129 off a 712 gross,
    // then the remainder back into shillings at the same 129.
    expect(repairRow?.amount).toBe(46.51);
    expect(statement.totalsByCurrency[0].net).toBe(665.49);
    expect(payoutInPreferred?.amount).toBe(85_848.21);
  });

  it("converts the payout at the month's rate that costs us least", async () => {
    const { prisma } = makePrisma({
      transactions: [usdRent, kesRepair],
      fxRates: [rate(16, 129.748), rate(28, 120), rate(30, 135)],
    });
    const { payoutInPreferred } = await assembleStatement({
      prisma,
      client: { id: "client-1", preferredCurrency: "KES" },
      period: PERIOD,
    });

    // 662 USD payable. Of the month's rates, 120 KES per USD hands over
    // the fewest shillings, so that is the one we use.
    expect(payoutInPreferred).not.toBeNull();
    expect(payoutInPreferred?.currency).toBe("KES");
    expect(payoutInPreferred?.amount).toBe(79_440);
    expect(payoutInPreferred?.rates[0].label).toBe("1 USD = 120 KES");
  });

  it("does not convert the payout when the client is already paid in their currency", async () => {
    const { prisma } = makePrisma({
      transactions: [usdRent],
      fxRates: [rate(16, 129.748)],
    });
    const { payoutInPreferred } = await assembleStatement({
      prisma,
      client: { id: "client-1", preferredCurrency: "USD" },
      period: PERIOD,
    });

    expect(payoutInPreferred).toBeNull();
  });

  it("shows no converted payout rather than a guessed one when the month has no rate", async () => {
    const { prisma } = makePrisma({ transactions: [usdRent], fxRates: [] });
    const { payoutInPreferred } = await assembleStatement({
      prisma,
      client: { id: "client-1", preferredCurrency: "KES" },
      period: PERIOD,
    });

    expect(payoutInPreferred).toBeNull();
  });

  it("does not offer to convert a month that owes us money", async () => {
    const { prisma } = makePrisma({
      transactions: [kesRepair],
      fxRates: [rate(28, 120)],
    });
    const { payoutInPreferred } = await assembleStatement({
      prisma,
      client: { id: "client-1", preferredCurrency: "KES" },
      period: PERIOD,
    });

    expect(payoutInPreferred).toBeNull();
  });
});
