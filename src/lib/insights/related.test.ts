// Read from disk rather than imported: the post modules are .tsx and
// pulling the barrel into vitest fails on JSX, the same reason
// noindex.test.ts and the statement email tests read source instead
// of importing the module.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildRelatedGraph,
  inboundCounts,
  RELATED_DEFAULTS,
  relatedScore,
  type RelatedInput,
} from "./related";

const DIR = join(process.cwd(), "src/app/(marketing)/insights/posts");

const catalogue: RelatedInput[] = readdirSync(DIR)
  .filter((f) => f.endsWith(".tsx") && !f.startsWith("_"))
  .map((f) => {
    const src = readFileSync(join(DIR, f), "utf8");
    const tagBlock = src.match(/tags:\s*\[([\s\S]*?)\]/)?.[1] ?? "";
    return {
      slug: src.match(/slug:\s*"([^"]+)"/)?.[1] ?? f.replace(/\.tsx$/, ""),
      country: src.match(/country:\s*"([^"]+)"/)?.[1] ?? "kenya",
      publishedAt: src.match(/publishedAt:\s*"([^"]+)"/)?.[1] ?? "2026-01-01",
      tags: [...tagBlock.matchAll(/"([^"]+)"/g)].map((m) => m[1]),
      noindex: /\n\s*noindex:\s*true/.test(src),
    };
  });

function makePosts(n: number, tagsFor: (i: number) => string[]): RelatedInput[] {
  return Array.from({ length: n }, (_, i) => ({
    slug: `post-${String(i).padStart(3, "0")}`,
    country: "kenya",
    publishedAt: `2026-01-${String((i % 28) + 1).padStart(2, "0")}`,
    tags: tagsFor(i),
  }));
}

describe("relatedScore", () => {
  const base: RelatedInput = {
    slug: "a",
    country: "kenya",
    publishedAt: "2026-01-01",
    tags: ["Airbnb", "Nairobi"],
  };

  it("ranks more shared tags above fewer", () => {
    const two = { ...base, slug: "b", tags: ["Airbnb", "Nairobi"] };
    const one = { ...base, slug: "c", tags: ["Airbnb", "Karen"] };
    expect(relatedScore(base, two)).toBeGreaterThan(relatedScore(base, one));
  });

  it("uses recency only to separate equally tagged candidates", () => {
    const older = { ...base, slug: "b", publishedAt: "2020-01-01" };
    const newer = { ...base, slug: "c", publishedAt: "2026-06-01" };
    expect(relatedScore(base, newer)).toBeGreaterThan(relatedScore(base, older));

    // One extra shared tag must outweigh any recency gap, or the row
    // fills up with whatever was published most recently.
    const newerButLessRelated = {
      ...base,
      slug: "d",
      publishedAt: "2026-12-31",
      tags: ["Airbnb"],
    };
    expect(relatedScore(base, older)).toBeGreaterThan(
      relatedScore(base, newerButLessRelated),
    );
  });

  it("does not blow up on an unparseable date", () => {
    const bad = { ...base, slug: "b", publishedAt: "not-a-date" };
    expect(Number.isNaN(relatedScore(base, bad))).toBe(false);
  });
});

