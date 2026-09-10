import { describe, expect, it } from "vitest";
import {
  alternateLanguagesFor,
  baseUrlFor,
  canonicalHostForCountry,
  cities,
  cityCanonical,
  cityTrail,
  formatOpeningHours,
  type Neighbourhood,
  insightAlternates,
  openingHours,
  isLiveDomain,
  liveDomainOr,
  logoObject,
  orgId,
  websiteId,
  neighbourhoodSlug,
  shortLetNeighbourhoods,
  site,
  soleLiveDomain,
} from "./site";

// Guards the domain layer, which had a bug worth a permanent test.
//
// Every Kenya article used to publish `rel=canonical` pointing at
// goldstay.com, a domain we do not own and which resolves to a
// for-sale lander. A canonical is an instruction to rank the named URL
// instead of this one, so the entire insights catalogue was telling
// Google to credit a parked page and rank nothing on .co.ke.
//
// The invariant these tests exist to hold: we never emit an absolute URL
// on a domain that is not in site.liveDomains.

const ALL_DOMAINS = Object.values(site.domains);

function hostOf(url: string) {
  return new URL(url).host;
}

describe("liveDomains", () => {
  it("only claims domains we actually serve", () => {
    // Tightening this is the point of the list. If .com or .com.gh get
    // bought and pointed at Vercel, add them here and to liveDomains
    // together, having checked they resolve over HTTPS first.
    expect(site.liveDomains).toEqual(["goldstay.co.ke"]);
  });

  it("names the canonical domain as the one we own", () => {
    expect(site.domain).toBe("goldstay.co.ke");
    expect(isLiveDomain(site.domain)).toBe(true);
  });

  it("does not treat the unowned domains as live", () => {
    expect(isLiveDomain("goldstay.com")).toBe(false);
    expect(isLiveDomain("goldstay.com.gh")).toBe(false);
  });

  it("resolves a dark domain to one that serves", () => {
    expect(liveDomainOr("goldstay.com")).toBe("goldstay.co.ke");
    expect(liveDomainOr("goldstay.com.gh")).toBe("goldstay.co.ke");
    expect(liveDomainOr("goldstay.co.ke")).toBe("goldstay.co.ke");
  });

  // This is what lets getServerCity, enforceCityHost and the article
  // cross-domain gate resolve without reading the request host, which
  // is in turn what keeps the marketing tree statically generated. If a
  // second domain goes live they all go back on the request, and the
  // pages go back to rendering per request — correct, but slower, so it
  // is worth knowing that is the trade being made.
  it("collapses to a single domain while only one is live", () => {
    expect(soleLiveDomain()).toBe("goldstay.co.ke");
  });
});

describe("the structured-data identity", () => {
  // These exist so the graph is one entity with many pages rather than
  // a fresh anonymous Organization on every URL, which is what emitting
  // an inline `Organization { name: "Goldstay" }` per page amounted to.
  it("identifies the company and the site on the domain we own", () => {
    expect(orgId()).toBe("https://goldstay.co.ke/#organization");
    expect(websiteId()).toBe("https://goldstay.co.ke/#website");
    expect(isLiveDomain(hostOf(orgId()))).toBe(true);
  });

  it("keeps the ids stable rather than tracking the serving host", () => {
    // An @id is an identifier, not a link. If it changed per domain the
    // same company would read as two, and the references pointing at it
    // from Service, Article and WebSite would dangle.
    expect(orgId()).toContain(site.domain);
    expect(orgId()).not.toContain(site.domains.main);
  });

  it("publishes a logo with absolute url and stated dimensions", () => {
    // Google documents a publisher logo as required for article rich
    // results and it was absent, so none of the 350 posts qualified.
    const logo = logoObject();
    expect(logo["@type"]).toBe("ImageObject");
    expect(logo.url).toBe(
      "https://goldstay.co.ke/images/brand/email-logo.png",
    );
    expect(logo.width).toBe(256);
    expect(logo.height).toBe(256);
    // Comfortably over Google's 112x112 floor, and square.
    expect(logo.width).toBeGreaterThanOrEqual(112);
    expect(logo.width).toBe(logo.height);
  });
});

