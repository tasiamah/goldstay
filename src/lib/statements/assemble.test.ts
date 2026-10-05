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
  } = {},
) {
  const txFindMany = vi.fn().mockResolvedValue(rows.transactions ?? []);
  const bookingFindMany = vi.fn().mockResolvedValue(rows.bookings ?? []);
  const prisma = {
    transaction: { findMany: txFindMany },
    booking: { findMany: bookingFindMany },
  } as unknown as PrismaClient;
  return { prisma, txFindMany, bookingFindMany };
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
