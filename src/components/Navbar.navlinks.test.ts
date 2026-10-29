import { describe, expect, it } from "vitest";
import { getNavLinks } from "./Navbar";
import { site, soleLiveDomain } from "@/lib/site";

// The navbar renders on every page, so a nav link pointing at a
// redirect is a redirect on all ~420 URLs at once.
//
// This has now gone wrong three times. First the city picker linked to
// /accra and /nairobi from every non-city page. Then the neighbourhood
// pages linked "back to city" at /nairobi. Then Services and FAQ were
// anchored at /{city}#… on every /nairobi/* page. The shape is always
// the same: /{city} looks like the city's address, but on that city's
// own domain the address is "/" and /{city} 308s to it.
describe("getNavLinks", () => {
  const sole = soleLiveDomain();
  const cityOfSoleDomain =
    sole === site.domains.nairobi
      ? ("nairobi" as const)
      : sole === site.domains.accra
        ? ("accra" as const)
        : null;

  it("never links to a bare /{city} path while that city owns the only live domain", () => {
    if (!cityOfSoleDomain) return;
    const prefix = `/${cityOfSoleDomain}`;
    for (const { href, label } of getNavLinks(cityOfSoleDomain)) {
      // /{city}/buy and friends are real pages. The redirect is the
      // city root itself, bare or carrying only a fragment.
      const isCityRoot = href === prefix || href.startsWith(`${prefix}#`);
      expect(isCityRoot, `"${label}" links to ${href}, which redirects`).toBe(
        false,
      );
    }
  });

  it("anchors the city sections at the root on that city's own domain", () => {
    if (!cityOfSoleDomain) return;
    const hrefs = getNavLinks(cityOfSoleDomain).map((l) => l.href);
    expect(hrefs).toContain("/#services");
    expect(hrefs).toContain("/#faq");
  });

  it("keeps city sub-routes under /{city}", () => {
    const hrefs = getNavLinks("nairobi").map((l) => l.href);
    expect(hrefs).toContain("/nairobi/buy");
  });

  it("anchors at /{city} for a city that does not own the serving domain", () => {
    // Whichever city is not the sole live domain's city still reaches
    // its own page at /{city}, so the anchor keeps the prefix.
    const other = cityOfSoleDomain === "nairobi" ? "accra" : "nairobi";
    const hrefs = getNavLinks(other).map((l) => l.href);
    expect(hrefs).toContain(`/${other}#services`);
  });

  it("produces no empty or protocol-relative hrefs for any city", () => {
    for (const city of ["nairobi", "accra", null] as const) {
      for (const { href, label } of getNavLinks(city)) {
        expect(href.startsWith("/"), `"${label}" href is ${href}`).toBe(true);
        expect(href.startsWith("//"), `"${label}" href is ${href}`).toBe(false);
      }
    }
  });
});
