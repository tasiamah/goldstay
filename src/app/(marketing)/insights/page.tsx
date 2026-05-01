import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { CTABanner } from "@/components/CTABanner";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { InsightsSearch } from "@/components/InsightsSearch";
import { getPostBySlug, postsForCountry, type Post } from "./posts";
import { categories, postsForCategory } from "./categories";
import { alternateLanguagesFor, countryForHost, site } from "@/lib/site";
import { getServerCity } from "@/lib/getServerCity";

// Cornerstone articles surfaced as the editor's pick rail at the top
// of the index, on the unfiltered first page only. We prefer slugs to
// dates so the rail stays stable when newer posts ship — a "Featured"
// flag in PostMeta would force every post file to declare a value, so
// the explicit allowlist here is cheaper. Order is the visual order on
// the page. Two lists by country so the .com.gh hub gets its own
// curation when we deepen the Ghana catalogue.
const FEATURED_SLUGS_KENYA = [
  "kenya-mri-tax-diaspora-landlords",
  "how-diaspora-landlords-get-paid-usd-from-kenyan-rent",
  "best-neighbourhoods-nairobi-rental-yield-2026",
  "how-to-spot-fake-kenyan-title-deed",
] as const;

const FEATURED_SLUGS_GHANA = [
  "buying-property-accra-diaspora-2026-guide",
  "ghana-8-percent-withholding-tax-landlords",
] as const;

function pickFeatured(country: "kenya" | "ghana"): Post[] {
  const slugs =
    country === "ghana" ? FEATURED_SLUGS_GHANA : FEATURED_SLUGS_KENYA;
  return slugs
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is Post => Boolean(p));
}

const PAGE_SIZE = 10;

type SearchParams = {
  q?: string;
  page?: string;
};

// Pull q and page out of the URL with light validation so the rest of
// the page can treat them as trusted values.
function readSearchParams(searchParams: SearchParams) {
  const q = (searchParams.q ?? "").toString().trim().slice(0, 80);
  const pageRaw = parseInt(searchParams.page ?? "1", 10);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  return { q, page };
}

// Lowercase haystack of every searchable text field on a post. Built
// once per request and reused across the filter loop.
function searchHaystack(post: Post) {
  return [
    post.meta.title,
    post.meta.description,
    post.meta.author.name,
    ...post.meta.tags,
  ]
    .join(" ")
    .toLowerCase();
}

function applySearch(posts: Post[], q: string) {
  if (!q) return posts;
  const needle = q.toLowerCase();
  return posts.filter((p) => searchHaystack(p).includes(needle));
}

function sortByDateDesc(posts: Post[]) {
  return [...posts].sort(
    (a, b) =>
      new Date(b.meta.publishedAt).getTime() -
      new Date(a.meta.publishedAt).getTime(),
  );
}

export function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Metadata {
  const { q, page } = readSearchParams(searchParams);

  // Build a self-referencing canonical that preserves the page number
  // for paginated views (so each page can be indexed separately) but
  // strips the search query because search-result pages are noindex
  // anyway.
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  const canonical = qs ? `/insights?${qs}` : "/insights";

  const title = q
    ? `Search: "${q}" | Goldstay Insights`
    : page > 1
      ? `Insights for diaspora landlords (page ${page})`
      : "Insights for diaspora landlords";

  // Single-market on the localised domains, dual-market on the neutral
  // .com surface. Same pattern as the root layout's metadata.
  const city = getServerCity();
  const market =
    city === "nairobi"
      ? "Nairobi"
      : city === "accra"
        ? "Accra"
        : "Nairobi or Accra";
  const description = `Plain-English writing on tax, buying remotely and running a property in ${market} from abroad. Written by the team that does it day to day.`;

  return {
    title,
    description,
    alternates: {
      canonical,
      // Search-result URLs aren't worth surfacing in hreflang. For the
      // base index and paginated views we still advertise the cross-
      // domain equivalents so each market sees its own catalogue.
      languages: q ? undefined : alternateLanguagesFor("/insights"),
    },
    // Search results are thin and infinite. Tell Google to skip them.
    robots: q ? { index: false, follow: true } : undefined,
    openGraph: {
      title: q ? title : "Goldstay Insights",
      description,
      type: "website",
    },
  };
}

