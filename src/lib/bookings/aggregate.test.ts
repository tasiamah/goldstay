import { describe, expect, it } from "vitest";
import {
  bookedNightsInPeriod,
  occupancyPercentForPeriod,
  revenueTotalsByCurrency,
  type BookingLike,
} from "./aggregate";
import { nightsBetween } from "./nights";

const utc = (s: string) => new Date(`${s}T00:00:00.000Z`);

const bk = (overrides: Partial<BookingLike>): BookingLike => ({
  checkIn: utc("2026-01-05"),
  checkOut: utc("2026-01-10"),
  nights: 5,
  grossAmount: 50000,
  otaCommission: 1500,
  cleaningFee: 5000,
  netPayout: 43500,
  currency: "KES",
  status: "CONFIRMED",
  ...overrides,
});

const january = { start: utc("2026-01-01"), end: utc("2026-02-01") };

describe("nightsBetween", () => {
  it("counts midnights crossed and returns 0 for non-positive intervals", () => {
    expect(nightsBetween(utc("2026-01-05"), utc("2026-01-10"))).toBe(5);
    expect(nightsBetween(utc("2026-01-05"), utc("2026-01-05"))).toBe(0);
    expect(nightsBetween(utc("2026-01-10"), utc("2026-01-05"))).toBe(0);
  });
});

describe("bookedNightsInPeriod", () => {
  it("clips bookings that straddle the period boundary", () => {
    const straddling = bk({
      checkIn: utc("2026-01-28"),
      checkOut: utc("2026-02-04"),
      nights: 7,
    });
    expect(bookedNightsInPeriod([straddling], january)).toBe(4);
  });

  it("excludes cancelled bookings", () => {
    const ok = bk({});
    const cancelled = bk({ status: "CANCELLED" });
    expect(bookedNightsInPeriod([ok, cancelled], january)).toBe(5);
  });

  it("ignores bookings entirely outside the window", () => {
    const before = bk({
      checkIn: utc("2025-12-20"),
      checkOut: utc("2025-12-27"),
      nights: 7,
    });
    expect(bookedNightsInPeriod([before], january)).toBe(0);
  });
});

describe("occupancyPercentForPeriod", () => {
  it("returns a rounded integer percentage", () => {
    // 5 booked nights of 31 January nights = 16.13% → 16
    expect(occupancyPercentForPeriod([bk({})], january)).toBe(16);
  });
});

describe("revenueTotalsByCurrency", () => {
  it("buckets bookings by currency and sums all components", () => {
    const rows = revenueTotalsByCurrency(
      [
        bk({ currency: "KES", grossAmount: 50000, netPayout: 43500 }),
        bk({ currency: "KES", grossAmount: 80000, netPayout: 70000 }),
        bk({
          currency: "USD",
          grossAmount: 400,
          otaCommission: 12,
          cleaningFee: 40,
          netPayout: 348,
        }),
      ],
      january,
    );
    expect(rows).toHaveLength(2);
    const kes = rows.find((r) => r.currency === "KES")!;
    expect(kes.bookings).toBe(2);
    expect(kes.gross).toBe(130000);
    expect(kes.netPayout).toBe(113500);
  });

  it("skips cancelled and out-of-period bookings", () => {
    const rows = revenueTotalsByCurrency(
      [
        bk({ status: "CANCELLED" }),
        bk({
          checkIn: utc("2025-12-01"),
          checkOut: utc("2025-12-07"),
          nights: 6,
        }),
      ],
      january,
    );
    expect(rows).toEqual([]);
  });
});