describe("cityCanonical", () => {
  // The bug this locks out: goldstay.co.ke/ and goldstay.co.ke/nairobi
  // are the same page (next.config.mjs rewrites the root), and the root
  // was publishing rel=canonical pointing at /nairobi. The homepage —
  // the URL that carries the brand query and nearly every inbound link
  // — was telling Google to credit a subpage instead, while the sitemap
  // submitted both.
  it("points a live country domain's city page at its root", () => {
    expect(cityCanonical("nairobi")).toBe("https://goldstay.co.ke");
  });

  it("has no trailing slash, so it matches the sitemap exactly", () => {
    // A canonical of ".../" against a sitemap entry of "..." is two
    // URLs as far as Google is concerned.
    const inSitemap = `https://${site.domains.nairobi}`;
    expect(cityCanonical("nairobi")).toBe(inSitemap);
  });

  it("falls back to the /{city} URL while a country domain is dark", () => {
    // .com.gh does not resolve, so /accra on .co.ke is the only address
    // this page has and therefore the only honest canonical.
    expect(cityCanonical("accra")).toBe("https://goldstay.co.ke/accra");
  });

  it("never names a domain we do not serve", () => {
    for (const city of ["nairobi", "accra"] as const) {
      expect(isLiveDomain(hostOf(cityCanonical(city)))).toBe(true);
    }
  });

  it("agrees with the hreflang alternate for the same page", () => {
    // Canonical and en-KE hreflang both have to name the root, or the
    // two tags contradict each other and Google discards the cluster.
    expect(alternateLanguagesFor("/nairobi")["en-KE"]).toBe(
      cityCanonical("nairobi"),
    );
  });
});

describe("baseUrlFor", () => {
  it("never names a domain we do not serve", () => {
    // Reached on the Ghana host too, which is still dark; an absolute
    // schema URL on a domain that does not resolve describes a site
    // that is not there.
    for (const domainCity of ["nairobi", "accra", null] as const) {
      expect(isLiveDomain(hostOf(baseUrlFor(domainCity)))).toBe(true);
    }
  });
});

describe("cityTrail", () => {
  // The bug this locks out: once the Nairobi page became canonical at
  // the root, a trail of "Home" then "Nairobi" put two different names
  // on one URL. A BreadcrumbList like that does not say where the page
  // sits, and Google's guidance is to drop the trail rather than guess.
  it("collapses to one step when the root is the city page", () => {
    expect(cityTrail("nairobi", "nairobi")).toEqual([
      { name: "Nairobi", url: "https://goldstay.co.ke" },
    ]);
  });

  it("never repeats a URL under two names", () => {
    const combinations = [
      ["nairobi", "nairobi"],
      ["nairobi", null],
      ["accra", "accra"],
      ["accra", null],
    ] as const;
    for (const [city, domainCity] of combinations) {
      const urls = cityTrail(city, domainCity).map((s) => s.url);
      expect(new Set(urls).size).toBe(urls.length);
    }
  });

  it("keeps both steps where the city page is a real subpage", () => {
    // Accra is dark, so on the neutral domain it genuinely lives one
    // level below the root and the trail should say so.
    expect(cityTrail("accra", null)).toEqual([
      { name: "Home", url: "https://goldstay.co.ke" },
      { name: "Accra", url: "https://goldstay.co.ke/accra" },
    ]);
  });

  it("ends on the URL the city page is canonical at", () => {
    for (const city of ["nairobi", "accra"] as const) {
      const trail = cityTrail(city, city);
      expect(trail[trail.length - 1]?.url).toBe(cityCanonical(city));
    }
  });
});

