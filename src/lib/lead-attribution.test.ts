import { describe, expect, it } from "vitest";
import {
  asksForSearchTerm,
  captureFirstTouch,
  channelFromFoundVia,
  classifyReferrer,
  describeAttribution,
  FOUND_VIA_OPTIONS,
  isChannel,
  normaliseSearchTerm,
  parseAttributionPayload,
  parseFirstTouch,
  parseFoundVia,
  parseUtm,
  sanitiseReferrer,
} from "./lead-attribution";

const OWN = "goldstay.co.ke";

describe("classifyReferrer", () => {
  it("reads the search engines we actually see", () => {
    expect(classifyReferrer("https://www.google.com/", OWN)).toBe("organic_search");
    expect(classifyReferrer("https://www.google.co.ke/", OWN)).toBe("organic_search");
    expect(classifyReferrer("https://bing.com/search", OWN)).toBe("organic_search");
    expect(classifyReferrer("https://duckduckgo.com/", OWN)).toBe("organic_search");
  });

  it("treats a tagged paid click as paid even though Google refers it like an organic one", () => {
    // This is the case that makes medium outrank host. A Google Ads
    // click and an organic click are indistinguishable by referrer,
    // so without this the ad spend would be reported as free traffic.
    expect(
      classifyReferrer("https://www.google.com/", OWN, { medium: "cpc" }),
    ).toBe("paid_search");
    expect(
      classifyReferrer("https://www.google.com/", OWN, { medium: "CPC" }),
    ).toBe("paid_search");
  });

  it("does not count our own pages as a referral", () => {
    expect(classifyReferrer("https://goldstay.co.ke/nairobi", OWN)).toBe("internal");
    expect(classifyReferrer("https://www.goldstay.co.ke/pricing", OWN)).toBe("internal");
  });

  it("separates social from ordinary referrals", () => {
    expect(classifyReferrer("https://l.facebook.com/", OWN)).toBe("social");
    expect(classifyReferrer("https://www.instagram.com/", OWN)).toBe("social");
    expect(classifyReferrer("https://t.co/abc", OWN)).toBe("social");
    expect(classifyReferrer("https://airbtics.com/some-list", OWN)).toBe("referral");
  });

  it("calls a missing or unparseable referrer direct rather than throwing", () => {
    expect(classifyReferrer(null, OWN)).toBe("direct");
    expect(classifyReferrer("", OWN)).toBe("direct");
    expect(classifyReferrer("not a url", OWN)).toBe("direct");
  });
});

describe("sanitiseReferrer", () => {
  it("keeps origin and path and drops the query", () => {
    expect(sanitiseReferrer("https://example.com/a/b?utm_source=x&id=99")).toBe(
      "https://example.com/a/b",
    );
  });

  it("reduces a bare root to just the origin", () => {
    expect(sanitiseReferrer("https://www.google.com/")).toBe("https://www.google.com");
  });

  it("rejects anything that is not http", () => {
    expect(sanitiseReferrer("javascript:alert(1)")).toBeNull();
    expect(sanitiseReferrer("android-app://com.google.android.gm")).toBeNull();
    expect(sanitiseReferrer(null)).toBeNull();
  });
});

describe("parseUtm", () => {
  it("pulls the five standard parameters", () => {
    const r = parseUtm(
      "?utm_source=google&utm_medium=cpc&utm_campaign=nairobi&utm_term=airbnb+management&utm_content=hero",
    );
    expect(r.utmSource).toBe("google");
    expect(r.utmMedium).toBe("cpc");
    expect(r.utmCampaign).toBe("nairobi");
    expect(r.utmTerm).toBe("airbnb management");
    expect(r.utmContent).toBe("hero");
  });

  it("returns nulls rather than empty strings", () => {
    const r = parseUtm("?utm_source=&foo=bar");
    expect(r.utmSource).toBeNull();
    expect(r.utmCampaign).toBeNull();
  });

  it("survives a query string with no parameters at all", () => {
    expect(parseUtm("").utmSource).toBeNull();
  });
});

