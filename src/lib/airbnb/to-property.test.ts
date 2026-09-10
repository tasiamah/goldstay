import { describe, expect, it } from "vitest";
import type { AirbnbListing } from "./listing";
import { mapListingToProperty } from "./to-property";

function listing(over: Partial<AirbnbListing> = {}): AirbnbListing {
  return {
    roomId: "123",
    url: "https://www.airbnb.com/rooms/123",
    name: "Bright 2BR with backup power",
    description: "Quiet corner unit.",
    images: ["a.jpg", "b.jpg"],
    maxOccupancy: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    latitude: -1.2921,
    longitude: 36.7833,
    locality: "Nairobi",
    rating: 4.88,
    reviewCount: 63,
    ...over,
  };
}

describe("mapListingToProperty", () => {
  it("fills the fields the form has", () => {
    const { defaults } = mapListingToProperty(listing());
    expect(defaults.name).toBe("Bright 2BR with backup power");
    expect(defaults.bedrooms).toBe(2);
    expect(defaults.bathrooms).toBe(1);
    expect(defaults.maxOccupancy).toBe(4);
    expect(defaults.city).toBe("Nairobi");
    // An Airbnb import is an unambiguous signal of rental model, and
    // the field locks once the property exists.
    expect(defaults.propertyType).toBe("SHORT_TERM");
  });

  it("reads a neighbourhood out of addressLocality and normalises it", () => {
    // Airbnb hands back the city on some listings and the area on
    // others, so the value has to be tested against our own list
    // rather than trusted as one or the other.
    const { defaults } = mapListingToProperty(listing({ locality: "westlands" }));
    expect(defaults.city).toBe("Nairobi");
    expect(defaults.neighbourhood).toBe("Westlands");
  });

  it("leaves neighbourhood blank and says so when the area is unknown", () => {
    const { defaults, warnings } = mapListingToProperty(
      listing({ locality: "Ruiru" }),
    );
    expect(defaults.neighbourhood).toBeNull();
    expect(warnings.some((w) => w.includes("Ruiru"))).toBe(true);
  });

  it("rounds half-bathrooms and admits to it", () => {
    // The column is an Int. Rounding silently would put a number on
    // the record that the source never said.
    const { defaults, warnings } = mapListingToProperty(
      listing({ bathrooms: 1.5 }),
    );
    expect(defaults.bathrooms).toBe(2);
    expect(warnings.some((w) => w.includes("1.5") && w.includes("2"))).toBe(
      true,
    );
  });

  it("always warns that the address is missing", () => {
    // Not a conditional warning: Airbnb never gives this, so the
    // operator always has to type it.
    const { warnings } = mapListingToProperty(listing());
    expect(warnings.some((w) => w.toLowerCase().includes("address"))).toBe(true);
  });

  it("warns that the imported name is marketing copy", () => {
    const { warnings } = mapListingToProperty(listing());
    expect(
      warnings.some((w) => w.includes("marketing copy")),
      "an Airbnb title must not silently become the building name",
    ).toBe(true);
  });

  it("reports photos as found-but-not-stored rather than dropping them", () => {
    const { warnings, unmapped } = mapListingToProperty(
      listing({ images: ["a.jpg", "b.jpg", "c.jpg"] }),
    );
    expect(unmapped.photoCount).toBe(3);
    expect(warnings.some((w) => w.includes("3 photos"))).toBe(true);
  });

  it("does not invent warnings for fields the listing did not have", () => {
    const { warnings } = mapListingToProperty(
      listing({ name: null, description: null, images: [], locality: null }),
    );
    // Only the unconditional address warning should survive.
    expect(warnings).toHaveLength(1);
    expect(warnings[0].toLowerCase()).toContain("address");
  });

  it("keeps the extracted-but-unstorable values visible", () => {
    const { unmapped } = mapListingToProperty(listing());
    expect(unmapped.rating).toBe(4.88);
    expect(unmapped.reviewCount).toBe(63);
    expect(unmapped.listingUrl).toBe("https://www.airbnb.com/rooms/123");
  });
});
