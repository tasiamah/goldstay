import { describe, expect, it } from "vitest";
import {
  extractNextData,
  findAirbnbListings,
  toRawListing,
} from "./airbnb";

// Single fixture exercises both shapes Airbnb has historically used
// for the per-host listings count (`listingsCount` and the older
// `numberOfListings`). Keeps one test honest about parser breadth
// without spawning a separate fallback test.
const synthetic = {
  props: {
    pageProps: {
      sections: [
        {
          items: [
            {
              listing: {
                id: "12345",
                name: "Cozy 2BR in Kilimani",
                bedrooms: 2,
                neighborhood: "Kilimani",
                avgRatingLocalized: "4.62",
                reviewsCount: 18,
                user: { smartName: "Asha", listingsCount: 1 },
              },
              pricingQuote: { rate: { amount: 60, currency: "USD" } },
            },
            {
              listing: {
                id: "67890",
                name: "Westlands Pad",
                bedrooms: 1,
                user: { smartName: "Beatrice", numberOfListings: 12 },
              },
              pricingQuote: { rate: { amount: 45, currency: "USD" } },
            },
          ],
        },
      ],
    },
  },
};

describe("Airbnb scraper parsers", () => {
  it("extracts, finds and normalises a listing end-to-end", () => {
    const html = `<script id="__NEXT_DATA__" type="application/json">${JSON.stringify(
      synthetic,
    )}</script>`;
    const data = extractNextData(html);
    const found = findAirbnbListings(data);
    expect(found).toHaveLength(2);

    const first = toRawListing(
      found.find((f) => f.listing.id === "12345")!,
      "Nairobi",
    );
    expect(first).toMatchObject({
      source: "Airbnb",
      url: "https://www.airbnb.com/rooms/12345",
      city: "Nairobi",
      neighbourhood: "Kilimani",
      title: "Cozy 2BR in Kilimani",
      listerName: "Asha",
      listerListingCount: 1,
      // 60 USD/night × 30 × 0.6 occupancy = 1080 implied monthly USD.
      askingPriceUsd: 1080,
    });
    expect(first?.notes).toContain("4.62");

    // Same fixture proves the legacy `numberOfListings` field is also read.
    const second = toRawListing(
      found.find((f) => f.listing.id === "67890")!,
      "Nairobi",
    );
    expect(second?.listerListingCount).toBe(12);
  });

  it("returns null when the __NEXT_DATA__ blob is missing or malformed", () => {
    expect(extractNextData("<html>nothing</html>")).toBeNull();
    expect(
      extractNextData(
        `<script id="__NEXT_DATA__" type="application/json">not-json</script>`,
      ),
    ).toBeNull();
  });
});
