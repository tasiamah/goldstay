import { describe, expect, it } from "vitest";
import {
  alternateLanguagesFor,
  canonicalHostForCountry,
  insightAlternates,
  isLiveDomain,
  liveDomainOr,
  site,
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
