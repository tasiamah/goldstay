import { describe, expect, it } from "vitest";
import {
  extractReservation,
  isNonBooking,
  mapHostawayReservation,
} from "./mapper";

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
    // declined and expired are no longer folded in here: they never
    // became a stay, so isNonBooking rejects them before mapping.
    expect(
      mapHostawayReservation({ ...base, status: "cancelled" })!.status,
    ).toBe("CANCELLED");
  });

  it("derives netPayout from gross - commission - cleaning when hostPayout is missing", () => {
    expect(
      mapHostawayReservation({ ...base, hostPayout: undefined })!.netPayout,
    ).toBe(33_800);
  });
});

// Envelope handling is separate from field mapping because Hostaway
// does not publish the webhook payload schema. A unified webhook
// posts the reservation under `data`; reading the wrong key does not
// throw, it silently maps to null and the booking never arrives,
// which is the worst possible failure mode for revenue data.

describe("extractReservation", () => {
  it("reads the reservation out of a unified webhook envelope", () => {
    const out = extractReservation({
      event: "reservation.created",
      accountId: 10638,
      data: base,
    });
    expect(out).toMatchObject({ id: 12345, listingMapId: 999 });
    expect(mapHostawayReservation(out!)!.hostawayListingId).toBe("999");
  });

  it("still accepts the legacy `reservation` key and a flat body", () => {
    expect(
      extractReservation({ event: "reservation.updated", reservation: base }),
    ).toMatchObject({ id: 12345 });
    expect(
      extractReservation({ event: "reservation.created", ...base }),
    ).toMatchObject({ id: 12345 });
    // No envelope at all, as the earlier implementation assumed.
    expect(extractReservation(base)).toMatchObject({ id: 12345 });
  });

  it("ignores message events, which share the same webhook", () => {
    expect(
      extractReservation({
        event: "message.received",
        data: { id: 7, conversationId: 42, body: "What time is check-in?" },
      }),
    ).toBeNull();
    expect(
      extractReservation({ event: "conversationMessage.received", data: {} }),
    ).toBeNull();
  });

  it("returns null for shapes that carry nothing mappable", () => {
    expect(extractReservation(null)).toBeNull();
    expect(extractReservation("a string")).toBeNull();
    expect(extractReservation([base])).toBeNull();
  });
});

// Shapes below are taken from real Airbnb reservations on Hostaway
// account 212175, listing 594702.
describe("isNonBooking", () => {
  it("rejects enquiries, which carry a price but were never booked", () => {
    for (const status of [
      "inquiry",
      "inquiryPreapproved",
      "inquiryDenied",
      "expired",
      "declined",
    ]) {
      expect(isNonBooking({ status })).toBe(true);
    }
  });

  it("accepts the statuses that mean a stay exists", () => {
    for (const status of ["new", "modified", "ownerStay", "cancelled"]) {
      expect(isNonBooking({ status })).toBe(false);
    }
  });
});

describe("mapHostawayReservation — Airbnb payout fields", () => {
  const airbnb = {
    id: 66657497,
    listingMapId: 594702,
    channelId: 2018,
    status: "new",
    guestName: "",
    arrivalDate: "2026-09-13",
    departureDate: "2026-09-19",
    nights: 6,
    totalPrice: 240,
    currency: "USD",
    // Null on every booking in this account, which is exactly why it
    // cannot be the source of the fee.
    channelCommissionAmount: null as number | null,
    airbnbExpectedPayoutAmount: 182.99,
  };

  it("takes the channel's cut as guest paid minus host payout", () => {
    const mapped = mapHostawayReservation(airbnb)!;
    expect(mapped.grossAmount).toBe(240);
    expect(mapped.otaCommission).toBe(57.01);
    expect(mapped.netPayout).toBe(182.99);
    // The figures have to reconcile or the statement column will not
    // add up for the owner reading it.
    expect(mapped.grossAmount - mapped.otaCommission).toBeCloseTo(
      mapped.netPayout,
      2,
    );
  });

  it("would have reported a zero fee from channelCommissionAmount alone", () => {
    const mapped = mapHostawayReservation({
      ...airbnb,
      airbnbExpectedPayoutAmount: undefined,
    })!;
    expect(mapped.otaCommission).toBe(0);
    expect(mapped.netPayout).toBe(240);
  });

  it("falls back to airbnbPayoutSum inside financeField", () => {
    const mapped = mapHostawayReservation({
      ...airbnb,
      airbnbExpectedPayoutAmount: undefined,
      financeField: [
        { name: "totalPaid", total: 240 },
        { name: "airbnbPayoutSum", total: 182.99 },
      ],
    })!;
    expect(mapped.otaCommission).toBe(57.01);
    expect(mapped.netPayout).toBe(182.99);
  });

  it("keeps two decimal places rather than a float tail", () => {
    const mapped = mapHostawayReservation({
      ...airbnb,
      totalPrice: 78.3,
      airbnbExpectedPayoutAmount: 61.81,
    })!;
    expect(mapped.otaCommission).toBe(16.49);
  });

  it("ignores a payout larger than the gross instead of inverting the fee", () => {
    const mapped = mapHostawayReservation({
      ...airbnb,
      airbnbExpectedPayoutAmount: 999,
    })!;
    expect(mapped.otaCommission).toBe(0);
    expect(mapped.netPayout).toBe(240);
  });
});