describe("captureFirstTouch", () => {
  const loc = {
    host: OWN,
    pathname: "/nairobi/westlands/airbnb-management",
    search: "",
  };

  it("records the landing page and channel on arrival", () => {
    const t = captureFirstTouch(loc, "https://www.google.com/", null);
    expect(t).not.toBeNull();
    expect(t?.landingPath).toBe("/nairobi/westlands/airbnb-management");
    expect(t?.channel).toBe("organic_search");
    expect(t?.referrer).toBe("https://www.google.com");
  });

  it("refuses to overwrite an existing touch, which is what makes it first-touch", () => {
    // The whole point: a landlord who arrives on an article, reads
    // three more pages and then opens the form must still be
    // attributed to the article and to Google, not to our own site.
    const stored = JSON.stringify({ landingPath: "/kenya-rental-income-tax" });
    expect(captureFirstTouch(loc, "https://goldstay.co.ke/x", stored)).toBeNull();
  });

  it("does not record our own URL as the source of an internal first touch", () => {
    const t = captureFirstTouch(loc, "https://goldstay.co.ke/nairobi", null);
    expect(t?.channel).toBe("internal");
    expect(t?.referrer).toBeNull();
  });

  it("stamps the arrival time so a stale session is visible later", () => {
    const now = new Date("2026-09-09T05:00:00.000Z");
    const t = captureFirstTouch(loc, null, null, now);
    expect(t?.landedAt).toBe("2026-09-09T05:00:00.000Z");
    expect(t?.channel).toBe("direct");
  });
});

describe("parseFirstTouch", () => {
  it("round-trips a captured touch", () => {
    const t = captureFirstTouch(
      { host: OWN, pathname: "/pricing", search: "?utm_source=newsletter" },
      null,
      null,
    );
    const back = parseFirstTouch(JSON.stringify(t));
    expect(back?.landingPath).toBe("/pricing");
    expect(back?.utmSource).toBe("newsletter");
  });

  it("returns null for junk instead of throwing into a form submit", () => {
    expect(parseFirstTouch(null)).toBeNull();
    expect(parseFirstTouch("{{{")).toBeNull();
    expect(parseFirstTouch("[]")).toBeNull();
    expect(parseFirstTouch('{"nope":1}')).toBeNull();
  });

  it("falls back to direct when a stored channel is not one we know", () => {
    expect(
      parseFirstTouch('{"landingPath":"/","channel":"telepathy"}')?.channel,
    ).toBe("direct");
  });
});

describe("the how-did-you-find-us answer", () => {
  it("only asks for a search term when the answer was Google", () => {
    expect(asksForSearchTerm("Google search")).toBe(true);
    expect(asksForSearchTerm("Recommended by someone")).toBe(false);
    expect(asksForSearchTerm(null)).toBe(false);
  });

  it("rejects an option that is not on the list", () => {
    expect(parseFoundVia("Google search")).toBe("Google search");
    expect(parseFoundVia("smoke signals")).toBeNull();
    expect(parseFoundVia(42)).toBeNull();
  });

  it("keeps every option answerable by the parser", () => {
    // Guards the form and the parser drifting apart, which would
    // silently discard whatever new option somebody adds to the UI.
    for (const o of FOUND_VIA_OPTIONS) expect(parseFoundVia(o)).toBe(o);
  });

  it("tidies the typed search term and caps its length", () => {
    expect(normaliseSearchTerm("  property   management nairobi ")).toBe(
      "property management nairobi",
    );
    expect(normaliseSearchTerm("")).toBeNull();
    expect(normaliseSearchTerm("x".repeat(500))?.length).toBe(200);
  });
});

