// Which articles the "Keep reading" row points at, decided globally
// rather than per article.
//
// The obvious implementation, and the one this replaces, scores every
// other article by shared tags and takes the top few. It reads
// sensibly and distributes links terribly. Sorting by tag overlap and
// breaking ties on recency means the same heavily-tagged articles win
// every comparison, so on the catalogue as it stands the old version
// left 116 articles with no inbound link at all while one Karen guide
// absorbed 32. Raising the limit makes the concentration worse, not
// better: at six per article, 41 still had none and Karen's climbed
// to 60.
//
// That matters because the related row is, for most of the catalogue,
// the only thing linking to an article at all. An article nothing
// links to is one Google has little reason to crawl again and no
// reason to rank, however good it is.
//
// So coverage is a constraint here, not an outcome. Phase one hands
// every eligible article a floor of inbound links, choosing the most
// relevant sources that still have a free slot. Phase two spends
// what capacity is left on pure relevance, subject to a ceiling so
// nothing hoards. Relevance still decides *which* article fills a
// slot and the order they render in; it just no longer decides
// whether some articles get linked at all.
//
// Pure and deterministic. No database, no clock, no randomness: the
// same input always produces the same graph, which is what makes it
// testable and safe to compute once at module load for a statically
// rendered site.

export type RelatedInput = {
  slug: string;
  country: string;
  publishedAt: string;
  tags: readonly string[];
  // Excluded as a link *target*: pointing internal links at a page we
  // have asked Google not to index spends crawl budget and equity on
  // a page that cannot rank. Noindexed articles still show a related
  // row of their own, because linking out of them is free and useful
  // to whoever is reading.
  noindex?: boolean;
};

export type RelatedOptions = {
  // Slots per article. Six fills three rows of the existing two-column
  // grid without turning the foot of every article into a link farm.
  perPost?: number;
  // The floor phase one guarantees. Three is the point at which a page
  // stops looking incidental to a crawler.
  minInbound?: number;
  // The ceiling phase two respects. Without it relevance alone
  // rebuilds the concentration this module exists to prevent.
  maxInbound?: number;
};

export const RELATED_DEFAULTS = {
  perPost: 6,
  minInbound: 3,
  maxInbound: 12,
} as const;

// Higher is more related. Shared tags dominate; recency is only a
// nudge so that among equally-tagged candidates the fresher one wins.
// The slug comparison at the end is not a preference, it is what
// makes the whole assignment deterministic when scores tie.
export function relatedScore(a: RelatedInput, b: RelatedInput): number {
  const aTags = new Set(a.tags);
  let shared = 0;
  for (const t of b.tags) if (aTags.has(t)) shared++;
  const ts = Date.parse(b.publishedAt);
  const recency = Number.isNaN(ts) ? 0 : ts / 1e13;
  return shared * 10 + recency;
}

export type RelatedGraph = ReadonlyMap<string, readonly string[]>;

export function buildRelatedGraph(
  posts: readonly RelatedInput[],
  options: RelatedOptions = {},
): RelatedGraph {
  const perPost = options.perPost ?? RELATED_DEFAULTS.perPost;
  const minInbound = options.minInbound ?? RELATED_DEFAULTS.minInbound;
  const maxInbound = options.maxInbound ?? RELATED_DEFAULTS.maxInbound;

  const out = new Map<string, string[]>();
  const inbound = new Map<string, number>();
  for (const p of posts) {
    out.set(p.slug, []);
    inbound.set(p.slug, 0);
  }

  // Countries are separate graphs. A Nairobi reader should never be
  // handed an Accra follow-up, and vice versa.
  const byCountry = new Map<string, RelatedInput[]>();
  for (const p of posts) {
    const list = byCountry.get(p.country);
    if (list) list.push(p);
    else byCountry.set(p.country, [p]);
  }

  for (const [, group] of [...byCountry.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    // Deterministic order throughout, so the graph does not depend on
    // the order articles happen to be registered in.
    const sources = [...group].sort((a, b) => a.slug.localeCompare(b.slug));
    const indexable = sources.filter((p) => !p.noindex);
    // A country whose entire catalogue is noindexed (Ghana, while
    // Accra is unlaunched) would otherwise get an empty row. Falling
    // back to the full group buys no SEO, but the reader still gets
    // somewhere to go.
    const targets = indexable.length > 0 ? indexable : sources;

    const rank = new Map<string, RelatedInput[]>();
    for (const s of sources) {
      rank.set(
        s.slug,
        targets
          .filter((t) => t.slug !== s.slug)
          .sort(
            (x, y) =>
              relatedScore(s, y) - relatedScore(s, x) ||
              x.slug.localeCompare(y.slug),
          ),
      );
    }

    const has = (sourceSlug: string, targetSlug: string): boolean =>
      out.get(sourceSlug)!.includes(targetSlug);
    const free = (sourceSlug: string): boolean =>
      out.get(sourceSlug)!.length < perPost;

    // Phase one: the floor. Targets are served least-covered first so
    // that scarce capacity goes where it is most needed, and ties
    // break on slug to stay deterministic.
    for (let round = 0; round < minInbound; round++) {
      const queue = [...targets].sort(
        (a, b) =>
          inbound.get(a.slug)! - inbound.get(b.slug)! ||
          a.slug.localeCompare(b.slug),
      );
      for (const target of queue) {
        if (inbound.get(target.slug)! > round) continue;
        const source = sources
          .filter(
            (s) =>
              s.slug !== target.slug && free(s.slug) && !has(s.slug, target.slug),
          )
          .sort(
            (x, y) =>
              relatedScore(y, target) - relatedScore(x, target) ||
              x.slug.localeCompare(y.slug),
          )[0];
        if (!source) continue;
        out.get(source.slug)!.push(target.slug);
        inbound.set(target.slug, inbound.get(target.slug)! + 1);
      }
    }

    // Phase two: spend what is left on relevance alone.
    for (const s of sources) {
      for (const candidate of rank.get(s.slug)!) {
        if (!free(s.slug)) break;
        if (has(s.slug, candidate.slug)) continue;
        if (inbound.get(candidate.slug)! >= maxInbound) continue;
        out.get(s.slug)!.push(candidate.slug);
        inbound.set(candidate.slug, inbound.get(candidate.slug)! + 1);
      }
    }

    // Render most-related first. Assignment order was driven by
    // coverage, which is not the order a reader should see.
    for (const s of sources) {
      const bySlug = new Map(group.map((p) => [p.slug, p]));
      out.get(s.slug)!.sort(
        (x, y) =>
          relatedScore(s, bySlug.get(y)!) - relatedScore(s, bySlug.get(x)!) ||
          x.localeCompare(y),
      );
    }
  }

  return out;
}

// Inbound counts for a built graph. Exported because the test suite
// asserts on the distribution, which is the entire point of the
// module, and because it is the cheapest way for a checker script to
// notice if the catalogue ever drifts back into orphans.
export function inboundCounts(graph: RelatedGraph): Map<string, number> {
  const counts = new Map<string, number>();
  for (const slug of graph.keys()) counts.set(slug, 0);
  for (const [, targets] of graph) {
    for (const t of targets) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return counts;
}
