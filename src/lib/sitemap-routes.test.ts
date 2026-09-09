import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { marketsServedBy, sitemapPaths, type Market } from "./sitemap-routes";
import { isLiveDomain, site } from "./site";

// The sitemap decides what Google is ever told exists, and nothing
// checked it. Scoping by hostname alone was correct for the
// three-domain plan and wrong for the present: goldstay.com.gh does not
// resolve, so the 11 Ghana articles, /accra, /accra/buy, the five Accra
// neighbourhoods and the ten /from/{origin}/accra pages were in no
// sitemap at all — 28 URLs that return 200 on .co.ke, are
// self-canonical there and say "index, follow".
//
// Slugs are supplied rather than imported so these stay pure: the real
// catalogue is 350 .tsx files and this runner is deliberately JSX-free.
const slugs: Record<Market, readonly string[]> = {
  kenya: ["karen-complete-guide-2026", "airbnb-nairobi-occupancy-2026"],
  ghana: ["ghana-stool-land-diaspora-buyer-trap", "buying-property-accra-diaspora-2026-guide"],
};
const cats: Record<Market, readonly string[]> = {
  kenya: ["buying", "renting-and-management"],
  ghana: ["buying"],
};

const pathsFor = (host: string) =>
  sitemapPaths({ host, postSlugs: slugs, categorySlugs: cats });

describe("marketsServedBy", () => {
  // Every expectation below is conditioned on this. When .com.gh goes
  // live these flip, and that is the point: the assertion should fail
  // loudly rather than silently describe a world that moved on.
  it("only Kenya is live today", () => {
    expect(isLiveDomain(site.domains.nairobi)).toBe(true);
    expect(isLiveDomain(site.domains.accra)).toBe(false);
  });

  // These three previously asserted that the Kenya domain stands in
  // for whichever market's own domain is dark, which is why .co.ke
  // served the Accra routes and the Ghana articles.
  //
  // That is still the right behaviour for a *launched* market waiting
  // on DNS. It was the wrong behaviour for Accra, which is built and
  // not launched, and it put nineteen Accra URLs into the Kenyan
  // sitemap — telling Google a Nairobi firm is also a Ghanaian one and
  // offering a service in a city we cannot deliver it in.
  //
  // The stand-in logic is unchanged underneath; an unlaunched market
  // is now filtered out after it. Adding "ghana" to
  // site.launchedMarkets restores every expectation below to its
  // original form, which is the point.
  it("does not have the Kenya domain stand in for an unlaunched market", () => {
    expect(marketsServedBy("goldstay.co.ke")).toEqual(["kenya"]);
  });

  it("serves nothing from an unlaunched market's own domain", () => {
    // Only the sitemap consumes this, so an empty result means that
    // host advertises the market-neutral routes and no city at all.
    // Correct for a domain that is both dark and unlaunched.
    expect(marketsServedBy("goldstay.com.gh")).toEqual([]);
  });

  it("is case insensitive about the host", () => {
    expect(marketsServedBy("GoldStay.CO.KE")).toEqual(["kenya"]);
  });

  it("serves nothing from the neutral .com host", () => {
    // Not a stand-in case, which is worth recording because it looks
    // like one. Kenya's own domain is live, so the stand-in rule does
    // not fire for it and only .co.ke serves Kenya. Ghana would have
    // been picked up here — .com.gh being dark is exactly the trigger
    // — but Ghana is unlaunched, so the answer is nothing at all.
    //
    // Harmless in practice: goldstay.com is a parked lander that is
    // not ours, which is why it is absent from site.liveDomains.
    expect(marketsServedBy("goldstay.com")).toEqual([]);
  });
});

