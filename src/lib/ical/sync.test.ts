import { describe, expect, it, vi } from "vitest";
import type { PrismaClient } from "@prisma/client";
import { syncIcalEvents } from "./sync";
import type { ParsedEvent } from "./parse";

// The sync engine takes an injected prisma so it can be driven
// without a database. We assert against call arguments rather than
// reimplementing Prisma's filter semantics in a fake, because the
// thing worth protecting is the shape of the coverage query: loosen
// it to an overlap test or forget the cancelled exclusion and the
// engine starts suppressing real bookings, which no amount of
// in-memory row matching would reveal.

function event(overrides: Partial<ParsedEvent> = {}): ParsedEvent {
  return {
    uid: "airbnb-uid-1",
    summary: "Reserved",
    description: "",
    start: new Date("2027-01-10T00:00:00.000Z"),
    end: new Date("2027-01-14T00:00:00.000Z"),
    ...overrides,
  };
}

function makePrisma(opts: {
  existing?: { id: string; grossAmount: number } | null;
  pmsHeld?: { id: string } | null;
}) {
  const findUnique = vi.fn().mockResolvedValue(opts.existing ?? null);
  const findFirst = vi.fn().mockResolvedValue(opts.pmsHeld ?? null);
  const create = vi.fn().mockResolvedValue({ id: "created-1" });
  const update = vi.fn().mockResolvedValue({});
  const prisma = {
    booking: { findUnique, findFirst, create, update },
  } as unknown as PrismaClient;
  return { prisma, findUnique, findFirst, create, update };
}

const baseArgs = {
  propertyId: "prop-1",
  source: "AIRBNB" as const,
  currency: "KES",
};

describe("syncIcalEvents, coverage by a PMS booking", () => {
  it("imports a stay no booking holds yet", async () => {
    const { prisma, create } = makePrisma({});
    const result = await syncIcalEvents({
      prisma,
      ...baseArgs,
      events: [event()],
    });

    expect(result.imported).toBe(1);
    expect(result.skippedPmsCovered).toBe(0);
    expect(result.createdBookingIds).toEqual(["created-1"]);
    expect(create).toHaveBeenCalledOnce();
    expect(create.mock.calls[0][0].data).toMatchObject({
      propertyId: "prop-1",
      externalId: "ical:AIRBNB:airbnb-uid-1",
      grossAmount: 0,
    });
  });

  it("writes no second row when a PMS booking already holds the stay", async () => {
    const { prisma, create } = makePrisma({ pmsHeld: { id: "hostaway-1" } });
    const result = await syncIcalEvents({
      prisma,
      ...baseArgs,
      events: [event()],
    });

    expect(result.skippedPmsCovered).toBe(1);
    expect(result.imported).toBe(0);
    expect(result.createdBookingIds).toEqual([]);
    expect(create).not.toHaveBeenCalled();
  });

  it("scopes the coverage query to the same stay, and excludes cancelled and iCal rows", async () => {
    const { prisma, findFirst } = makePrisma({});
    await syncIcalEvents({ prisma, ...baseArgs, events: [event()] });

    const where = findFirst.mock.calls[0][0].where;
    expect(where).toMatchObject({
      propertyId: "prop-1",
      source: "AIRBNB",
      checkIn: new Date("2027-01-10T00:00:00.000Z"),
      checkOut: new Date("2027-01-14T00:00:00.000Z"),
      status: { not: "CANCELLED" },
    });
    // Exact dates, not a range: an overlap test would match the
    // neighbouring stay whose check-in is this stay's checkout.
    expect(where.checkIn).toBeInstanceOf(Date);
    expect(where.checkOut).toBeInstanceOf(Date);
    // Rows this engine imported must not count as coverage, or the
    // feed would suppress its own placeholders. Manual rows carry a
    // null externalId and have to be matched explicitly.
    expect(where.OR).toEqual([
      { externalId: null },
      { externalId: { not: { startsWith: "ical:" } } },
    ]);
  });

  it("does not pay for the coverage query when our own row already exists", async () => {
    const { prisma, findFirst, update } = makePrisma({
      existing: { id: "ical-1", grossAmount: 0 },
    });
    const result = await syncIcalEvents({
      prisma,
      ...baseArgs,
      events: [event()],
    });

    expect(result.refreshed).toBe(1);
    expect(update).toHaveBeenCalledOnce();
    expect(findFirst).not.toHaveBeenCalled();
  });
});

describe("syncIcalEvents, existing behaviour", () => {
  it("refreshes dates without touching financials the operator backfilled", async () => {
    const { prisma, update } = makePrisma({
      existing: { id: "ical-1", grossAmount: 40_000 },
    });
    const result = await syncIcalEvents({
      prisma,
      ...baseArgs,
      events: [event()],
    });

    expect(result.skippedExisting).toBe(1);
    expect(result.refreshed).toBe(0);
    const data = update.mock.calls[0][0].data;
    expect(data).toMatchObject({ nights: 4, status: "CONFIRMED" });
    expect(data).not.toHaveProperty("grossAmount");
    expect(data).not.toHaveProperty("netPayout");
  });

  it("skips calendar blocks before doing any lookup", async () => {
    const { prisma, findUnique, findFirst } = makePrisma({});
    const result = await syncIcalEvents({
      prisma,
      ...baseArgs,
      events: [
        event({ summary: "Airbnb (Not available)" }),
        event({ summary: "Blocked" }),
      ],
    });

    expect(result.skippedBlocks).toBe(2);
    expect(result.imported).toBe(0);
    expect(findUnique).not.toHaveBeenCalled();
    expect(findFirst).not.toHaveBeenCalled();
  });

  it("ignores an event whose dates produce no nights", async () => {
    const { prisma, create } = makePrisma({});
    const result = await syncIcalEvents({
      prisma,
      ...baseArgs,
      events: [
        event({ end: new Date("2027-01-10T00:00:00.000Z") }),
      ],
    });

    expect(result.imported).toBe(0);
    expect(create).not.toHaveBeenCalled();
  });
});
