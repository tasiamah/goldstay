import type { PrismaClient } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ingestHostawayReservation } from "@/lib/hostaway/ingest";

vi.mock("@/lib/bookings/notify", () => ({
  notifyClientOfBooking: vi.fn(async () => undefined),
}));

const reservation = {
  id: 9001,
  listingMapId: 594702,
  channelId: 2018,
  status: "new",
  guestName: "Asha",
  arrivalDate: "2026-09-13",
  departureDate: "2026-09-19",
  totalPrice: 60_000,
  currency: "KES",
  channelCommissionAmount: 1_800,
};

const checkIn = new Date("2026-09-13T00:00:00.000Z");
const checkOut = new Date("2026-09-19T00:00:00.000Z");

type Doubles = {
  placeholders: { id: string; _count: { transactions: number } }[];
  existing: { id: string } | null;
};

function makePrisma({ placeholders, existing }: Doubles) {
  const deleteMany = vi.fn(async () => ({ count: placeholders.length }));
  const findMany = vi.fn(
    async (_args: { where: Record<string, unknown> }) => placeholders,
  );
  const upsert = vi.fn(async () => ({
    id: "bk_real",
    transactions: [] as { id: string }[],
  }));
  const txCreate = vi.fn((args: unknown) => args);

  const prisma = {
    property: {
      findUnique: vi.fn(async () => ({
        id: "prop_polaris",
        cleaningFeePerStay: null,
      })),
    },
    booking: {
      findUnique: vi.fn(async () => existing),
      upsert,
      findMany,
      deleteMany,
    },
    transaction: { create: txCreate },
    $transaction: vi.fn(async (ops: unknown[]) => ops),
  } as unknown as PrismaClient;

  return { prisma, upsert, findMany, deleteMany, txCreate };
}

beforeEach(() => vi.clearAllMocks());

describe("ingestHostawayReservation", () => {
  it("deletes the zero-gross iCal placeholder covering the same stay", async () => {
    const { prisma, findMany, deleteMany } = makePrisma({
      placeholders: [{ id: "bk_ical", _count: { transactions: 0 } }],
      existing: null,
    });

    const result = await ingestHostawayReservation({
      prisma,
      reservation,
      notify: false,
    });

    expect(result).toMatchObject({
      status: "ingested",
      placeholdersRemoved: 1,
    });
    expect(deleteMany).toHaveBeenCalledWith({
      where: { id: { in: ["bk_ical"] } },
    });

    // Exact dates, not an overlap. Back-to-back stays share a date,
    // so an overlap match would take the neighbour's placeholder too.
    const where = findMany.mock.calls[0][0].where;
    expect(where.checkIn).toEqual(checkIn);
    expect(where.checkOut).toEqual(checkOut);
    expect(where.grossAmount).toBe(0);
    expect(where.id).toEqual({ not: "bk_real" });
  });

  it("keeps a placeholder somebody has already reconciled by hand", async () => {
    const { prisma, deleteMany } = makePrisma({
      placeholders: [{ id: "bk_touched", _count: { transactions: 3 } }],
      existing: null,
    });

    const result = await ingestHostawayReservation({
      prisma,
      reservation,
      notify: false,
    });

    expect(result).toMatchObject({ placeholdersRemoved: 0 });
    expect(deleteMany).not.toHaveBeenCalled();
  });

  it("leaves placeholders alone when superseding is off", async () => {
    const { prisma, findMany } = makePrisma({
      placeholders: [{ id: "bk_ical", _count: { transactions: 0 } }],
      existing: null,
    });

    await ingestHostawayReservation({
      prisma,
      reservation,
      notify: false,
      supersedePlaceholders: false,
    });

    expect(findMany).not.toHaveBeenCalled();
  });

  it("writes gross, OTA fee, cleaning and commission on first ingest", async () => {
    const { prisma, txCreate } = makePrisma({
      placeholders: [],
      existing: null,
    });

    const result = await ingestHostawayReservation({
      prisma,
      reservation,
      notify: false,
    });

    expect(result).toMatchObject({ transactionsCreated: 4 });
    const types = txCreate.mock.calls.map(
      (c) => (c[0] as { data: { type: string } }).data.type,
    );
    expect(types).toEqual([
      "RENT",
      "OTA_COMMISSION",
      "CLEANING_FEE",
      "GOLDSTAY_COMMISSION",
    ]);

    // 20% of 60,000 gross, deducted without anyone writing the row.
    const commission = txCreate.mock.calls
      .map((c) => (c[0] as { data: { type: string; amount: number } }).data)
      .find((d) => d.type === "GOLDSTAY_COMMISSION");
    expect(commission?.amount).toBe(12_000);

    // Hostaway itemised no cleaning, so the standard KES rate stood in.
    const cleaning = txCreate.mock.calls
      .map((c) => (c[0] as { data: { type: string; amount: number } }).data)
      .find((d) => d.type === "CLEANING_FEE");
    expect(cleaning?.amount).toBe(1_030);

    // All dated to check-in, so a stay spanning a month end lands in
    // the same month as the short-stay table reports it.
    const dates = txCreate.mock.calls.map(
      (c) => (c[0] as { data: { occurredOn: Date } }).data.occurredOn,
    );
    expect(dates.every((d) => d.getTime() === checkIn.getTime())).toBe(true);
  });

  it("does not email the owner when backfilling a finished stay", async () => {
    const { notifyClientOfBooking } = await import("@/lib/bookings/notify");
    const { prisma } = makePrisma({ placeholders: [], existing: null });

    await ingestHostawayReservation({ prisma, reservation, notify: false });
    expect(notifyClientOfBooking).not.toHaveBeenCalled();

    await ingestHostawayReservation({ prisma, reservation, notify: true });
    expect(notifyClientOfBooking).toHaveBeenCalledWith("bk_real", "received");
  });

  it("reports a listing we do not manage instead of throwing", async () => {
    const prisma = {
      property: { findUnique: vi.fn(async () => null) },
    } as unknown as PrismaClient;

    const result = await ingestHostawayReservation({
      prisma,
      reservation,
      notify: false,
    });
    expect(result).toEqual({
      status: "unknown_listing",
      listingId: "594702",
    });
  });

  it("reports an unmappable payload rather than writing a partial booking", async () => {
    const prisma = {
      property: { findUnique: vi.fn() },
    } as unknown as PrismaClient;

    const result = await ingestHostawayReservation({
      prisma,
      reservation: { id: 1 },
      notify: false,
    });
    expect(result).toEqual({ status: "unmappable" });
  });
});