// /api/lead is public, so this parser is the boundary between an
// anonymous POST and eleven columns we later read as evidence about
// which marketing works. A forged value is worse than a null.
describe("parseAttributionPayload", () => {
  it("keeps a well-formed block", () => {
    const r = parseAttributionPayload({
      foundVia: "Google search",
      searchTerm: "property management nairobi",
      channel: "organic_search",
      landingPath: "/nairobi/westlands",
      referrer: "https://www.google.com/",
      utmSource: "newsletter",
      landedAt: "2026-09-09T05:00:00.000Z",
    });
    expect(r.foundVia).toBe("Google search");
    expect(r.searchTerm).toBe("property management nairobi");
    expect(r.channel).toBe("organic_search");
    expect(r.landingPath).toBe("/nairobi/westlands");
    expect(r.referrer).toBe("https://www.google.com");
    expect(r.landedAt?.toISOString()).toBe("2026-09-09T05:00:00.000Z");
  });

  it("drops a channel it does not recognise rather than storing it", () => {
    expect(parseAttributionPayload({ channel: "word_of_mouth" }).channel).toBeNull();
    expect(parseAttributionPayload({ channel: 99 }).channel).toBeNull();
  });

  it("rejects a foundVia that was not one of the offered options", () => {
    expect(parseAttributionPayload({ foundVia: "<script>" }).foundVia).toBeNull();
  });

  it("requires landingPath to be a path and not a full URL", () => {
    // A host here would be one the client asserted and we never
    // checked, and the host is never in question — it is us.
    expect(
      parseAttributionPayload({ landingPath: "https://evil.example/x" }).landingPath,
    ).toBeNull();
    expect(parseAttributionPayload({ landingPath: "/pricing" }).landingPath).toBe(
      "/pricing",
    );
  });

  it("strips a non-http referrer", () => {
    expect(
      parseAttributionPayload({ referrer: "javascript:alert(1)" }).referrer,
    ).toBeNull();
  });

  it("ignores a landedAt in the future or one that will not parse", () => {
    const future = new Date(Date.now() + 86_400_000).toISOString();
    expect(parseAttributionPayload({ landedAt: future }).landedAt).toBeNull();
    expect(parseAttributionPayload({ landedAt: "yesterday" }).landedAt).toBeNull();
  });

  it("returns an all-null block for junk, so a bad post still creates the lead", () => {
    for (const junk of [null, undefined, "nope", 5, []]) {
      const r = parseAttributionPayload(junk);
      expect(r.channel).toBeNull();
      expect(r.searchTerm).toBeNull();
      expect(r.landedAt).toBeNull();
    }
  });

  it("caps every free-text field", () => {
    const r = parseAttributionPayload({
      utmCampaign: "c".repeat(1000),
      searchTerm: "s".repeat(1000),
    });
    expect(r.utmCampaign?.length).toBe(200);
    expect(r.searchTerm?.length).toBe(200);
  });
});

describe("describeAttribution", () => {
  it("leads with what the landlord said and the phrase they typed", () => {
    const line = describeAttribution(
      parseAttributionPayload({
        foundVia: "Google search",
        searchTerm: "airbnb management nairobi",
        channel: "organic_search",
        landingPath: "/airbnb-management",
      }),
    );
    expect(line).toBe(
      'Says: Google search · searched "airbnb management nairobi" · organic search · landed on /airbnb-management',
    );
  });

  it("returns null when there is nothing to say, so the email omits the line", () => {
    expect(describeAttribution(parseAttributionPayload({}))).toBeNull();
  });
});

describe("channelFromFoundVia", () => {
  it("buckets the answers that map cleanly", () => {
    expect(channelFromFoundVia("Google search")).toBe("organic_search");
    expect(channelFromFoundVia("Recommended by someone")).toBe("referral");
    expect(channelFromFoundVia("Instagram or Facebook")).toBe("social");
  });

  it("returns null rather than inventing a channel for the offline answers", () => {
    // "Saw a Goldstay property" happened in the street and "Other"
    // says nothing; neither maps onto a bucket without making a fact up.
    expect(channelFromFoundVia("Saw a Goldstay property")).toBeNull();
    expect(channelFromFoundVia("Other")).toBeNull();
    expect(channelFromFoundVia(null)).toBeNull();
  });

  it("only ever returns a channel the guard accepts", () => {
    for (const o of FOUND_VIA_OPTIONS) {
      const c = channelFromFoundVia(o);
      if (c !== null) expect(isChannel(c)).toBe(true);
    }
  });
});

describe("isChannel", () => {
  it("guards the String column on the way back out of Postgres", () => {
    expect(isChannel("organic_search")).toBe(true);
    expect(isChannel("telepathy")).toBe(false);
  });
});
