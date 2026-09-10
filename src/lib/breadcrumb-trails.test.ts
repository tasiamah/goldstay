import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// cityTrail was written to stop a page emitting two breadcrumb names
// for one URL, and site.test.ts has asserted that it does. What
// nothing asserted was that the pages actually call it.
//
// They mostly did. CityPage did not, and CityPage renders the
// homepage on goldstay.co.ke, so the single highest-traffic page on
// the site shipped the exact trail the helper exists to prevent:
// "Home" pointing at the root and "Nairobi" pointing at /nairobi,
// which 308s back to the root. Two names, one page, and a redirect in
// the middle of a BreadcrumbList.
//
// Testing the helper in isolation could never catch that, so this
// reads the components off disk instead. It is the same approach
// noindex.test.ts and sitemap-routes.test.ts take, for the same
// reason: the property worth protecting is about the call sites, not
// about the function.

const COMPONENTS = join(process.cwd(), "src/components");

// Every component that renders a city-scoped page and therefore has
// to reason about the root being the city page on a country domain.
const CITY_SCOPED = [
  "CityPage.tsx",
  "NeighbourhoodPage.tsx",
  "NeighbourhoodShortLetPage.tsx",
  "AreasPage.tsx",
];

function source(file: string): string {
  return readFileSync(join(COMPONENTS, file), "utf8");
}

describe("city-scoped breadcrumb trails", () => {
  it("builds the leading steps with cityTrail, not by hand", () => {
    const handRolled = CITY_SCOPED.filter((file) => {
      const src = source(file);
      if (!src.includes("BreadcrumbJsonLd")) return false;
      return !src.includes("cityTrail");
    });

    expect(handRolled).toEqual([]);
  });

  it("never hardcodes a Home step next to a city step", () => {
    // The shape of the original bug, written out so it fails on sight
    // rather than on inspection of a rendered page. A literal
    // { name: "Home" } in one of these files means somebody has
    // rebuilt the trail by hand and reintroduced the ambiguity.
    for (const file of CITY_SCOPED) {
      const src = source(file);
      expect(src, file).not.toMatch(/name:\s*"Home"/);
    }
  });

  it("does not reach for a city path with a falsy-empty fallback", () => {
    // The specific defect: `cityPath` was "" on a country domain,
    // which is falsy, so `cityPath || `/${city}`` fell through to the
    // subpath the domain does not use. Any `|| `/${` in a URL
    // expression here is the same mistake wearing a different name.
    for (const file of CITY_SCOPED) {
      const src = source(file);
      expect(src, file).not.toMatch(/\|\|\s*`\/\$\{/);
    }
  });
});
