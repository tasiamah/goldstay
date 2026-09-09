import { describe, expect, it } from "vitest";
import {
  buildWhatsAppDestination,
  DEFAULT_INTENT,
  deviceFromUserAgent,
  isWaIntent,
  resolveIntent,
  sanitisePagePath,
  sanitiseSource,
  WA_INTENTS,
} from "./whatsapp-click";

describe("resolveIntent", () => {
  it("accepts the known intents", () => {
    expect(resolveIntent("airbnb")).toBe("airbnb");
    expect(resolveIntent("cohost")).toBe("cohost");
  });

  it("falls back rather than failing on an unknown or missing key", () => {
    // This link is the last step before a lead reaches us. A typo in a
    // campaign URL should cost the prefilled wording, not the enquiry.
    expect(resolveIntent("nonsense")).toBe(DEFAULT_INTENT);
    expect(resolveIntent(null)).toBe(DEFAULT_INTENT);
    expect(resolveIntent(undefined)).toBe(DEFAULT_INTENT);
  });

  it("does not treat inherited object properties as intents", () => {
    expect(isWaIntent("toString")).toBe(false);
    expect(isWaIntent("constructor")).toBe(false);
  });
});

describe("sanitiseSource", () => {
  it("normalises to a groupable label", () => {
    expect(sanitiseSource("Ads Landing Hero")).toBe("ads-landing-hero");
    expect(sanitiseSource("section:pricing")).toBe("section:pricing");
  });

  it("never returns empty, so the column is always groupable", () => {
    expect(sanitiseSource("")).toBe("unknown");
    expect(sanitiseSource("!!!")).toBe("unknown");
    expect(sanitiseSource(null)).toBe("unknown");
  });

  it("caps length so a scraper cannot fill the column", () => {
    expect(sanitiseSource("a".repeat(200)).length).toBe(60);
  });
});

describe("sanitisePagePath", () => {
  it("keeps a plain path and strips the trailing slash", () => {
    expect(sanitisePagePath("/airbnb-management")).toBe("/airbnb-management");
    expect(sanitisePagePath("/pricing/")).toBe("/pricing");
    expect(sanitisePagePath("/")).toBe("/");
  });

  it("drops the query and fragment", () => {
    expect(sanitisePagePath("/pricing?utm_source=x#top")).toBe("/pricing");
  });

  it("refuses anything that could assert a host", () => {
    // A protocol-relative value is the one that bites: "//evil.example"
    // starts with a slash and is a URL.
    expect(sanitisePagePath("//evil.example")).toBeNull();
    expect(sanitisePagePath("https://evil.example")).toBeNull();
    expect(sanitisePagePath("pricing")).toBeNull();
  });
});

describe("buildWhatsAppDestination", () => {
  it("points at wa.me with the intent's message prefilled", () => {
    const url = new URL(
      buildWhatsAppDestination({
        intent: "manage",
        number: "254702471993",
        host: "goldstay.co.ke",
        pagePath: "/manage-my-property",
      }),
    );
    expect(url.origin).toBe("https://wa.me");
    expect(url.pathname).toBe("/254702471993");
    const text = url.searchParams.get("text") ?? "";
    expect(text).toContain(WA_INTENTS.manage);
    expect(text).toContain("(Sent from goldstay.co.ke/manage-my-property)");
  });

  it("names the campaign in the footnote when there is one", () => {
    // The thread is the only place the answer to "did the ads work"
    // survives, because the send happens where no browser can see.
    const url = new URL(
      buildWhatsAppDestination({
        intent: "airbnb",
        number: "254702471993",
        host: "goldstay.co.ke",
        pagePath: "/manage-my-property",
        campaign: "manage-ke",
      }),
    );
    expect(url.searchParams.get("text")).toContain("via manage-ke");
  });

  it("handles a missing page path without producing a double slash", () => {
    const url = new URL(
      buildWhatsAppDestination({
        intent: "quote",
        number: "254702471993",
        host: "goldstay.co.ke",
        pagePath: null,
      }),
    );
    expect(url.searchParams.get("text")).toContain("(Sent from goldstay.co.ke/)");
  });

  it("only ever builds a wa.me URL, whatever the intent", () => {
    for (const intent of Object.keys(WA_INTENTS) as Array<
      keyof typeof WA_INTENTS
    >) {
      const url = new URL(
        buildWhatsAppDestination({
          intent,
          number: "254702471993",
          host: "goldstay.co.ke",
          pagePath: "/",
        }),
      );
      expect(url.host).toBe("wa.me");
    }
  });
});

describe("deviceFromUserAgent", () => {
  it("classifies coarsely", () => {
    expect(
      deviceFromUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)"),
    ).toBe("mobile");
    expect(deviceFromUserAgent("Mozilla/5.0 (Linux; Android 14)")).toBe(
      "mobile",
    );
    expect(
      deviceFromUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)"),
    ).toBe("desktop");
    expect(deviceFromUserAgent(null)).toBe("unknown");
  });
});
