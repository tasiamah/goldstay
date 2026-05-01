import { describe, expect, it } from "vitest";
import { mapHostawayReservation } from "./mapper";

const base = {
  id: 12345,
  channelId: 2018,
  status: "new",
  listingMapId: 999,
  guestName: "Alex Owino",
  guestEmail: "alex@example.com",
  arrivalDate: "2026-03-10",
  departureDate: "2026-03-14",
  nights: 4,
  totalPrice: 40_000,
  currency: "KES",
  channelCommissionAmount: 1_200,
  hostPayout: 33_800,
  cleaningFee: 5_000,
};

// Hostaway → internal Booking mapper. Third-party data again, so the
// risk profile is: missing fields must produce null (not a crashing
// half-row), inverted dates must produce null (would corrupt
// occupancy), and money fields that arrive as strings must coerce
// before being stored as Decimals.

describe("mapHostawayReservation", () => {
  it("maps a normal reservation, coercing string-typed money fields", () => {
    const out = mapHostawayReservation({
      ...base,
      totalPrice: "40000.00",
      channelCommissionAmount: "1200.00",
    })!;
    expect(out).toMatchObject({
      externalId: "12345",
      source: "AIRBNB",
      status: "CONFIRMED",
      nights: 4,
      grossAmount: 40_000,
      otaCommission: 1_200,
      netPayout: 33_800,
      currency: "KES",
      hostawayListingId: "999",
    });
    expect(out.checkIn.toISOString()).toBe("2026-03-10T00:00:00.000Z");
  });

  it("returns null when essential fields are missing or stays are inverted, and folds cancel-states", () => {
    expect(mapHostawayReservation({ ...base, id: undefined })).toBeNull();
    expect(mapHostawayReservation({ ...base, listingMapId: undefined })).toBeNull();
    expect(
      mapHostawayReservation({ ...base, arrivalDate: "2026-03-10", departureDate: "2026-03-10" }),
    ).toBeNull();
    for (const status of ["cancelled", "declined", "expired"]) {
      expect(mapHostawayReservation({ ...base, status })!.status).toBe("CANCELLED");
    }
  });

  it("derives netPayout from gross - commission - cleaning when hostPayout is missing", () => {
    expect(
      mapHostawayReservation({ ...base, hostPayout: undefined })!.netPayout,
    ).toBe(33_800);
  });
});
