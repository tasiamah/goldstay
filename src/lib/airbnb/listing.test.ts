import { describe, expect, it } from "vitest";
import {
  EXTRACT_FAILURE_MESSAGE,
  extractListing,
  parseAirbnbRoomId,
  roomCountsFromOgTitle,
} from "./listing";

// Fixture rather than a live request. Hitting Airbnb from CI would be
// flaky and impolite, and the thing worth testing is the parsing, not
// whether their servers were up. Shape copied from a real listing page
// on 10 Sep 2026, trimmed to the two blocks the parser reads.
function page(opts: {
  jsonLd?: string;
  ogTitle?: string;
  extra?: string;
}): string {
  return `<!DOCTYPE html><html><head>
<meta property="og:title" content="${opts.ogTitle ?? "Rental unit in Nairobi · ★4.88 · 2 bedrooms · 2 beds · 1 bath"}"/>
${opts.jsonLd ?? ""}
</head><body>${opts.extra ?? ""}</body></html>`;
}

const VACATION_RENTAL = `<script type="application/ld+json">${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "VacationRental",
  name: "Bright 2BR in Kilimani with backup power",
  description: "Quiet corner unit with a balcony and a generator.",
  image: [
    "https://a0.muscache.com/im/pictures/one.jpg",
    "https://a0.muscache.com/im/pictures/two.jpg",
  ],
  containsPlace: {
    "@type": "Accommodation",
    occupancy: { "@type": "QuantitativeValue", value: 4 },
  },
  latitude: -1.2921,
  longitude: 36.7833,
  address: { addressLocality: "Nairobi" },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.88,
    ratingCount: "63",
  },
})}</script>`;

describe("parseAirbnbRoomId", () => {
  it("reads the id from the shapes people actually paste", () => {
    const cases: [string, string][] = [
      ["https://www.airbnb.com/rooms/12345678", "12345678"],
      ["https://airbnb.com/rooms/12345678", "12345678"],
      ["https://www.airbnb.com/rooms/plus/12345678", "12345678"],
      ["https://www.airbnb.co.uk/rooms/12345678", "12345678"],
      ["https://www.airbnb.com/fr/rooms/12345678", "12345678"],
      [
        "https://www.airbnb.com/rooms/12345678?source_impression_id=p3_169&check_in=2026-10-01",
        "12345678",
      ],
      ["  https://www.airbnb.com/rooms/12345678  ", "12345678"],
    ];
    for (const [input, expected] of cases) {
      expect(parseAirbnbRoomId(input), input).toBe(expected);
    }
  });

  it("refuses anything that is not an Airbnb listing URL", () => {
    const rejected = [
      "https://www.booking.com/hotel/ke/x.html",
      "https://www.airbnb.com/users/show/12345",
      "https://www.airbnb.com/s/Nairobi/homes",
      "not a url at all",
      "",
      // Deliberately unsupported: resolving it needs a second request
      // and the error would be baffling. Better to say so.
      "https://abnb.me/abc123",
    ];
    for (const input of rejected) {
      expect(parseAirbnbRoomId(input), input).toBeNull();
    }
  });

  it("is not fooled by an airbnb-looking hostname", () => {
    // The check has to be on the host, not on the string containing
    // "airbnb", or a lookalike domain gets treated as trusted.
    expect(parseAirbnbRoomId("https://airbnb.com.evil.co/rooms/1")).toBeNull();
    expect(parseAirbnbRoomId("https://notairbnb.com/rooms/1")).toBeNull();
  });
});

