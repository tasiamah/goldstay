import type { PrismaClient } from "@prisma/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  HOSTAWAY_BACKFILL_MONTHS,
  runPendingHostawayBackfills,
} from "@/lib/hostaway/backfill";

const importMock = vi.hoisted(() => vi.fn());
const credentialsMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/hostaway/import", () => ({
  importPropertyReservations: importMock,
}));
vi.mock("@/lib/hostaway/client", () => ({
  hostawayCredentials: credentialsMock,
}));

type Row = {
  id: string;
  name: string;
  hostawayListingId: string | null;
};

type FindManyArgs = { where: Record<string, unknown> };

function makePrisma(rows: Row[]) {
  const findMany = vi.fn(async (_args: FindManyArgs) => rows);
  return {
    prisma: { property: { findMany } } as unknown as PrismaClient,
    findMany,
  };
}

function summary(created: number) {
  return {
    fetched: created,
    created,
    updated: 0,
    transactionsCreated: created * 4,
    placeholdersRemoved: 0,
    skipped: 0,
  };
}

beforeEach(() => {
  credentialsMock.mockReturnValue({ accountId: "212175", apiKey: "key" });
  importMock.mockReset();
  importMock.mockImplementation(async () => summary(8));
});

afterEach(() => vi.restoreAllMocks());

describe("selecting what to backfill", () => {
  it("only asks for listings that have never been reached", async () => {
    // hostawaySyncedAt is stamped by the importer on a successful
    // fetch, so this is what stops the backfill re-running every
    // fifteen minutes for the rest of the property's life.
    const { prisma, findMany } = makePrisma([]);
    await runPendingHostawayBackfills({ prisma });

    expect(findMany).toHaveBeenCalledTimes(1);
    const where = findMany.mock.calls[0][0].where;
    expect(where).toEqual({
      hostawayListingId: { not: null },
      hostawaySyncedAt: null,
    });
  });

  it("reaches back twelve months from the run, not from the property", async () => {
    const { prisma } = makePrisma([
      { id: "p1", name: "Misty Springs", hostawayListingId: "606085" },
    ]);
    const now = new Date("2026-11-05T06:00:00.000Z");
    await runPendingHostawayBackfills({ prisma, now });

    const args = importMock.mock.calls[0][0];
    expect(args.listingId).toBe("606085");
    expect(args.to).toEqual(now);
    expect(args.from.getUTCFullYear()).toBe(2025);
    expect(args.from.getUTCMonth()).toBe(10);
    expect(HOSTAWAY_BACKFILL_MONTHS).toBe(12);
  });

  it("caps a single run so the cron keeps its budget for the feeds", async () => {
    const rows = Array.from({ length: 12 }, (_, i) => ({
      id: `p${i}`,
      name: `Unit ${i}`,
      hostawayListingId: `${600000 + i}`,
    }));
    const { prisma } = makePrisma(rows);

    const result = await runPendingHostawayBackfills({ prisma, maxPerRun: 4 });

    expect(result.pending).toBe(12);
    expect(result.attempted).toBe(4);
    expect(importMock).toHaveBeenCalledTimes(4);
  });

  it("does nothing, and does not throw, with no Hostaway credentials", async () => {
    // A deployment without Hostaway still has calendar feeds to run.
    credentialsMock.mockReturnValue(null);
    const { prisma, findMany } = makePrisma([
      { id: "p1", name: "Misty Springs", hostawayListingId: "606085" },
    ]);

    const result = await runPendingHostawayBackfills({ prisma });

    expect(result.attempted).toBe(0);
    expect(findMany).not.toHaveBeenCalled();
    expect(importMock).not.toHaveBeenCalled();
  });
});

describe("when one listing fails", () => {
  it("carries on with the rest and leaves the failure to retry", async () => {
    const { prisma } = makePrisma([
      { id: "p1", name: "Misty Springs", hostawayListingId: "606085" },
      { id: "p2", name: "Kindaruma", hostawayListingId: "594701" },
    ]);
    importMock
      .mockRejectedValueOnce(new Error("Hostaway rejected the request (404)."))
      .mockResolvedValueOnce(summary(15));

    const result = await runPendingHostawayBackfills({ prisma });

    expect(result.attempted).toBe(2);
    expect(result.failed).toBe(1);
    expect(result.succeeded).toBe(1);
    // The second property's history still landed.
    expect(result.bookingsCreated).toBe(15);
    expect(result.outcomes[0]).toMatchObject({
      propertyName: "Misty Springs",
      ok: false,
      error: "Hostaway rejected the request (404).",
    });
    // Nothing stamps hostawaySyncedAt on the failure, so the next
    // run picks it up again without anyone intervening.
  });
});

describe("reporting", () => {
  it("counts the bookings recovered so the run is auditable", async () => {
    const { prisma } = makePrisma([
      { id: "p1", name: "Misty Springs", hostawayListingId: "606085" },
      { id: "p2", name: "Kindaruma", hostawayListingId: "594701" },
    ]);
    importMock
      .mockResolvedValueOnce(summary(8))
      .mockResolvedValueOnce(summary(15));

    const result = await runPendingHostawayBackfills({ prisma });

    expect(result).toMatchObject({
      pending: 2,
      attempted: 2,
      succeeded: 2,
      failed: 0,
      bookingsCreated: 23,
    });
  });
});
