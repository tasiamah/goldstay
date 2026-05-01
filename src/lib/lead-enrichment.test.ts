import { describe, expect, it } from "vitest";
import { enrichLead } from "./lead-enrichment";

describe("enrichLead", () => {
  it("scores the textbook diaspora lead at the top of the queue", () => {
    const r = enrichLead({
      country: "United Kingdom",
      city: "Nairobi",
      neighbourhood: "Lavington",
      service: "Long-term",
      bedrooms: "3",
      availability: "Within 1 month",
      email: "owner@example.com",
      phone: "+44 7700 900123",
    });
    expect(r.tier).toBe("A");
    expect(r.isDiaspora).toBe(true);
    expect(r.isPremiumNeighbourhood).toBe(true);
    expect(r.callbackSlaMinutes).toBe(30);
  });

  it("flags onshore landlords as not-diaspora regardless of tier", () => {
    const r = enrichLead({
      country: "Kenya",
      neighbourhood: "Westlands",
      service: "Long-term",
      availability: "Within 1 month",
      email: "x@y.com",
      phone: "+254700123456",
      bedrooms: "2",
    });
    expect(r.isDiaspora).toBe(false);
    expect(r.tier).not.toBe("D");
  });

  it("normalises whitespace and case on country and neighbourhood", () => {
    // Guards against a regression where a future edit drops the
    // trim/lowercase pass and the textbook A-tier silently slips to D
    // because "  united kingdom  " no longer matches the diaspora set.
    const a = enrichLead({
      country: "  united kingdom  ",
      neighbourhood: "  Lavington  ",
      service: "Long-term",
      availability: "Immediately",
    });
    const b = enrichLead({
      country: "United Kingdom",
      neighbourhood: "lavington",
      service: "Long-term",
      availability: "Immediately",
    });
    expect(a.tier).toBe(b.tier);
    expect(a.score).toBe(b.score);
  });
});
