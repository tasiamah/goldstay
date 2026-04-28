import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { CTABanner } from "./CTABanner";
import { BreadcrumbJsonLd } from "./JsonLd";
import { site } from "@/lib/site";
import type { Post, PostMeta } from "@/app/insights/posts";
import { categoriesForPost } from "@/app/insights/categories";

// Shared shell for every insights post. Renders the hero, byline,
// JSON-LD (Article + Person + Breadcrumb), prose body and a
// "keep reading" related-posts row. Each post file stays focused on
// its actual editorial content.
export function ArticleLayout({
  meta,
  related,
  children,
}: {
  meta: PostMeta;
  related: readonly Post[];
  children: React.ReactNode;
}) {
  const url = `https://${site.domain}/insights/${meta.slug}`;
  const heroImage = meta.heroImage ?? "/images/locations/nairobi.jpg";
  const publishedDateLabel = new Date(meta.publishedAt).toLocaleDateString(
    "en-GB",
    { day: "numeric", month: "long", year: "numeric" },
  );
  const articleCategories = categoriesForPost(meta);

  // Article JSON-LD. Treat the post as schema.org/Article with a
  // named author Person. Combined with the existing Organization /
  // RealEstateAgent block (rendered globally from JsonLd.tsx) this
  // gives Google enough entity signal to attribute the article to
  // Goldstay specifically rather than any generic blog.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.publishedAt,
    dateModified: meta.updatedAt ?? meta.publishedAt,
    inLanguage: "en",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    image: meta.heroImage
      ? [`https://${site.domain}${meta.heroImage}`]
      : undefined,
    keywords: meta.tags.join(", "),
    author: {
      "@type": "Person",
      name: meta.author.name,
      jobTitle: meta.author.role,
      description: meta.author.bio,
      worksFor: {
        "@type": "Organization",
        name: site.name,
        url: `https://${site.domain}`,
      },
      ...(meta.author.image && {
        image: `https://${site.domain}${meta.author.image}`,
      }),
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: `https://${site.domain}`,
    },
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `https://${site.domain}` },
          { name: "Insights", url: `https://${site.domain}/insights` },
          { name: meta.title, url },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article className="bg-cream">
        <header className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
          <Image
            src={heroImage}
            alt={meta.heroAlt ?? meta.title}
            fill
            priority
            sizes="100vw"
            quality={80}
            className="-z-10 object-cover opacity-60"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/65 via-charcoal/75 to-charcoal/95" />
          <div className="container-gs pb-20 md:pb-28">
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest-xl text-gold-400 hover:text-gold-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Insights
            </Link>
            <Reveal>
              <h1 className="mt-6 max-w-4xl font-serif text-display-lg text-cream balance">
                {meta.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-cream/80 pretty md:text-xl">
                {meta.description}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-cream/70">
                <span className="font-serif italic text-cream">
                  {meta.author.name}
                </span>
                <span className="text-cream/40">·</span>
                <span>{meta.author.role}</span>
                <span className="text-cream/40">·</span>
                <span>{publishedDateLabel}</span>
                <span className="text-cream/40">·</span>
                <span>{meta.readingMinutes} min read</span>
              </div>
            </Reveal>
          </div>
        </header>

        <div className="container-gs py-16 md:py-24">
          <div className="mx-auto max-w-2xl">{children}</div>

          {articleCategories.length > 0 ? (
            <div className="mx-auto mt-16 max-w-2xl border-t border-charcoal/10 pt-8">
              <div className="font-mono text-[0.65rem] uppercase tracking-widest-xl text-charcoal/55">
                Filed under
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {articleCategories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/insights/category/${c.slug}`}
                    className="inline-flex items-center rounded-full border border-charcoal/15 px-4 py-2 text-sm text-charcoal/70 transition hover:border-gold-500/50 hover:text-gold-700"
                  >
                    {c.shortName}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mx-auto mt-16 max-w-2xl border-t border-charcoal/10 pt-10">
            <div className="flex items-start gap-5">
              {meta.author.image ? (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-charcoal/10">
                  <Image
                    src={meta.author.image}
                    alt={`${meta.author.name}, ${meta.author.role}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div>
                <div className="font-serif text-xl text-charcoal">
                  {meta.author.name}
                </div>
                <div className="mt-1 font-mono text-[0.65rem] uppercase tracking-widest-xl text-gold-700">
                  {meta.author.role}
                </div>
                <p className="mt-3 text-sm text-charcoal/70">
                  {meta.author.bio}
                </p>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="border-t border-charcoal/10 bg-white/50">
            <div className="container-gs py-16">
              <div className="eyebrow text-charcoal">Keep reading</div>
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {related.map((p) => (
                  <Link
                    key={p.meta.slug}
                    href={`/insights/${p.meta.slug}`}
                    className="group rounded-3xl border border-charcoal/10 bg-cream p-7 transition-colors duration-300 hover:border-gold-500/40"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <h3 className="font-serif text-2xl leading-snug text-charcoal balance">
                          {p.meta.title}
                        </h3>
                        <p className="mt-3 text-sm text-charcoal/70">
                          {p.meta.description}
                        </p>
                        <div className="mt-5 font-mono text-[0.65rem] uppercase tracking-widest-xl text-gold-700">
                          {p.meta.readingMinutes} min · {p.meta.author.name}
                        </div>
                      </div>
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-charcoal/15 text-charcoal/60 transition-transform group-hover:translate-x-1">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <CTABanner />
      </article>
    </>
  );
}