describe("insightAlternates", () => {
  it("canonicalises Kenya articles to the domain we own", () => {
    const { canonical } = insightAlternates("airbnb-nairobi-guide", "kenya");
    expect(canonical).toBe(
      "https://goldstay.co.ke/insights/airbnb-nairobi-guide",
    );
  });

  it("never points a canonical at an unowned domain", () => {
    for (const country of ["kenya", "ghana"] as const) {
      const { canonical } = insightAlternates("some-slug", country);
      expect(isLiveDomain(hostOf(canonical))).toBe(true);
    }
  });

  it("keeps Ghana articles reachable while .com.gh is dark", () => {
    // Not ideal but deliberate: canonicalising to a domain that does not
    // resolve would deindex them entirely. They stay out of the Kenya
    // sitemap, so this does not push Ghana pages at Kenyan searchers.
    const { canonical } = insightAlternates("accra-guide", "ghana");
    expect(canonical).toBe("https://goldstay.co.ke/insights/accra-guide");
  });

  it("emits no hreflang alternate on a dark domain", () => {
    const { languages } = insightAlternates("accra-guide", "ghana");
    for (const url of Object.values(languages)) {
      expect(isLiveDomain(hostOf(url))).toBe(true);
    }
  });

  it("always declares an x-default", () => {
    for (const country of ["kenya", "ghana"] as const) {
      const { languages } = insightAlternates("some-slug", country);
      expect(languages["x-default"]).toBeDefined();
    }
  });
});

describe("alternateLanguagesFor", () => {
  const PATHS = [
    "",
    "/",
    "/nairobi",
    "/accra",
    "/nairobi/kilimani",
    "/accra/east-legon",
    "/airbnb-management",
    "/list-your-property",
  ];

  it("never advertises an alternate on a domain that is not live", () => {
    for (const path of PATHS) {
      for (const [tag, url] of Object.entries(alternateLanguagesFor(path))) {
        expect(
          isLiveDomain(hostOf(url)),
          `${path} advertised ${tag} on ${hostOf(url)}`,
        ).toBe(true);
      }
    }
  });

  it("always declares an x-default", () => {
    for (const path of PATHS) {
      expect(alternateLanguagesFor(path)["x-default"]).toBeDefined();
    }
  });

  it("never declares the same URL under two language tags", () => {
    // With one live domain, en-KE and en-GH would otherwise both resolve
    // to .co.ke. Two language tags claiming one URL is a contradiction
    // Google resolves by discarding the cluster.
    //
    // x-default is excluded because it is a fallback marker rather than
    // a language, and pointing it at the same URL as the only language
    // version is both valid and what we want here.
    for (const path of PATHS) {
      const urls = Object.entries(alternateLanguagesFor(path))
        .filter(([tag]) => tag !== "x-default")
        .map(([, url]) => url);
      expect(new Set(urls).size, `duplicate alternates on ${path}`).toBe(
        urls.length,
      );
    }
  });

  it("keeps the .co.ke path for a page whose own domain is dark", () => {
    // The .co.ke root rewrites to /nairobi, so /accra has no root alias
    // here and must keep its full path rather than collapsing to "/".
    expect(alternateLanguagesFor("/accra")["x-default"]).toBe(
      "https://goldstay.co.ke/accra",
    );
  });

  it("maps the Kenya home page to the bare domain", () => {
    // .co.ke/ rewrites to /nairobi at the edge, so /nairobi's Kenya URL
    // is the root and not /nairobi.
    expect(alternateLanguagesFor("/nairobi")["en-KE"]).toBe(
      "https://goldstay.co.ke",
    );
  });

  it("gives service pages a canonical Kenya alternate", () => {
    expect(alternateLanguagesFor("/airbnb-management")["en-KE"]).toBe(
      "https://goldstay.co.ke/airbnb-management",
    );
  });
});

describe("canonicalHostForCountry", () => {
  it("returns a live host for either market", () => {
    for (const country of ["kenya", "ghana"] as const) {
      expect(isLiveDomain(canonicalHostForCountry(country))).toBe(true);
    }
  });

  it("sends Kenya to the Kenya domain", () => {
    expect(canonicalHostForCountry("kenya")).toBe("goldstay.co.ke");
  });
});