describe("buildRelatedGraph", () => {
  it("gives every article the guaranteed floor of inbound links", () => {
    const graph = buildRelatedGraph(makePosts(40, (i) => [`tag-${i % 4}`]));
    const counts = inboundCounts(graph);
    for (const [slug, count] of counts) {
      expect(count, `${slug} inbound`).toBeGreaterThanOrEqual(
        RELATED_DEFAULTS.minInbound,
      );
    }
  });

  it("holds the floor even when every article shares one tag, which is the case the old version failed", () => {
    // Identical tags means relevance cannot distinguish anything, so a
    // pure top-N-by-score implementation points all 60 articles at the
    // same handful. Coverage has to come from somewhere else.
    const graph = buildRelatedGraph(makePosts(60, () => ["Nairobi"]));
    const counts = inboundCounts(graph);
    const orphans = [...counts].filter(([, c]) => c === 0);
    expect(orphans).toEqual([]);
    expect(Math.min(...counts.values())).toBeGreaterThanOrEqual(
      RELATED_DEFAULTS.minInbound,
    );
  });

  it("respects the inbound ceiling so nothing hoards links", () => {
    const graph = buildRelatedGraph(makePosts(50, (i) => [`tag-${i % 3}`]));
    for (const [slug, count] of inboundCounts(graph)) {
      expect(count, `${slug} inbound`).toBeLessThanOrEqual(
        RELATED_DEFAULTS.maxInbound,
      );
    }
  });

  it("never links an article to itself and never repeats a target", () => {
    const graph = buildRelatedGraph(makePosts(30, (i) => [`tag-${i % 5}`]));
    for (const [slug, targets] of graph) {
      expect(targets).not.toContain(slug);
      expect(new Set(targets).size).toBe(targets.length);
    }
  });

  it("keeps countries in separate graphs", () => {
    const mixed: RelatedInput[] = [
      ...makePosts(12, () => ["Nairobi"]),
      ...Array.from({ length: 6 }, (_, i) => ({
        slug: `gh-${i}`,
        country: "ghana",
        publishedAt: "2026-02-01",
        tags: ["Accra"],
      })),
    ];
    const graph = buildRelatedGraph(mixed);
    for (const [slug, targets] of graph) {
      const isGhana = slug.startsWith("gh-");
      for (const t of targets) {
        expect(t.startsWith("gh-")).toBe(isGhana);
      }
    }
  });

  it("does not point links at a noindexed article", () => {
    const withHidden: RelatedInput[] = makePosts(20, () => ["Nairobi"]).map(
      (p, i) => (i % 5 === 0 ? { ...p, noindex: true } : p),
    );
    const graph = buildRelatedGraph(withHidden);
    const hidden = new Set(
      withHidden.filter((p) => p.noindex).map((p) => p.slug),
    );
    for (const [, targets] of graph) {
      for (const t of targets) expect(hidden.has(t)).toBe(false);
    }
  });

  it("still gives a noindexed article somewhere to send the reader", () => {
    const withHidden: RelatedInput[] = makePosts(20, () => ["Nairobi"]).map(
      (p, i) => (i === 0 ? { ...p, noindex: true } : p),
    );
    const graph = buildRelatedGraph(withHidden);
    expect(graph.get("post-000")!.length).toBeGreaterThan(0);
  });

  it("falls back rather than emptying the row when a whole country is noindexed", () => {
    const allHidden: RelatedInput[] = makePosts(8, () => ["Accra"]).map((p) => ({
      ...p,
      country: "ghana",
      noindex: true,
    }));
    const graph = buildRelatedGraph(allHidden);
    for (const [, targets] of graph) {
      expect(targets.length).toBeGreaterThan(0);
    }
  });

  it("is deterministic", () => {
    const input = makePosts(35, (i) => [`tag-${i % 6}`, `shared`]);
    const a = buildRelatedGraph(input);
    const b = buildRelatedGraph([...input].reverse());
    for (const [slug, targets] of a) {
      expect(b.get(slug)).toEqual(targets);
    }
  });

  it("orders each row most-related first", () => {
    const input = makePosts(30, (i) => (i < 5 ? ["Airbnb", "Nairobi"] : ["Karen"]));
    const graph = buildRelatedGraph(input);
    const bySlug = new Map(input.map((p) => [p.slug, p]));
    const source = bySlug.get("post-000")!;
    const scores = graph
      .get("post-000")!
      .map((s) => relatedScore(source, bySlug.get(s)!));
    expect([...scores].sort((x, y) => y - x)).toEqual(scores);
  });

  it("copes with a pool smaller than one row", () => {
    const graph = buildRelatedGraph(makePosts(2, () => ["Nairobi"]));
    expect(graph.get("post-000")).toEqual(["post-001"]);
    expect(graph.get("post-001")).toEqual(["post-000"]);
  });

  it("handles a single article", () => {
    const graph = buildRelatedGraph(makePosts(1, () => ["Nairobi"]));
    expect(graph.get("post-000")).toEqual([]);
  });
});

// The reason the module exists, asserted against the real catalogue
// rather than a fixture. If this fails, articles have gone dark.
describe("the real catalogue", () => {
  const graph = buildRelatedGraph(catalogue);
  const counts = inboundCounts(graph);

  it("read the catalogue at all", () => {
    // Vacuity guard: a broken parse would make every assertion below
    // pass against an empty set.
    expect(catalogue.length).toBeGreaterThan(300);
    expect(catalogue.every((p) => p.tags.length > 0)).toBe(true);
  });

  it("leaves no indexable article without inbound links", () => {
    const indexable = new Set(
      catalogue.filter((p) => !p.noindex).map((p) => p.slug),
    );
    const orphans = [...counts]
      .filter(([slug, c]) => c === 0 && indexable.has(slug))
      .map(([slug]) => slug);
    expect(orphans).toEqual([]);
  });

  it("holds the inbound floor across the whole catalogue", () => {
    const below = catalogue
      .filter((p) => !p.noindex)
      .map((p) => [p.slug, counts.get(p.slug) ?? 0] as const)
      .filter(([, c]) => c < RELATED_DEFAULTS.minInbound);
    expect(below).toEqual([]);
  });

  it("no longer lets one article absorb the catalogue", () => {
    expect(Math.max(...counts.values())).toBeLessThanOrEqual(
      RELATED_DEFAULTS.maxInbound,
    );
  });

  it("fills the row for every article", () => {
    const short = [...graph]
      .filter(([, targets]) => targets.length !== RELATED_DEFAULTS.perPost)
      .map(([slug, targets]) => [slug, targets.length]);
    expect(short).toEqual([]);
  });
});