export default function InsightsIndex({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const host = headers().get("host") ?? site.domain;
  const country = countryForHost(host);
  const cityName = country === "ghana" ? "Accra" : "Nairobi";

  const { q, page } = readSearchParams(searchParams);

  const all = sortByDateDesc(postsForCountry(country));
  const filtered = applySearch(all, q);
  const totalResults = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  // Index-page chrome (featured rail + category overview) is only
  // shown on the unfiltered first page. Search results and deeper
  // pages need the screen for results, not editorial scaffolding.
  const showIndexChrome = !q && safePage === 1;
  const featured = showIndexChrome ? pickFeatured(country) : [];
  const featuredSlugs = new Set(featured.map((p) => p.meta.slug));
  // When the rail is shown we don't want the same posts duplicated in
  // the row immediately below. The full list still includes them on
  // page 2+.
  const visibleNonFeatured = showIndexChrome
    ? visible.filter((p) => !featuredSlugs.has(p.meta.slug))
    : visible;
  const categoryStats = showIndexChrome
    ? categories.map((c) => ({
        category: c,
        count: postsForCategory(c.slug, country).length,
      }))
    : [];

  // Build query strings for the prev/next links so the user's search
  // term is preserved when paginating through results.
  function pageHref(p: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/insights?${qs}` : "/insights";
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `https://${site.domain}` },
          { name: "Insights", url: `https://${site.domain}/insights` },
        ]}
      />

      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
        <div className="absolute inset-0 -z-10 grain opacity-40" />
        <div className="container-gs pb-16 md:pb-24">
          <Reveal>
            <div className="max-w-3xl">
              <div className="eyebrow text-gold-400">Insights</div>
              <h1 className="mt-6 font-serif text-display-lg balance">
                Writing for the <em className="italic">diaspora landlord</em>.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-cream/80 pretty md:text-xl">
                Plain-English notes on tax, buying remotely, the
                operational reality of running an apartment in {cityName}{" "}
                from abroad, and the questions our clients actually ask.
                Written by the team that does it day to day, not a
                marketing department.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {showIndexChrome && featured.length > 0 ? (
        <FeaturedRail
          posts={featured}
          totalPosts={all.length}
        />
      ) : null}

      {showIndexChrome ? (
        <CategoryGrid stats={categoryStats} totalPosts={all.length} />
      ) : null}

      <section className="section">
        <div className="container-gs max-w-5xl">
          <div className="mb-8">
            <InsightsSearch initialQuery={q} totalResults={totalResults} />
          </div>

          {!showIndexChrome ? (
            <nav
              aria-label="Insight categories"
              className="mb-10 flex flex-wrap gap-2"
            >
              <span
                aria-current="page"
                className="inline-flex items-center rounded-full bg-charcoal px-4 py-2 text-sm font-medium text-cream"
              >
                All
              </span>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/insights/category/${c.slug}`}
                  className="inline-flex items-center rounded-full border border-charcoal/15 px-4 py-2 text-sm text-charcoal/70 transition hover:border-gold-500/50 hover:text-gold-700"
                >
                  {c.shortName}
                </Link>
              ))}
            </nav>
          ) : (
            <div className="mb-8 flex items-baseline justify-between">
              <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">
                Latest from the desk
              </h2>
              <span className="font-mono text-[0.65rem] uppercase tracking-widest-xl text-charcoal/50">
                {totalResults} articles · sorted newest first
              </span>
            </div>
          )}

          {visibleNonFeatured.length === 0 ? (
            <div className="rounded-3xl border border-charcoal/10 bg-cream p-10 text-center">
              <h2 className="font-serif text-2xl text-charcoal">
                Nothing matches that search.
              </h2>
              <p className="mt-3 text-charcoal/70">
                Try a different keyword, a tag, or browse the full
                library.
              </p>
              <Link
                href="/insights"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-cream transition hover:bg-charcoal/90"
              >
                Clear search
              </Link>
            </div>
          ) : (
            <ul className="space-y-5">
              {visibleNonFeatured.map((p, i) => (
                <li key={p.meta.slug}>
                  <Reveal delay={i * 0.04}>
                    <Link
                      href={`/insights/${p.meta.slug}`}
                      className="group flex flex-col gap-6 rounded-3xl border border-charcoal/10 bg-cream p-7 transition-all duration-500 hover:border-gold-500/40 hover:shadow-lift sm:p-9 md:flex-row md:items-start"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.65rem] uppercase tracking-widest-xl text-charcoal/55">
                          {p.meta.tags.slice(0, 3).map((t) => (
                            <span key={t} className="text-gold-700">
                              {t}
                            </span>
                          ))}
                          <span className="text-charcoal/30">·</span>
                          <span>{p.meta.readingMinutes} min</span>
                        </div>
                        <h2 className="mt-4 font-serif text-2xl leading-tight text-charcoal balance md:text-3xl">
                          {p.meta.title}
                        </h2>
                        <p className="mt-4 max-w-2xl text-charcoal/75">
                          {p.meta.description}
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-charcoal/60">
                          <span className="font-serif italic text-charcoal">
                            {p.meta.author.name}
                          </span>
                          <span className="text-charcoal/30">·</span>
                          <span>{p.meta.author.role}</span>
                          <span className="text-charcoal/30">·</span>
                          <span>
                            {new Date(p.meta.publishedAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                      <span className="self-end inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-charcoal/15 text-charcoal/60 transition-transform group-hover:translate-x-1 md:self-start">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}

          {totalPages > 1 ? (
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              hrefForPage={pageHref}
            />
          ) : null}
        </div>
      </section>

      <CTABanner />
    </>
  );
}

// Editor's pick rail. Promotes our cornerstone articles up where a
// new visitor lands, instead of letting them die on page 12 of a flat
// chronological list. Cards are visually richer than the standard
// list-row treatment below so the eye reads them as "the place to
// start" rather than as more of the same.
function FeaturedRail({
  posts,
  totalPosts,
}: {
  posts: Post[];
  totalPosts: number;
}) {
  return (
    <section className="border-y border-charcoal/10 bg-cream py-16 md:py-20">
      <div className="container-gs">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow text-gold-700">Editor&apos;s pick</div>
            <h2 className="mt-3 max-w-2xl font-serif text-3xl text-charcoal md:text-4xl">
              Start here.
            </h2>
            <p className="mt-3 max-w-xl text-charcoal/65">
              Four pieces we hand to every new diaspora landlord before
              they sign anything. Read these and you&apos;ll know more than
              most agents on the ground.
            </p>
          </div>
          <span className="font-mono text-[0.7rem] uppercase tracking-widest-xl text-charcoal/55">
            Curated from {totalPosts} articles
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {posts.map((p, i) => (
            <Reveal key={p.meta.slug} delay={i * 0.05}>
              <Link
                href={`/insights/${p.meta.slug}`}
                className="group flex h-full flex-col justify-between rounded-3xl border border-charcoal/10 bg-white p-7 transition-all duration-500 hover:border-gold-500/40 hover:shadow-lift sm:p-8"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.65rem] uppercase tracking-widest-xl text-gold-700">
                    {p.meta.tags.slice(0, 2).map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                    <span className="text-charcoal/30">·</span>
                    <span className="text-charcoal/55">
                      {p.meta.readingMinutes} min
                    </span>
                  </div>
                  <h3 className="mt-4 font-serif text-2xl leading-tight text-charcoal balance md:text-[1.7rem]">
                    {p.meta.title}
                  </h3>
                  <p className="mt-4 text-charcoal/70">{p.meta.description}</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-charcoal/5 pt-5 text-sm text-charcoal/65">
                  <span>
                    <span className="font-serif italic text-charcoal">
                      {p.meta.author.name}
                    </span>
                    <span className="text-charcoal/30"> · </span>
                    <span>{p.meta.author.role}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-gold-700 transition group-hover:translate-x-0.5">
                    Read
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// Topic-overview grid. The thin pill row read as "we have eight tags"
// because it didn't carry depth. Showing the count next to each topic
// converts the same list into "we have meaningful coverage in every
// area" — same data, very different perception.
function CategoryGrid({
  stats,
  totalPosts,
}: {
  stats: { category: (typeof categories)[number]; count: number }[];
  totalPosts: number;
}) {
  return (
    <section className="section bg-white">
      <div className="container-gs">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow text-charcoal/55">Browse by topic</div>
            <h2 className="mt-3 font-serif text-3xl text-charcoal md:text-4xl">
              {totalPosts} articles, eight desks.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-charcoal/60">
            Each desk pulls from the operational, legal and market work
            we do day to day for landlords and buyers.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ category, count }) => (
            <Link
              key={category.slug}
              href={`/insights/category/${category.slug}`}
              className="group flex h-full flex-col justify-between rounded-2xl border border-charcoal/10 bg-cream p-6 transition-all duration-300 hover:border-gold-500/40 hover:shadow-soft"
            >
              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-serif text-xl text-charcoal">
                    {category.name}
                  </h3>
                  <span className="font-mono text-[0.7rem] text-charcoal/50">
                    {count}
                  </span>
                </div>
                <p className="mt-3 text-sm text-charcoal/65">
                  {category.description.split(".")[0]}.
                </p>
              </div>
              <span className="mt-5 inline-flex items-center gap-1 font-mono text-[0.65rem] uppercase tracking-widest-xl text-gold-700 transition-transform group-hover:translate-x-0.5">
                Explore
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Pagination control. Rendered with real <Link> elements so each page
// is a separate, crawlable URL. We show a windowed page list around
// the current page so the bar stays compact even with a long catalogue.
function Pagination({
  currentPage,
  totalPages,
  hrefForPage,
}: {
  currentPage: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
}) {
  const pages = pageWindow(currentPage, totalPages);
  const prev = currentPage > 1 ? hrefForPage(currentPage - 1) : null;
  const next = currentPage < totalPages ? hrefForPage(currentPage + 1) : null;

  return (
    <nav
      aria-label="Insights pagination"
      className="mt-12 flex flex-wrap items-center justify-center gap-2 border-t border-charcoal/10 pt-10"
    >
      {prev ? (
        <Link
          href={prev}
          rel="prev"
          className="inline-flex items-center gap-2 rounded-full border border-charcoal/15 px-4 py-2 text-sm text-charcoal transition hover:border-gold-500/50 hover:text-gold-700"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Link>
      ) : (
        <span className="inline-flex items-center gap-2 rounded-full border border-charcoal/10 px-4 py-2 text-sm text-charcoal/35">
          <ChevronLeft className="h-4 w-4" />
          Previous
        </span>
      )}

      <ul className="mx-2 flex items-center gap-1">
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <li
              key={`e${i}`}
              aria-hidden
              className="px-2 text-charcoal/40"
            >
              ...
            </li>
          ) : (
            <li key={p}>
              <Link
                href={hrefForPage(p)}
                aria-current={p === currentPage ? "page" : undefined}
                className={
                  p === currentPage
                    ? "inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-charcoal px-3 text-sm font-medium text-cream"
                    : "inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm text-charcoal/70 transition hover:bg-charcoal/5 hover:text-charcoal"
                }
              >
                {p}
              </Link>
            </li>
          ),
        )}
      </ul>

      {next ? (
        <Link
          href={next}
          rel="next"
          className="inline-flex items-center gap-2 rounded-full border border-charcoal/15 px-4 py-2 text-sm text-charcoal transition hover:border-gold-500/50 hover:text-gold-700"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-2 rounded-full border border-charcoal/10 px-4 py-2 text-sm text-charcoal/35">
          Next
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}

// Build a compact pagination window: always show first and last, plus
// the current page and one neighbour each side. Anything skipped is
// represented by a single "ellipsis" marker.
function pageWindow(
  current: number,
  total: number,
): Array<number | "ellipsis"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const result: Array<number | "ellipsis"> = [];
  const window = new Set<number>([
    1,
    total,
    current,
    current - 1,
    current + 1,
  ]);

  let last = 0;
  for (let i = 1; i <= total; i++) {
    if (!window.has(i)) continue;
    if (last && i - last > 1) result.push("ellipsis");
    result.push(i);
    last = i;
  }
  return result;
}
