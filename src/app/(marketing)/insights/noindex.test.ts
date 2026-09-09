// The noindexed articles, and the places that have to agree about
// them.
//
// Asked to describe the business, a search engine read the site and
// answered "a Nairobi-based property research and insights firm...
// they do not appear to function as a property management company
// that handles day-to-day operations like tenant placement or rent
// collection." Part of the reason was the catalogue: ten bank
// mortgage reviews, a REIT comparison, school league tables and a
// tenant rights guide, indexed alongside the management content and
// outnumbering it.
//
// Those pages are noindexed rather than deleted, which only works if
// the flag, the route metadata and the sitemap stay consistent.
//
// Read from disk rather than imported: the post modules are .tsx and
// pulling the barrel into vitest fails on JSX, the same reason the
// statement email tests read source instead of importing the PDF
// renderer.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { sitemapPaths } from "@/lib/sitemap-routes";

const DIR = join(process.cwd(), "src/app/(marketing)/insights/posts");

type Post = { slug: string; noindex: boolean; country: string };

const posts: Post[] = readdirSync(DIR)
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => {
    const src = readFileSync(join(DIR, f), "utf8");
    return {
      slug: src.match(/slug:\s*"([^"]+)"/)?.[1] ?? f.replace(/\.tsx$/, ""),
      noindex: /\n\s*noindex:\s*true/.test(src),
      country: src.match(/country:\s*"([^"]+)"/)?.[1] ?? "kenya",
    };
  });

const noindexed = posts.filter((p) => p.noindex);

describe("the noindexed set", () => {
  it("read the catalogue at all", () => {
    // Vacuity guard: if the parse breaks, every assertion below would
    // pass against an empty list.
    expect(posts.length).toBeGreaterThan(300);
  });

  it("is not empty and is not most of the catalogue", () => {
    // A floor, so removing the flag everywhere fails loudly. A ceiling,
    // because noindexing at scale is a different decision from pruning
    // a handful and should not arrive by drift.
    expect(noindexed.length).toBeGreaterThan(0);
    expect(noindexed.length).toBeLessThan(posts.length * 0.2);
  });

  it("covers the bank mortgage reviews, which are the clearest case", () => {
    // A reader comparing Absa against KCB is shopping for a mortgage.
    // There is no version of that person who also needs a managing
    // agent this month, and there were ten of these.
    const slugs = new Set(noindexed.map((p) => p.slug));
    const reviews = posts.filter(
      (p) => p.slug.includes("mortgage") && p.slug.includes("review"),
    );
    expect(reviews.length).toBeGreaterThan(5);
    for (const r of reviews) {
      expect(
        slugs.has(r.slug),
        `${r.slug} is a bank mortgage review and should be noindexed`,
      ).toBe(true);
    }
  });

  it("leaves the content that does reach a landlord indexed", () => {
    // The inverse guard. If a future edit noindexes by pattern rather
    // than by judgement, this catches it.
    const wrongly = noindexed.filter((p) =>
      /airbnb|landlord|rent-collection|tenant-finding|eviction|service-charge|short-let/.test(
        p.slug,
      ),
    );
    expect(
      wrongly.map((p) => p.slug),
      "These articles can reach a landlord. They belong in the index.",
    ).toEqual([]);
  });
});

describe("the flag, the route and the sitemap agree", () => {
  it("keeps every noindexed slug out of the sitemap", () => {
    const paths = sitemapPaths({
      host: "goldstay.co.ke",
      postSlugs: {
        kenya: posts
          .filter((p) => p.country === "kenya" && !p.noindex)
          .map((p) => p.slug),
        ghana: [],
      },
      categorySlugs: { kenya: [], ghana: [] },
    });
    const advertised = noindexed
      .map((p) => `/insights/${p.slug}`)
      .filter((u) => paths.includes(u));

    expect(
      advertised,
      `A sitemap entry asks Google to index a URL. These carry a ` +
        `noindex and are advertised anyway. Filter on meta.noindex ` +
        `where postSlugs is built, in src/app/sitemap.ts.`,
    ).toEqual([]);
  });

  it("builds the sitemap's post list from the flag", () => {
    const sitemap = readFileSync(
      join(process.cwd(), "src/app/sitemap.ts"),
      "utf8",
    );
    expect(sitemap).toContain("meta.noindex");
  });

  it("emits the robots directive from the post route", () => {
    // The flag is inert unless generateMetadata reads it.
    const route = readFileSync(
      join(process.cwd(), "src/app/(marketing)/insights/[slug]/page.tsx"),
      "utf8",
    );
    expect(route).toContain("meta.noindex");
    expect(route).toContain("index: false");
    // follow stays on: the page leaves the index, but its internal
    // links should still carry through to the service pages.
    expect(route).toContain("follow: true");
  });

  it("declares the field on the type", () => {
    const shared = readFileSync(join(DIR, "_shared.ts"), "utf8");
    expect(shared).toContain("noindex?: true");
  });
});