describe("short-let neighbourhood data", () => {
  const all = shortLetNeighbourhoods("nairobi");

  it("publishes a page only where we have short-stay data", () => {
    expect(all.length).toBeGreaterThan(0);
    for (const n of all) {
      expect(n.shortLet).toBeDefined();
    }
  });

  it("leaves out the neighbourhoods where short-letting does not work", () => {
    // Karen and Runda are standalone-house suburbs a long way from any
    // business district. Generating a service page for them would mean
    // publishing a template with nothing true to say, which is the
    // doorway-page pattern Google demotes.
    const names = all.map((n) => n.name);
    expect(names).not.toContain("Karen");
    expect(names).not.toContain("Runda");
  });

  it("covers the neighbourhoods the article catalogue leans on", () => {
    const names = all.map((n) => n.name);
    for (const expected of ["Westlands", "Kilimani", "Gigiri", "Riverside"]) {
      expect(names).toContain(expected);
    }
  });

  it("gives every page something of its own to say", () => {
    // The guard against these turning into one page printed nine times.
    // note and caveat are the fields that carry the local specifics, so
    // they have to be real prose rather than a stub.
    for (const n of all) {
      expect(n.shortLet.note.length, `${n.name} note`).toBeGreaterThan(120);
      expect(n.shortLet.caveat.length, `${n.name} caveat`).toBeGreaterThan(80);
      expect(n.shortLet.guests.length, `${n.name} guests`).toBeGreaterThan(20);
    }
  });

  it("says something different on each page", () => {
    for (const field of ["note", "caveat", "guests"] as const) {
      const values = all.map((n) => n.shortLet[field]);
      expect(new Set(values).size, `duplicated ${field}`).toBe(values.length);
    }
  });

  it("quotes coherent rate and occupancy bands", () => {
    for (const n of all) {
      const { nightlyUsd, occupancyPct } = n.shortLet;
      expect(nightlyUsd.min, `${n.name} nightly`).toBeLessThan(nightlyUsd.max);
      expect(occupancyPct.min, `${n.name} occupancy`).toBeLessThan(
        occupancyPct.max,
      );
      // Sanity bounds. A nightly rate outside this range or an occupancy
      // above 80% is a typo or wishful thinking, and both would be
      // published as a promise to a landlord.
      expect(nightlyUsd.min).toBeGreaterThan(40);
      expect(nightlyUsd.max).toBeLessThan(400);
      expect(occupancyPct.max).toBeLessThanOrEqual(80);
    }
  });

  it("keeps short-let gross above the long lease it is compared against", () => {
    // The pages put these side by side. If the arithmetic ever inverts,
    // the comparison section silently argues against itself.
    for (const n of all) {
      const grossLow = Math.round(
        (n.shortLet.nightlyUsd.min * 30 * n.shortLet.occupancyPct.min) / 100,
      );
      expect(grossLow, `${n.name} short-let gross`).toBeGreaterThan(
        n.twoBrUsd.min * 0.8,
      );
    }
  });

  it("generates a unique slug per page", () => {
    const slugs = all.map((n) => neighbourhoodSlug(n.name));
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) {
      expect(s).toMatch(/^[a-z0-9-]+$/);
    }
  });
});

describe("the domain map", () => {
  it("lists every domain as a bare host with no scheme or path", () => {
    // These get interpolated straight into `https://${domain}${path}`,
    // so a stray scheme or trailing slash silently produces a malformed
    // canonical rather than an obvious crash.
    for (const domain of ALL_DOMAINS) {
      expect(domain).not.toContain("/");
      expect(domain).not.toContain(":");
      expect(domain).toBe(domain.toLowerCase());
    }
  });
});

describe("the rent benchmark matches the housing that exists", () => {
  // The neighbourhood page quotes its rent band as "well-finished
  // 2-bed apartments in <area>", which is true for the apartment
  // suburbs and false for the standalone-house ones. Karen and Runda
  // now have profiles that say in as many words that apartment stock
  // there is absent, so leaving the default label in place would have
  // the page contradict itself inside one screen — the kind of detail
  // that costs credibility with exactly the landlord we want reading.
  for (const name of ["Karen", "Runda"]) {
    it(`${name} does not quote apartment comparables`, () => {
      const n: Neighbourhood | undefined = cities.nairobi.neighbourhoods.find(
        (x) => x.name === name,
      );
      expect(n, `${name} is missing from the neighbourhood list`).toBeDefined();
      expect(
        n!.benchmarkUnit,
        `${name} is a standalone-house suburb, so its rent band cannot be ` +
          `labelled as plain 2-bed apartments.`,
      ).toBeTruthy();
    });
  }
});

