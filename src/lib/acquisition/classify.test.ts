import { afterEach, describe, expect, it } from "vitest";
import { classify, isWorthSurfacing } from "./classify";
import type { RawListing } from "./types";

const base: RawListing = {
  source: "BuyRentKenya",
  url: "https://example.com/listing/1",
  city: "Nairobi",
};

describe("classify", () => {
  // Each row exercises one of the four signal paths the production
  // pipeline depends on: positive owner signals, agency-keyword hard
  // override, listing-count hard override, and the env-var phone
  // blocklist hard override. Anything beyond these four is implementation
  // detail; collapsing them into one table makes a heuristic tweak
  // surface as a single failing case rather than four scattered ones.
  const cases: Array<{
    name: string;
    setup?: () => void;
    listing: RawListing;
    expectType: "Likely owner" | "Likely agent";
    maxScore?: number;
    minScore?: number;
  }> = [
    {
      name: "single-listing human lister with owner phrasing → Likely owner",
      listing: {
        ...base,
        listerName: "John Mwangi",
        listerListingCount: 1,
        description: "I am renting out my apartment in Kilimani.",
      },
      expectType: "Likely owner",
      minScore: 80,
    },
    {
      name: "agency keyword in name overrides positive description",
      listing: {
        ...base,
        listerName: "Knight Frank Kenya",
        listerListingCount: 1,
        description: "my apartment my apartment my apartment",
      },
      expectType: "Likely agent",
      maxScore: 15,
    },
    {
      name: ">10 listings under one phone is a hard agent",
      listing: {
        ...base,
        listerName: "Jane",
        listerListingCount: 25,
        description: "my apartment in Kilimani",
      },
      expectType: "Likely agent",
      maxScore: 15,
    },
    {
      name: "blocklisted phone forces agent regardless of other signals",
      setup: () => {
        process.env.ACQUISITION_AGENT_PHONE_BLOCKLIST = "+254700111222";
      },
      listing: {
        ...base,
        listerName: "John Mwangi",
        listerListingCount: 1,
        listerPhone: "+254 700 111 222",
        description: "I am renting out my apartment.",
      },
      expectType: "Likely agent",
      maxScore: 15,
    },
  ];

  afterEach(() => {
    delete process.env.ACQUISITION_AGENT_PHONE_BLOCKLIST;
  });

  it.each(cases)("$name", ({ setup, listing, expectType, minScore, maxScore }) => {
    setup?.();
    const c = classify(listing);
    expect(c.listerType).toBe(expectType);
    if (minScore !== undefined) expect(c.ownerScore).toBeGreaterThanOrEqual(minScore);
    if (maxScore !== undefined) expect(c.ownerScore).toBeLessThanOrEqual(maxScore);
  });

  it("pain score climbs with stale, mid-market listings", () => {
    const fresh = classify({ ...base, daysOnMarket: 5, askingPriceUsd: 150 });
    const painful = classify({
      ...base,
      daysOnMarket: 95,
      askingPriceUsd: 1500,
    });
    expect(painful.painScore).toBeGreaterThan(fresh.painScore + 30);
  });

  it("isWorthSurfacing drops obvious agents and keeps real owners", () => {
    const agent = classify({
      ...base,
      listerName: "Acme Properties Ltd",
      listerListingCount: 30,
    });
    const owner = classify({
      ...base,
      listerName: "John Mwangi",
      listerListingCount: 1,
      askingPriceUsd: 1500,
    });
    expect(isWorthSurfacing(agent)).toBe(false);
    expect(isWorthSurfacing(owner)).toBe(true);
  });
});
