import { describe, expect, it } from "vitest";
import {
  composeScrapedLeadNotes,
  inferCountryFromCity,
  leadHashForUrl,
  shouldPersistScrapedLead,
} from "./leads";
import type { ClassifiedListing } from "./types";

// The Postgres mirror of the acquisition scrape feeds /admin/leads,
// so the rules around "do we create a row at all?" and "what's the
// dedupe key?" are user-facing — a regression here either pollutes
// the call list or, worse, silently drops actionable leads. The
// pure helpers carry that logic; persistScrapedLead just wires them
// into createLead. We test the helpers directly so the test suite
// stays Prisma-free.

function listing(overrides: Partial<ClassifiedListing> = {}): ClassifiedListing {
  return {
    source: "Airbnb",
    url: "https://airbnb.com/rooms/12345",
    city: "Nairobi",
    neighbourhood: "Kilimani",
    title: "2BR with balcony",
    bedrooms: 2,
    askingPriceUsd: 1200,
    daysOnMarket: 60,
    listerName: "John Mwangi",
    listerPhone: "+254700123456",
    description: "my apartment",
    notes: undefined,
    ownerScore: 78,
    painScore: 35,
    listerType: "Likely owner",
    ...overrides,
  };
}

describe("leadHashForUrl", () => {
  it("is deterministic and 32 hex chars", () => {
    const h1 = leadHashForUrl("https://airbnb.com/rooms/9");
    const h2 = leadHashForUrl("https://airbnb.com/rooms/9");
    expect(h1).toBe(h2);
    expect(h1).toMatch(/^[0-9a-f]{32}$/);
  });

  it("is case-insensitive and trim-tolerant so re-scrapes collapse onto the same row", () => {
    const a = leadHashForUrl("  https://airbnb.com/rooms/9 ");
    const b = leadHashForUrl("HTTPS://AIRBNB.COM/rooms/9");
    expect(a).toBe(b);
  });

  it("differentiates distinct listing URLs", () => {
    expect(leadHashForUrl("https://airbnb.com/rooms/9")).not.toBe(
      leadHashForUrl("https://airbnb.com/rooms/10"),
    );
  });
});

describe("inferCountryFromCity", () => {
  it("maps the two known scraper cities", () => {
    expect(inferCountryFromCity("Nairobi")).toBe("KE");
    expect(inferCountryFromCity("Accra")).toBe("GH");
  });
  it("returns null for Other so the row is still created without a country lock-in", () => {
    expect(inferCountryFromCity("Other")).toBeNull();
  });
});

describe("shouldPersistScrapedLead", () => {
  it("accepts the canonical owner-leaning listing", () => {
    expect(shouldPersistScrapedLead(listing())).toBe(true);
  });

  it("rejects rows without a callback channel", () => {
    expect(shouldPersistScrapedLead(listing({ listerPhone: undefined }))).toBe(
      false,
    );
    expect(shouldPersistScrapedLead(listing({ listerPhone: "  " }))).toBe(
      false,
    );
  });

  it("rejects rows we can't address by name", () => {
    expect(shouldPersistScrapedLead(listing({ listerName: undefined }))).toBe(
      false,
    );
    expect(shouldPersistScrapedLead(listing({ listerName: "" }))).toBe(false);
  });

  it("defence-in-depth: rejects a Likely agent that slipped through surfacing", () => {
    expect(
      shouldPersistScrapedLead(
        listing({ listerType: "Likely agent", ownerScore: 12 }),
      ),
    ).toBe(false);
  });
});

describe("composeScrapedLeadNotes", () => {
  it("includes source, URL, classifier scores, and price/time signals", () => {
    const text = composeScrapedLeadNotes(listing());
    expect(text).toContain("Source: Airbnb (Nairobi)");
    expect(text).toContain("Listing: https://airbnb.com/rooms/12345");
    expect(text).toContain(
      "Owner score 78 · Pain score 35 · Likely owner",
    );
    expect(text).toContain("Days on market: 60");
    expect(text).toContain("Asking: USD 1200/mo");
    expect(text).toContain("Title: 2BR with balcony");
  });

  it("omits the optional lines cleanly when the scraper can't extract them", () => {
    const text = composeScrapedLeadNotes(
      listing({
        title: undefined,
        daysOnMarket: undefined,
        askingPriceUsd: undefined,
        notes: undefined,
      }),
    );
    expect(text).not.toContain("Title:");
    expect(text).not.toContain("Days on market");
    expect(text).not.toContain("Asking:");
    expect(text).not.toContain("Notes:");
    expect(text).toContain("Listing: https://airbnb.com/rooms/12345");
  });
});