// Guards the entity claims, which are easy to get subtly wrong.
//
// `site.sameAs` feeds the RealEstateAgent node's sameAs array, which
// is how Google resolves scattered mentions of us into a single
// entity. It used to include a LinkedIn /in/ URL, which is a personal
// profile: the schema was asserting that the Goldstay organisation is
// also a LinkedIn person. That is the same mistake the article
// bylines made before v1.9.1, when 324 posts declared the editorial
// desks were human beings, and it undermines the exact entity the
// rest of the schema exists to sharpen.
//
// The distinction these tests exist to preserve is that
// `site.socials` is a list of links a human might click, while
// `site.sameAs` is a machine-readable claim about who we are. The
// second is a subset and has to meet a higher bar, so the natural
// mistake, adding a handle to socials and wiring it straight into
// sameAs, is the one worth failing on.
describe("site.sameAs", () => {
  it("claims at least one profile", () => {
    expect(site.sameAs.length).toBeGreaterThan(0);
  });

  it("only contains absolute https URLs", () => {
    for (const url of site.sameAs) {
      expect(url, url).toMatch(/^https:\/\//);
      expect(() => new URL(url), url).not.toThrow();
    }
  });

  // The specific regression. A /company/ URL is the Organization and
  // is welcome here; /in/ is a Person and is not.
  it("does not claim a personal LinkedIn profile as the organisation", () => {
    for (const url of site.sameAs) {
      expect(url, url).not.toMatch(/linkedin\.com\/in\//);
    }
  });

  it("has no duplicates", () => {
    expect(new Set(site.sameAs).size).toBe(site.sameAs.length);
  });

  // The Maps URL is the one entry a person is likely to "update" by
  // pasting what the Maps address bar gave them. That URL carries a
  // viewport, a zoom level and a session token, so it differs every
  // time it is copied and names a view rather than a place. Two
  // copies of it would also read as two different profiles.
  it("names the Maps place by its stable place ID", () => {
    expect(site.googleMapsUrl).toBe(
      `https://www.google.com/maps/place/?q=place_id:${site.googleMapsPlaceId}`,
    );
    expect(site.sameAs).toContain(site.googleMapsUrl);
  });

  it("claims the Maps place exactly once", () => {
    const maps = site.sameAs.filter((u) => u.includes("google.com/maps"));
    expect(maps).toEqual([site.googleMapsUrl]);
  });
});

// The footer used to humanise these hours with a literal replace of
// "Mo-Fr". That is invisible when it stops matching: the string still
// renders, just as raw schema notation, so the page reads "Mo-Sa
// 09:00-18:00" and nothing fails. These tests exist so the next
// change to the hours cannot do that again.
describe("openingHours", () => {
  it("is valid schema.org day-time notation", () => {
    for (const entry of openingHours) {
      expect(entry, entry).toMatch(
        /^(Mo|Tu|We|Th|Fr|Sa|Su)(-(Mo|Tu|We|Th|Fr|Sa|Su))? \d{2}:\d{2}-\d{2}:\d{2}$/,
      );
    }
  });

  it("opens before it closes", () => {
    for (const entry of openingHours) {
      const [, times] = entry.split(" ");
      const [open, close] = times.split("-");
      expect(open.localeCompare(close), entry).toBeLessThan(0);
    }
  });

  it("renders every day abbreviation as a word", () => {
    expect(formatOpeningHours()).not.toMatch(
      /\b(Mo|Tu|We|Th|Fr|Sa|Su)\b/,
    );
  });

  it("humanises a day range", () => {
    expect(formatOpeningHours(["Mo-Sa 09:00-18:00"])).toBe(
      "Mon–Sat 09:00-18:00",
    );
  });

  it("humanises a single day and joins multiple entries", () => {
    expect(formatOpeningHours(["Mo-Fr 09:00-18:00", "Sa 10:00-14:00"])).toBe(
      "Mon–Fri 09:00-18:00, Sat 10:00-14:00",
    );
  });
});
