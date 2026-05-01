import { describe, expect, it } from "vitest";
import { findBrkListings, toRawListing } from "./buyrentkenya";

describe("BuyRentKenya scraper parsers", () => {
  it("walks the state tree and normalises a KES monthly rental", () => {
    const root = {
      props: {
        pageProps: {
          data: {
            properties: [
              {
                id: 1,
                title: "2BR in Kilimani",
                slug: "/houses-for-rent/2br-1",
                bedrooms: 2,
                price: 130000,
                currency: "KES",
                rentFrequency: "month",
                location: { area: "Kilimani" },
                agent: {
                  name: "John",
                  phone: "+254700123456",
                  listingsCount: 1,
                },
                publishedAt: "2026-03-01T00:00:00Z",
              },
            ],
          },
        },
      },
    };

    const found = findBrkListings(root);
    expect(found).toHaveLength(1);

    const raw = toRawListing(found[0]!, new Date("2026-05-01T00:00:00Z"));
    expect(raw).toMatchObject({
      source: "BuyRentKenya",
      url: "https://www.buyrentkenya.com/houses-for-rent/2br-1",
      neighbourhood: "Kilimani",
      bedrooms: 2,
      // 130_000 KES / 130 KES per USD = 1000 USD indicative.
      askingPriceUsd: 1000,
      listerListingCount: 1,
    });
    expect(raw?.daysOnMarket).toBeGreaterThanOrEqual(60);
  });

  it("ignores non-monthly listings (sale prices)", () => {
    const raw = toRawListing({
      title: "For sale",
      slug: "/y",
      bedrooms: 2,
      price: 30_000_000,
      currency: "KES",
      rentFrequency: "outright",
    });
    expect(raw?.askingPriceUsd).toBeUndefined();
  });
});
