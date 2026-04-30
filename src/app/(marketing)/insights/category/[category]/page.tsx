import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { CTABanner } from "@/components/CTABanner";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import {
  categories,
  getCategoryBySlug,
  postsForCategory,
} from "../../categories";
import {
  alternateLanguagesFor,
  countryForHost,
  site,
} from "@/lib/site";

const PAGE_SIZE = 10;

type SearchParams = { page?: string };

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: SearchParams;
}): Metadata {
  const category = getCategoryBySlug(params.category);
  if (!category) return {};

  const pageRaw = parseInt(searchParams.page ?? "1", 10);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  const qs = page > 1 ? `?page=${page}` : "";
  const canonical = `/insights/category/${category.slug}${qs}`;

  const title =
    page > 1
      ? `${category.name} insights (page ${page}) — Goldstay`
      : `${category.name} insights for diaspora landlords — Goldstay`;

  return {
    title,
    description: category.description,
    alternates: {
      canonical,
      languages: alternateLanguagesFor(
        `/insights/category/${category.slug}`,
      ),
    },
    openGraph: {
      title,
      description: category.description,
      type: "website",
    },
  };
}

export default function CategoryIndex({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: SearchParams;
}) {
  const maybeCategory = getCategoryBySlug(params.category);
  if (!maybeCategory) notFound();
  const category = maybeCategory;

  const host = headers().get("host") ?? site.domain;
  const country = countryForHost(host);
  const cityName = country === "ghana" ? "Accra" : "Nairobi";

  const pageRaw = parseInt(searchParams.page ?? "1", 10);
  const requestedPage =
    Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  const all = [...postsForCategory(category.slug, country)].sort(
    (a, b) =>
      new Date(b.meta.publishedAt).getTime() -
      new Date(a.meta.publishedAt).getTime(),
  );

  const totalResults = all.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));
  const safePage = Math.min(requestedPage, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = all.slice(start, start + PAGE_SIZE);

  function pageHref(p: number) {
    return p > 1
      ? `/insights/category/${category.slug}?page=${p}`
      : `/insights/category/${category.slug}`;
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `https://${site.domain}` },
          { name: "Insights", url: `https://${site.domain}/insights` },
          {
            name: category.name,
            url: `https://${site.domain}/insights/category/${category.slug}`,
          },
        ]}
      />

      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
        <div className="absolute inset-0 -z-10 grain opacity-40" />
        <div className="container-gs pb-16 md:pb-24">
          <Reveal>
            <div className="max-w-3xl">
              <div className="eyebrow text-gold-400">
                <Link
                  href="/insights"
                  className="hover:text-gold-300"
                >
                  Insights
                </Link>{" "}
                <span className="text-cream/40">/</span>{" "}
                <span>{category.name}</span>
              </div>
              <h1 className="mt-6 font-serif text-display-lg balance">
                <em className="italic">{category.name}</em> insights for{" "}
                {cityName}.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-cream/80 pretty md:text-xl">
                {category.intro}
              </p>
              <p className="mt-4 text-sm text-cream/55">
                {totalResults} article{totalResults === 1 ? "" : "s"} in this
                category.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-gs max-w-5xl">
          <CategoryStrip current={category.slug} />

          {visible.length === 0 ? (
            <div className="rounded-3xl border border-charcoal/10 bg-cream p-10 text-center">
              <h2 className="font-serif text-2xl text-charcoal">
                Nothing here yet.
              </h2>
              <p className="mt-3 text-charcoal/70">
                We will be adding articles to this category soon.
              </p>
              <Link
                href="/insights"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-cream transition hover:bg-charcoal/90"
              >
                Browse all insights
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

// Render every category as a chip row so users can jump between
// categories without going back to /insights. The current category is
// rendered as a non-link to make the active state obvious.
function CategoryStrip({ current }: { current: string }) {
  return (
    <nav
      aria-label="Insight categories"
      className="mb-10 flex flex-wrap gap-2"
    >
      <Link
        href="/insights"
        className="inline-flex items-center rounded-full border border-charcoal/15 px-4 py-2 text-sm text-charcoal/70 transition hover:border-gold-500/50 hover:text-gold-700"
      >
        All
      </Link>
      {categories.map((c) =>
        c.slug === current ? (
          <span
            key={c.slug}
            aria-current="page"
            className="inline-flex items-center rounded-full bg-charcoal px-4 py-2 text-sm font-medium text-cream"
          >
            {c.shortName}
          </span>
        ) : (
          <Link
            key={c.slug}
            href={`/insights/category/${c.slug}`}
            className="inline-flex items-center rounded-full border border-charcoal/15 px-4 py-2 text-sm text-charcoal/70 transition hover:border-gold-500/50 hover:text-gold-700"
          >
            {c.shortName}
          </Link>
        ),
      )}
    </nav>
  );
}

function Pagination({
  currentPage,
  totalPages,
  hrefForPage,
}: {
  currentPage: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
}) {
  const prev = currentPage > 1 ? hrefForPage(currentPage - 1) : null;
  const next =
    currentPage < totalPages ? hrefForPage(currentPage + 1) : null;

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

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
        {pages.map((p) => (
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
        ))}
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