describe("sitemapPaths on the Kenya domain", () => {
  // Inverted deliberately. This host used to advertise the Accra
  // routes on the grounds that it was the only host serving them, and
  // that is exactly the reasoning that leaked an unlaunched market
  // into the Kenyan sitemap. See site.launchedMarkets.
  it("advertises no Accra route while Ghana is unlaunched", () => {
    const paths = pathsFor("goldstay.co.ke");
    for (const p of ["/accra", "/accra/buy", "/accra/areas", "/from/uk/accra"]) {
      expect(paths).not.toContain(p);
    }
  });

  it("advertises no Ghana article while Ghana is unlaunched", () => {
    const paths = pathsFor("goldstay.co.ke");
    expect(paths).not.toContain("/insights/ghana-stool-land-diaspora-buyer-trap");
    expect(paths).not.toContain(
      "/insights/buying-property-accra-diaspora-2026-guide",
    );
    // Categories are shared across markets, so this one stays: it
    // still has Kenyan articles in it.
    expect(paths).toContain("/insights/category/buying");
  });

  it("keeps the Nairobi routes and the money pages", () => {
    const paths = pathsFor("goldstay.co.ke");
    for (const p of [
      "",
      "/airbnb-management",
      "/long-term-management",
      "/tenant-finding",
      "/property-sourcing",
      "/list-your-property",
      "/nairobi/kilimani",
      "/nairobi/kilimani/airbnb-management",
      "/from/uk/nairobi",
    ]) {
      expect(paths).toContain(p);
    }
  });

  it("omits /nairobi, which 301s to the root on this domain", () => {
    const paths = pathsFor("goldstay.co.ke");
    expect(paths).toContain("");
    expect(paths).not.toContain("/nairobi");
  });

  it("never lists the same path twice", () => {
    const paths = pathsFor("goldstay.co.ke");
    expect(new Set(paths).size).toBe(paths.length);
  });
});

describe("sitemapPaths on the Ghana domain", () => {
  // This domain is both dark and unlaunched, so it serves the
  // market-neutral routes and no city. The Kenya-scoping assertions
  // below are the ones still worth keeping: they prove the host logic
  // underneath the launch filter is intact, so restoring Ghana is a
  // one-line change and not a rewrite.
  it("drops the Kenya routes", () => {
    const paths = pathsFor("goldstay.com.gh");
    expect(paths).toContain("");
    expect(paths).not.toContain("/nairobi/kilimani");
    expect(paths).not.toContain("/from/uk/nairobi");
  });

  it("lists no city routes at all while Ghana is unlaunched", () => {
    const paths = pathsFor("goldstay.com.gh");
    for (const p of ["/accra", "/accra/areas", "/accra/buy"]) {
      expect(paths).not.toContain(p);
    }
  });

  it("lists no articles from either market", () => {
    const paths = pathsFor("goldstay.com.gh");
    expect(paths).not.toContain("/insights/ghana-stool-land-diaspora-buyer-trap");
    expect(paths).not.toContain("/insights/karen-complete-guide-2026");
  });
});

// The sitemap's lastmod values, guarded at the source.
//
// sitemap.ts cannot be imported here: it calls headers() and reaches
// the whole 350-article catalogue, which is why this file tests the
// pure route logic instead. The one thing worth asserting about the
// wiring is the mistake it used to make.
describe("the sitemap does not fake its lastmod dates", () => {
  // Comments are free to quote the old mistake; code is not.
  const src = readFileSync(join(process.cwd(), "src/app/sitemap.ts"), "utf8")
    .split("\n")
    .filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l))
    .join("\n");

  it("does not stamp every URL with the current time", () => {
    // All 377 URLs carried `lastModified: now`, so the sitemap claimed
    // everything changed the moment it was fetched, and changed again
    // on the next deploy. Google uses lastmod only where it is
    // "consistently and verifiably accurate" and ignores it otherwise,
    // so this threw away the signal that decides what gets recrawled
    // first — on a site whose articles are the thing we want crawled.
    expect(
      src,
      "sitemap.ts assigns a single current timestamp to every entry.",
    ).not.toMatch(/lastModified:\s*now\b/);
  });

  it("takes article dates from the article", () => {
    expect(src).toMatch(/updatedAt\s*\?\?\s*.*publishedAt/);
  });
});

// No lastmod may predate the site.
describe("the sitemap's lastmod floor", () => {
  const src = readFileSync(join(process.cwd(), "src/app/sitemap.ts"), "utf8");

  it("floors article dates at the repository's first commit", () => {
    // 150 articles carry a backdated publishedAt in 2024 or 2025; the
    // first commit here is 2026-04-21. Publishing those as lastmod
    // tells Google a URL last changed before it could have first seen
    // it, which reads as "no reason to recrawl" on the articles that
    // are not yet indexed. Worse than the `now` it replaced.
    expect(src, "sitemap.ts has no epoch floor for lastmod").toMatch(
      /EPOCH\s*=\s*"2026-04-21"/,
    );
    expect(src).toMatch(/<\s*EPOCH\s*\?\s*EPOCH\s*:/);
  });
});
