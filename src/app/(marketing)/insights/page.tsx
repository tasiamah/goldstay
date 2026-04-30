import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { CTABanner } from "@/components/CTABanner";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { InsightsSearch } from "@/components/InsightsSearch";
import { postsForCountry, type Post } from "./posts";
import { categories } from "./categories";
import { alternateLanguagesFor, countryForHost, site } from "@/lib/site";

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
    ? `Search: "${q}" — Goldstay Insights`
    : page > 1
      ? `Insights for diaspora landlords (page ${page})`
      : "Insights for diaspora landlords";

  return {
    title,
    description:
      "Plain-English writing on tax, buying remotely and running a property in Nairobi or Accra from abroad. Written by the team that does it day to day.",
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
      description:
        "Plain-English writing on tax, buying remotely and running a property in Nairobi or Accra from abroad.",
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

      <section className="section">
        <div className="container-gs max-w-5xl">
          <div className="mb-8">
            <InsightsSearch initialQuery={q} totalResults={totalResults} />
          </div>

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

          {visible.length === 0 ? (
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
              {visible.map((p, i) => (
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
