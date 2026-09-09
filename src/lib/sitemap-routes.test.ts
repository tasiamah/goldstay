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

  it("has the Kenya domain stand in for the market whose domain is dark", () => {
    expect(marketsServedBy("goldstay.co.ke")).toEqual(["kenya", "ghana"]);
  });

  it("scopes to Ghana alone when served from the Ghana domain", () => {
    expect(marketsServedBy("goldstay.com.gh")).toEqual(["ghana"]);
  });

  it("is case insensitive about the host", () => {
    expect(marketsServedBy("GoldStay.CO.KE")).toEqual(["kenya", "ghana"]);
  });
});

describe("sitemapPaths on the Kenya domain", () => {
  it("advertises the Accra routes, because it is the host serving them", () => {
    const paths = pathsFor("goldstay.co.ke");
    // /accra/areas rather than a named suburb: the Accra
    // neighbourhood pages were consolidated into it, since all five
    // measured ~69% identical to each other with no properties
    // behind them. See the `profile` comment in lib/site.ts.
    for (const p of ["/accra", "/accra/buy", "/accra/areas", "/from/uk/accra"]) {
      expect(paths).toContain(p);
    }
  });

  it("advertises the Ghana articles and their categories", () => {
    const paths = pathsFor("goldstay.co.ke");
    expect(paths).toContain("/insights/ghana-stool-land-diaspora-buyer-trap");
    expect(paths).toContain("/insights/buying-property-accra-diaspora-2026-guide");
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
  it("drops the Kenya routes and collapses /accra into the root", () => {
    const paths = pathsFor("goldstay.com.gh");
    expect(paths).toContain("");
    expect(paths).toContain("/accra/areas");
    expect(paths).not.toContain("/accra");
    expect(paths).not.toContain("/nairobi/kilimani");
    expect(paths).not.toContain("/from/uk/nairobi");
  });

  it("lists only the Ghana articles", () => {
    const paths = pathsFor("goldstay.com.gh");
    expect(paths).toContain("/insights/ghana-stool-land-diaspora-buyer-trap");
    expect(paths).not.toContain("/insights/karen-complete-guide-2026");
  });
});
