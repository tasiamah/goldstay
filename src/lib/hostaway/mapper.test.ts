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
  totalPrice: 40000,
  currency: "KES",
  channelCommissionAmount: 1200,
  hostPayout: 33800,
  cleaningFee: 5000,
};

describe("mapHostawayReservation", () => {
  it("maps a normal Airbnb reservation", () => {
    const out = mapHostawayReservation(base)!;
    expect(out.externalId).toBe("12345");
    expect(out.source).toBe("AIRBNB");
    expect(out.status).toBe("CONFIRMED");
    expect(out.nights).toBe(4);
    expect(out.checkIn.toISOString()).toBe("2026-03-10T00:00:00.000Z");
    expect(out.netPayout).toBe(33800);
    expect(out.currency).toBe("KES");
    expect(out.hostawayListingId).toBe("999");
  });

  it("derives netPayout when hostPayout is missing", () => {
    const out = mapHostawayReservation({
      ...base,
      hostPayout: undefined,
    })!;
    // 40000 - 1200 - 5000 = 33800
    expect(out.netPayout).toBe(33800);
  });

  it("returns null when essential fields are missing", () => {
    expect(mapHostawayReservation({ ...base, id: undefined })).toBeNull();
    expect(
      mapHostawayReservation({ ...base, listingMapId: undefined }),
    ).toBeNull();
    expect(
      mapHostawayReservation({ ...base, arrivalDate: undefined }),
    ).toBeNull();
  });

  it("rejects same-day or inverted stays", () => {
    expect(
      mapHostawayReservation({
        ...base,
        arrivalDate: "2026-03-10",
        departureDate: "2026-03-10",
      }),
    ).toBeNull();
  });

  it("falls back to DIRECT when channel id is unknown", () => {
    const out = mapHostawayReservation({
      ...base,
      channelId: 9999,
      channelName: "mystery",
    })!;
    expect(out.source).toBe("DIRECT");
  });

  it("maps cancelled / declined / expired statuses to CANCELLED", () => {
    for (const status of ["cancelled", "declined", "expired"]) {
      const out = mapHostawayReservation({ ...base, status })!;
      expect(out.status).toBe("CANCELLED");
    }
  });

  it("handles string-typed numeric fields", () => {
    const out = mapHostawayReservation({
      ...base,
      totalPrice: "40000.00",
      channelCommissionAmount: "1200.00",
    })!;
    expect(out.grossAmount).toBe(40000);
    expect(out.otaCommission).toBe(1200);
  });
});
