import { describe, expect, it } from "vitest";
import { LEAD_SOURCES, parseLeadSource } from "./leads";

// parseLeadSource sits on the public /api/lead boundary, so the cases
// that matter are the hostile and the stale ones, not the happy path.
describe("parseLeadSource", () => {
  it("accepts every LeadSource the schema defines", () => {
    for (const source of LEAD_SOURCES) {
      expect(parseLeadSource(source)).toBe(source);
    }
  });

  it("is case- and whitespace-insensitive", () => {
    expect(parseLeadSource("whatsapp")).toBe("WHATSAPP");
    expect(parseLeadSource("  WhatsApp  ")).toBe("WHATSAPP");
    expect(parseLeadSource("outbound_scrape")).toBe("OUTBOUND_SCRAPE");
  });

  it("falls back to WEBSITE rather than inventing a channel", () => {
    // Preserves the pre-existing behaviour for any caller that doesn't
    // send the field at all — the canonical form, the partner embed,
    // and any hand-rolled POST.
    expect(parseLeadSource(undefined)).toBe("WEBSITE");
    expect(parseLeadSource(null)).toBe("WEBSITE");
    expect(parseLeadSource("")).toBe("WEBSITE");
    expect(parseLeadSource("tiktok")).toBe("WEBSITE");
    expect(parseLeadSource(42)).toBe("WEBSITE");
    expect(parseLeadSource({ source: "WHATSAPP" })).toBe("WEBSITE");
  });

  it("does not let a partial match through", () => {
    expect(parseLeadSource("WHATS")).toBe("WEBSITE");
    expect(parseLeadSource("WHATSAPP_BUSINESS")).toBe("WEBSITE");
  });
});
