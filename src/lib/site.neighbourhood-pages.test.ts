// Keeps the neighbourhood page set, the redirects and the publication
// rule in agreement.
//
// The rule: an area gets its own URL only if it has a `profile`, i.e.
// something true to say about letting there that its siblings cannot
// claim. Areas without one are listed on /<city>/areas and redirected
// there.
//
// Three places have to agree for that to hold — the data in site.ts,
// generateStaticParams on the route, and the redirect list in
// next.config.mjs — and next.config cannot import TypeScript, so the
// third is a hand-maintained list. This test is what makes that
// acceptable: add a profile without updating the redirect and the
// suite fails, rather than the area quietly redirecting away from the
// page it just earned.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  cities,
  neighbourhoodSlug,
  profiledNeighbourhoods,
  unprofiledNeighbourhoods,
} from "./site";
import { sitemapPaths } from "./sitemap-routes";

const CITIES = ["nairobi", "accra"] as const;

const CONFIG = readFileSync(
  join(process.cwd(), "next.config.mjs"),
  "utf8",
);

// The `consolidated` object literal out of next.config.mjs, parsed by
// reading the slug strings under each city key.
function redirectedSlugs(city: string): string[] {
  const block = CONFIG.match(
    new RegExp(`${city}:\\s*\\[([^\\]]*)\\]`, "m"),
  );
  if (!block) return [];
  return [...block[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

describe("neighbourhood page publication rule", () => {
  it("parses the redirect list out of next.config", () => {
    // Vacuity guard: if the regex stops matching, every comparison
    // below would trivially pass with two empty arrays.
    expect(CONFIG).toContain("const consolidated");
    expect(redirectedSlugs("nairobi").length).toBeGreaterThan(0);
  });

  for (const city of CITIES) {
    describe(city, () => {
      it("redirects exactly the areas without a profile", () => {
        const expected = unprofiledNeighbourhoods(city)
          .map((n) => neighbourhoodSlug(n.name))
          .sort();
        expect(redirectedSlugs(city).sort()).toEqual(expected);
      });

      it("never redirects an area that has a page", () => {
        const redirected = new Set(redirectedSlugs(city));
        const published = profiledNeighbourhoods(city).map((n) =>
          neighbourhoodSlug(n.name),
        );
        const conflict = published.filter((s) => redirected.has(s));

        expect(
          conflict,
          `These areas have a profile, so they have a page, and are ` +
            `also being redirected away from it. Remove them from ` +
            `\`consolidated\` in next.config.mjs.`,
        ).toEqual([]);
      });

      it("accounts for every area exactly once", () => {
        const all = cities[city].neighbourhoods.length;
        expect(
          profiledNeighbourhoods(city).length +
            unprofiledNeighbourhoods(city).length,
        ).toBe(all);
      });
    });
  }
});

describe("the sitemap advertises only pages that serve a 200", () => {
  // Submitting a URL that 301s is telling Google a page exists in one
  // breath and that it does not in the next, and it is the specific
  // mistake that is easy to make here: the sitemap built its
  // neighbourhood list from every entry in the cities map, so adding
  // a redirect without narrowing that list would have kept all
  // thirteen consolidated URLs in the sitemap indefinitely.
  const paths = sitemapPaths({
    host: "goldstay.co.ke",
    postSlugs: { kenya: [], ghana: [] },
    categorySlugs: { kenya: [], ghana: [] },
  });

  it("lists the areas comparison page for every launched city", () => {
    expect(paths).toContain("/nairobi/areas");
    // /accra/areas was here until Accra was pulled from the index as
    // an unlaunched market. The page still builds and still renders;
    // it is simply no longer advertised. See site.launchedMarkets.
    expect(paths).not.toContain("/accra/areas");
  });

  it("lists every area that has a page", () => {
    for (const city of CITIES) {
      for (const n of profiledNeighbourhoods(city)) {
        expect(paths).toContain(`/${city}/${neighbourhoodSlug(n.name)}`);
      }
    }
  });

  it("lists no area that redirects", () => {
    const advertised: string[] = [];
    for (const city of CITIES) {
      for (const n of unprofiledNeighbourhoods(city)) {
        const path = `/${city}/${neighbourhoodSlug(n.name)}`;
        if (paths.includes(path)) advertised.push(path);
      }
    }
    expect(
      advertised,
      `These URLs are in the sitemap and also 301 to the areas page. ` +
        `Build the sitemap's neighbourhood list from ` +
        `profiledNeighbourhoods, not from the full cities map.`,
    ).toEqual([]);
  });

  // The children outlived their parents on purpose; they were never
  // the duplication problem and they are the commercially valuable
  // half of the cluster.
  it("keeps the /airbnb-management pages for consolidated areas", () => {
    const orphaned = unprofiledNeighbourhoods("nairobi")
      .filter((n) => n.shortLet)
      .map((n) => `/nairobi/${neighbourhoodSlug(n.name)}/airbnb-management`);

    expect(orphaned.length).toBeGreaterThan(0);
    for (const path of orphaned) {
      expect(paths, `${path} should still be advertised`).toContain(path);
    }
  });
});

describe("the footer does not link areas that redirect", () => {
  // The footer renders on all 424 pages, so one link to a consolidated
  // area is several hundred links to a 301. It mapped the full cities
  // list, which was correct until 1.16.0 gave the unprofiled areas a
  // redirect and nobody revisited the footer — the crawler was being
  // sent to /nairobi/parklands from every page on the site and told
  // each time that the page is really /nairobi/areas.
  const FOOTER = readFileSync(
    join(process.cwd(), "src/components/Footer.tsx"),
    "utf8",
  );

  it("builds its list from the areas that have a page", () => {
    expect(FOOTER).toContain("profiledNeighbourhoods");
    expect(
      FOOTER.includes("cities[cityKey].neighbourhoods"),
      `The footer is mapping every area again, including the ones that ` +
        `301 to the areas page. Build the list from profiledNeighbourhoods.`,
    ).toBe(false);
  });

  it("still offers a route to the consolidated areas", () => {
    expect(FOOTER).toContain("/areas");
  });
});

describe("a profile is substantial enough to justify a URL", () => {
  // The whole point is that these pages stop being near-duplicates,
  // which only holds if the unique part is actually substantial. The
  // old pages carried ~120 unique words; these floors are set well
  // above that and well below what the three current profiles have,
  // so they catch a stub being added rather than police prose style.
  const MIN_SECTION_WORDS = 45;
  const MIN_TOTAL_WORDS = 350;
  const MIN_FAQ_ITEMS = 3;

  const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

  for (const city of CITIES) {
    for (const n of profiledNeighbourhoods(city)) {
      describe(`${n.name} (${city})`, () => {
        const p = n.profile!;

        it("has substance in every section", () => {
          for (const [key, text] of Object.entries({
            character: p.character,
            demand: p.demand,
            stock: p.stock,
            friction: p.friction,
          })) {
            expect(words(text), `${key} is too short`).toBeGreaterThanOrEqual(
              MIN_SECTION_WORDS,
            );
          }
        });

        it("has enough of it in total", () => {
          const total =
            words(p.character) +
            words(p.demand) +
            words(p.stock) +
            words(p.friction) +
            p.faq.reduce((s, f) => s + words(f.q) + words(f.a), 0);
          expect(total).toBeGreaterThanOrEqual(MIN_TOTAL_WORDS);
        });

        it("answers its own questions rather than the city's", () => {
          expect(p.faq.length).toBeGreaterThanOrEqual(MIN_FAQ_ITEMS);
          for (const f of p.faq) {
            expect(f.q.trim().endsWith("?"), f.q).toBe(true);
            expect(words(f.a), f.q).toBeGreaterThanOrEqual(20);
          }
        });

        // The failure mode that produced the original problem: text
        // that mentions the area by name but would read identically
        // with any other area's name substituted in.
        it("names the place it is about", () => {
          const blob = [p.character, p.demand, p.stock, p.friction].join(" ");
          expect(blob).toContain(n.name);
        });
      });
    }
  }
});

describe("profiles are not copies of each other", () => {
  // A cheap direct check on the thing being fixed. Shingles the prose
  // of every profile and asserts no two overlap much. The old pages
  // sat at 73% mean pairwise overlap; anything approaching that here
  // would mean a profile was written by editing a sibling's.
  const MAX_PAIRWISE_OVERLAP = 0.2;

  const shingles = (text: string, n = 6) => {
    const w = text.toLowerCase().split(/\s+/).filter(Boolean);
    const out = new Set<string>();
    for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(" "));
    return out;
  };

  const jaccard = (a: Set<string>, b: Set<string>) => {
    let inter = 0;
    for (const s of a) if (b.has(s)) inter++;
    return inter / (a.size + b.size - inter);
  };

  const all = CITIES.flatMap((city) =>
    profiledNeighbourhoods(city).map((n) => ({
      name: `${n.name} (${city})`,
      sh: shingles(
        [
          n.profile!.character,
          n.profile!.demand,
          n.profile!.stock,
          n.profile!.friction,
          ...n.profile!.faq.map((f) => `${f.q} ${f.a}`),
        ].join(" "),
      ),
    })),
  );

  it("has profiles to compare", () => {
    expect(all.length).toBeGreaterThanOrEqual(2);
  });

  it("keeps every pair well below the duplicate threshold", () => {
    const bad: string[] = [];
    for (let i = 0; i < all.length; i++) {
      for (let j = i + 1; j < all.length; j++) {
        const sim = jaccard(all[i].sh, all[j].sh);
        if (sim > MAX_PAIRWISE_OVERLAP) {
          bad.push(`${all[i].name} vs ${all[j].name}: ${(sim * 100).toFixed(1)}%`);
        }
      }
    }
    expect(
      bad,
      `These profiles are too similar to each other. The pages they ` +
        `render are supposed to be the fix for near-duplicate area ` +
        `pages, so writing one by editing another defeats the purpose.`,
    ).toEqual([]);
  });
});
