import { describe, expect, it } from "vitest";
import {
  bookingNotificationTitle,
  bookingSubject,
  formatBookingDate,
  renderBookingHtml,
  renderBookingText,
  type BookingEmailInput,
} from "./booking-email";

const base: BookingEmailInput = {
  kind: "full",
  clientFirstName: "Wanjiru",
  propertyLabel: "Riverside Drive 2-bed",
  checkIn: new Date("2026-10-03T00:00:00.000Z"),
  checkOut: new Date("2026-10-08T00:00:00.000Z"),
  nights: 5,
  guestName: "Peter Muraya",
  netPayoutFormatted: "KES 48,000",
  channelLabel: "Airbnb",
  siteUrl: "https://goldstay.co.ke",
};

const sparse: BookingEmailInput = {
  ...base,
  kind: "sparse",
  guestName: "Reserved (Airbnb)",
  netPayoutFormatted: null,
};

const cancelled: BookingEmailInput = { ...base, kind: "cancelled" };

describe("formatBookingDate", () => {
  // Owners are split across Kenya, the UK and the US, who read
  // 03/10/2026 as two different days. The written month is the point.
  it("writes the month out rather than using an ambiguous numeric form", () => {
    expect(formatBookingDate(base.checkIn)).toBe("Sat, 3 Oct 2026");
  });

  // A date built at UTC midnight formatted in a behind-UTC zone slides
  // to the previous day, which would tell an owner the wrong check-in.
  it("does not drift a day when the runtime is not in UTC", () => {
    const original = process.env.TZ;
    try {
      process.env.TZ = "America/Los_Angeles";
      expect(formatBookingDate(new Date("2026-10-03T00:00:00.000Z"))).toContain(
        "3 Oct 2026",
      );
    } finally {
      process.env.TZ = original;
    }
  });
});

describe("bookingSubject", () => {
  it("leads with the property and the nights for a new booking", () => {
    expect(bookingSubject(base)).toBe(
      "New booking: Riverside Drive 2-bed, 5 nights from Sat, 3 Oct 2026",
    );
  });

  it("says cancelled first, so it is not misread as another booking", () => {
    expect(bookingSubject(cancelled)).toMatch(/^Booking cancelled: /);
  });

  it("does not say 1 nights", () => {
    expect(bookingSubject({ ...base, nights: 1 })).toContain("1 night from");
  });
});

describe("renderBookingText", () => {
  it("carries the guest, channel and payout for a full booking", () => {
    const text = renderBookingText(base);
    expect(text).toContain("Peter Muraya");
    expect(text).toContain("Airbnb");
    expect(text).toContain("KES 48,000");
    expect(text).toContain("Sat, 3 Oct 2026");
    expect(text).toContain("Thu, 8 Oct 2026");
  });

  // The whole reason the sparse variant exists. An iCal import knows
  // dates and nothing else, and every money field on the row is a
  // zero placeholder. Printing those would tell an owner they earned
  // nothing, which is worse than staying quiet about the amount.
  it("quotes no money at all on a sparse booking", () => {
    const text = renderBookingText(sparse);
    expect(text).not.toMatch(/KES|USD|Net to you/);
    expect(text).not.toMatch(/\b0(\.00)?\b/);
  });

  it("explains why the amount is missing rather than leaving a blank", () => {
    expect(renderBookingText(sparse)).toContain("channel calendar");
  });

  it("omits the placeholder guest name a sparse row carries", () => {
    expect(renderBookingText(sparse)).not.toContain("Reserved (Airbnb)");
  });

  it("omits the payout line when there is no payout to quote", () => {
    const text = renderBookingText({ ...base, netPayoutFormatted: null });
    expect(text).not.toContain("Net to you");
  });

  it("omits the guest line when the channel withheld the name", () => {
    const text = renderBookingText({ ...base, guestName: null });
    expect(text).not.toContain("Guest:");
  });

  // A cancellation that quotes a payout reads as though money is
  // still coming.
  it("quotes no payout on a cancellation and says the nights are free", () => {
    const text = renderBookingText(cancelled);
    expect(text).not.toContain("KES 48,000");
    expect(text).toContain("re-let");
  });

  it("falls back to a greeting rather than addressing nobody", () => {
    expect(renderBookingText({ ...base, clientFirstName: "" })).toContain(
      "Hi there,",
    );
  });

  it("links the portal", () => {
    expect(renderBookingText(base)).toContain("https://goldstay.co.ke/client");
  });
});

describe("renderBookingHtml", () => {
  it("escapes a hostile guest name instead of emitting markup", () => {
    const html = renderBookingHtml({
      ...base,
      guestName: '<script>alert("x")</script>',
    });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("escapes a hostile property name", () => {
    const html = renderBookingHtml({
      ...base,
      propertyLabel: '<img src=x onerror="alert(1)">',
    });
    expect(html).not.toContain("<img");
  });

  it("shows no money rows on a sparse booking", () => {
    const html = renderBookingHtml(sparse);
    expect(html).not.toContain("Net to you");
    expect(html).not.toContain("Reserved (Airbnb)");
  });

  it("shows no money rows on a cancellation", () => {
    expect(renderBookingHtml(cancelled)).not.toContain("Net to you");
  });

  it("leaves no unsubstituted template holes", () => {
    for (const input of [base, sparse, cancelled]) {
      expect(renderBookingHtml(input)).not.toMatch(/undefined|\[object|NaN/);
    }
  });

  it("keeps the text and html telling the same story", () => {
    for (const input of [base, sparse, cancelled]) {
      const html = renderBookingHtml(input);
      const text = renderBookingText(input);
      const cancelledCopy = /cancelled/i;
      expect(cancelledCopy.test(html)).toBe(cancelledCopy.test(text));
    }
  });
});

describe("bookingNotificationTitle", () => {
  it("distinguishes a booking from a cancellation at a glance", () => {
    expect(bookingNotificationTitle(base)).toMatch(/^Booked: /);
    expect(bookingNotificationTitle(cancelled)).toMatch(/^Cancelled: /);
  });

  it("carries both dates, since the bell row has no body", () => {
    const title = bookingNotificationTitle(base);
    expect(title).toContain("Sat, 3 Oct 2026");
    expect(title).toContain("Thu, 8 Oct 2026");
  });
});