describe("roomCountsFromOgTitle", () => {
  it("reads bedrooms, beds and baths from the standard format", () => {
    expect(
      roomCountsFromOgTitle(
        "Treehouse in Aptos · ★4.91 · 3 bedrooms · 3 beds · 1 bath",
      ),
    ).toEqual({ bedrooms: 3, beds: 3, bathrooms: 1 });
  });

  it("treats a studio as zero bedrooms, not as unknown", () => {
    // Zero renders as "studio" in a listing. Null renders as "to be
    // confirmed" in a contract. They are not the same claim.
    expect(
      roomCountsFromOgTitle("Rental unit in Nairobi · ★New · Studio · 1 bed · 1 bath"),
    ).toEqual({ bedrooms: 0, beds: 1, bathrooms: 1 });
  });

  it("handles singulars, halves and shared baths", () => {
    expect(
      roomCountsFromOgTitle("Condo in Westlands · ★5.0 · 1 bedroom · 1 bed · 1.5 baths"),
    ).toEqual({ bedrooms: 1, beds: 1, bathrooms: 1.5 });
    expect(
      roomCountsFromOgTitle("Room in Karen · ★4.7 · 1 bedroom · 2 beds · 2 shared baths"),
    ).toEqual({ bedrooms: 1, beds: 2, bathrooms: 2 });
  });

  it("returns null rather than a guess when a segment is missing", () => {
    // A wrong bedroom count reaches a management agreement. An empty
    // field only reaches an admin.
    expect(roomCountsFromOgTitle("Rental unit in Nairobi · ★New")).toEqual({
      bedrooms: null,
      beds: null,
      bathrooms: null,
    });
    expect(roomCountsFromOgTitle(null)).toEqual({
      bedrooms: null,
      beds: null,
      bathrooms: null,
    });
  });
});

describe("extractListing", () => {
  it("pulls the fields the property form needs", () => {
    const result = extractListing(page({ jsonLd: VACATION_RENTAL }), "999");
    expect(result.kind).toBe("ok");
    if (result.kind !== "ok") return;

    const l = result.listing;
    expect(l.name).toBe("Bright 2BR in Kilimani with backup power");
    expect(l.description).toContain("balcony");
    expect(l.images).toHaveLength(2);
    expect(l.maxOccupancy).toBe(4);
    expect(l.bedrooms).toBe(2);
    expect(l.bathrooms).toBe(1);
    expect(l.locality).toBe("Nairobi");
    expect(l.latitude).toBeCloseTo(-1.2921);
    expect(l.rating).toBe(4.88);
    // Airbnb ships ratingCount as a string. Coerced, because a review
    // count that is sometimes "63" and sometimes 63 breaks arithmetic
    // at the call site rather than here.
    expect(l.reviewCount).toBe(63);
    expect(l.url).toBe("https://www.airbnb.com/rooms/999");
  });

  it("reports a bot wall as blocked, not as a missing listing", () => {
    // Airbnb serves the wall with a 200. Getting this wrong sends an
    // admin looking for a problem with a listing that is fine.
    const result = extractListing(
      page({ extra: "<div id='px-captcha'></div>" }),
      "999",
    );
    expect(result.kind).toBe("error");
    if (result.kind !== "error") return;
    expect(result.reason).toBe("blocked");
  });

  it("reports a page with no structured data", () => {
    const result = extractListing(page({}), "999");
    expect(result.kind).toBe("error");
    if (result.kind !== "error") return;
    expect(result.reason).toBe("no_structured_data");
  });

  it("survives a malformed block sitting next to a good one", () => {
    const html = page({
      jsonLd: `<script type="application/ld+json">{not json</script>${VACATION_RENTAL}`,
    });
    const result = extractListing(html, "999");
    expect(result.kind).toBe("ok");
  });

  it("falls back to the Product block when VacationRental is absent", () => {
    const productOnly = `<script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Studio in Riverside",
      description: "Compact and central.",
      image: ["https://a0.muscache.com/im/pictures/x.jpg"],
    })}</script>`;
    const result = extractListing(page({ jsonLd: productOnly }), "42");
    expect(result.kind).toBe("ok");
    if (result.kind !== "ok") return;
    expect(result.listing.name).toBe("Studio in Riverside");
    // Only VacationRental carries these, so they stay null rather
    // than being invented from the Product block.
    expect(result.listing.latitude).toBeNull();
    expect(result.listing.maxOccupancy).toBeNull();
  });
});

describe("failure messages", () => {
  it("has a sentence an operator can act on for every failure code", () => {
    for (const [code, message] of Object.entries(EXTRACT_FAILURE_MESSAGE)) {
      expect(message.length, code).toBeGreaterThan(30);
      expect(message, code).not.toContain("_");
      expect(message[0], code).toBe(message[0].toUpperCase());
    }
  });
});
