import { describe, expect, it } from "vitest";
import {
  bookedNightsInPeriod,
  revenueTotalsByCurrency,
  type BookingLike,
} from "./aggregate";

const utc = (s: string) => new Date(`${s}T00:00:00.000Z`);

const bk = (overrides: Partial<BookingLike>): BookingLike => ({
  checkIn: utc("2026-01-05"),
  checkOut: utc("2026-01-10"),
  nights: 5,
  grossAmount: 50_000,
  otaCommission: 1_500,
  cleaningFee: 5_000,
  netPayout: 43_500,
  currency: "KES",
  status: "CONFIRMED",
  ...overrides,
});

const january = { start: utc("2026-01-01"), end: utc("2026-02-01") };

// Short-stay aggregator. The two failure modes that matter:
//   - boundary clipping (a booking spanning Jan→Feb must contribute
//     only its in-period nights, otherwise occupancy + revenue are
//     double-counted), and
//   - status / period filtering applying to revenue too, not just
//     occupancy. Cancelled-but-collected money is the classic bug.
// Smaller helpers (nightsBetween, occupancyPercentForPeriod) are
// exercised transitively here.

describe("bookedNightsInPeriod", () => {
  it("clips straddling bookings and filters cancelled / out-of-period", () => {
    const straddling = bk({
      checkIn: utc("2026-01-28"),
      checkOut: utc("2026-02-04"),
      nights: 7,
    });
    const cancelled = bk({ status: "CANCELLED" });
    const before = bk({
      checkIn: utc("2025-12-20"),
      checkOut: utc("2025-12-27"),
    });
    expect(
      bookedNightsInPeriod([straddling, cancelled, before, bk({})], january),
    ).toBe(4 + 5);
  });
});

describe("revenueTotalsByCurrency", () => {
  it("buckets by currency and ignores cancelled / out-of-period rows", () => {
    const rows = revenueTotalsByCurrency(
      [
        bk({ currency: "KES", grossAmount: 50_000, netPayout: 43_500 }),
        bk({ currency: "KES", grossAmount: 80_000, netPayout: 70_000 }),
        bk({
          currency: "USD",
          grossAmount: 400,
          otaCommission: 12,
          cleaningFee: 40,
          netPayout: 348,
        }),
        bk({ status: "CANCELLED" }),
      ],
      january,
    );
    const kes = rows.find((r) => r.currency === "KES")!;
    expect(kes.bookings).toBe(2);
    expect(kes.gross).toBe(130_000);
    expect(kes.netPayout).toBe(113_500);
    expect(rows).toHaveLength(2);
  });
});
