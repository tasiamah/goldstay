// Which markets we trade in, and the places that have to agree.
//
// Accra is built and not launched. The pages, the neighbourhood data,
// the Ghana articles and the .com.gh routing all exist and all still
// render — the market is simply not offered to Google as somewhere we
// operate.
//
// That state is easy to get wrong in one direction and easy to break
// in the other, so both are asserted here: nothing unlaunched may
// appear in a sitemap or be indexable, and Kenya must never acquire a
// directive of its own by accident.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  isLaunchedMarket,
  isUnlaunchedCity,
  launchedCities,
  launchedCityPhrase,
  robotsForCity,
  site,
} from "./site";
import { marketsServedBy, sitemapPaths } from "./sitemap-routes";

const HOSTS = ["goldstay.co.ke", "goldstay.com", "goldstay.com.gh"];

describe("the launch flags are coherent", () => {
  it("trades in Kenya and not in Ghana", () => {
    expect(isLaunchedMarket("kenya")).toBe(true);
    expect(isLaunchedMarket("ghana")).toBe(false);
  });

  it("marks exactly the cities of unlaunched markets", () => {
    expect(isUnlaunchedCity("accra")).toBe(true);
    expect(isUnlaunchedCity("Accra")).toBe(true);
    expect(isUnlaunchedCity("nairobi")).toBe(false);
  });

  it("leaves launched cities with no robots directive at all", () => {
    // Not `{ index: true }` — undefined, so Next omits the tag and the
    // page behaves exactly as it did before any of this existed.
    expect(robotsForCity("nairobi")).toBeUndefined();
    expect(robotsForCity("accra")).toEqual({ index: false, follow: true });
  });
});

describe("no unlaunched market reaches a sitemap", () => {
  for (const host of HOSTS) {
    it(`serves only launched markets from ${host}`, () => {
      for (const m of marketsServedBy(host)) {
        expect(
          site.launchedMarkets.includes(m),
          `${host} claims to serve ${m}, which has not launched`,
        ).toBe(true);
      }
    });

    it(`lists no Accra or Ghana URL from ${host}`, () => {
      const paths = sitemapPaths({
        host,
        // Deliberately offered Ghana content. The point is that the
        // market filter drops it even when a caller supplies it.
        postSlugs: {
          kenya: ["a-kenya-post"],
          ghana: ["accra-property-market-review-2026-h1"],
        },
        categorySlugs: { kenya: ["buying"], ghana: ["buying"] },
      });
      const leaked = paths.filter((p) => /accra/i.test(p));
      expect(
        leaked,
        `Unlaunched-market URLs in the ${host} sitemap. A sitemap entry ` +
          `asks Google to index a URL, and these pages carry a noindex ` +
          `and describe a city we do not operate in.`,
      ).toEqual([]);
    });
  }

  it("still lists Nairobi, so the filter has not eaten everything", () => {
    // Vacuity guard: a filter that removed every route would pass the
    // assertions above.
    const paths = sitemapPaths({
      host: "goldstay.co.ke",
      postSlugs: { kenya: ["a-kenya-post"], ghana: [] },
      categorySlugs: { kenya: ["buying"], ghana: [] },
    });
    expect(paths).toContain("/nairobi/buy");
    expect(paths).toContain("/insights/a-kenya-post");
    expect(paths.length).toBeGreaterThan(20);
  });
});

describe("the routes and copy honour the flag", () => {
  const read = (p: string) => readFileSync(join(process.cwd(), p), "utf8");

  it("noindexes every Accra route", () => {
    for (const p of [
      "src/app/(marketing)/accra/page.tsx",
      "src/app/(marketing)/accra/buy/page.tsx",
      "src/app/(marketing)/accra/areas/page.tsx",
      "src/app/(marketing)/accra/[neighbourhood]/page.tsx",
    ]) {
      expect(read(p), `${p} does not call robotsForCity`).toContain(
        'robotsForCity("accra")',
      );
    }
    // The /from route is city-generic, so it passes the city through
    // rather than hardcoding one.
    expect(
      read("src/app/(marketing)/from/[origin]/[city]/page.tsx"),
    ).toContain("robotsForCity(r.city)");
  });

  it("noindexes articles belonging to an unlaunched market", () => {
    const route = read("src/app/(marketing)/insights/[slug]/page.tsx");
    expect(route).toContain("isLaunchedMarket(post.meta.country)");
  });

  it("names only launched cities in the shared city phrase", () => {
    // The phrase is used by the author bio on every article page, the
    // hero eyebrow, the footer, the OG description and the yield
    // calculator, so this one assertion covers about 180 pages.
    expect(launchedCityPhrase()).toBe("Nairobi");
    expect(launchedCityPhrase(" · ")).toBe("Nairobi");
    for (const city of site.unlaunchedCities) {
      expect(launchedCityPhrase().toLowerCase()).not.toContain(city);
      expect(launchedCities()).not.toContain(city);
    }
  });

  it("keeps no dual-city literal in the copy the phrase replaced", () => {
    // Guards the specific strings that were reverted by hand, so a
    // future edit cannot quietly reintroduce one.
    for (const p of [
      "src/components/Hero.tsx",
      "src/components/Footer.tsx",
      "src/components/TrustStrip.tsx",
      "src/components/FounderLetter.tsx",
      "src/components/CalculatorTeaser.tsx",
      "src/components/YieldCalculator.tsx",
      "src/app/opengraph-image.tsx",
      "src/app/(marketing)/insights/posts/_shared.ts",
    ]) {
      const src = read(p);
      // Comments are allowed to discuss the phrase; code is not.
      const code = src
        .split("\n")
        .filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l))
        .join("\n");
      expect(
        code,
        `${p} hardcodes a dual-city phrase. Use launchedCityPhrase() ` +
          `so it follows site.launchedMarkets.`,
        // Whitespace-tolerant on purpose. The homepage H1 read
        // "property management in Nairobi\n&amp; Accra." and survived
        // a single-line search of all thirty other occurrences,
        // because JSX had wrapped it across two lines. It was the most
        // weighted phrase on the page we most want to rank.
      ).not.toMatch(/Nairobi\s*(and|&|&amp;|·)\s*Accra/);
    }
  });

  it("does not name an unlaunched city in the entity description", () => {
    // site.description is the Organization schema description, which is
    // the field most likely to be quoted back as "what is this
    // company". It should name only cities we trade in.
    for (const city of site.unlaunchedCities) {
      expect(
        site.description.toLowerCase().includes(city),
        `The entity description names ${city}, which has not launched. ` +
          `It splits the geographic focus for a city we cannot serve.`,
      ).toBe(false);
    }
    expect(site.description).toMatch(/Nairobi/);
  });
});
