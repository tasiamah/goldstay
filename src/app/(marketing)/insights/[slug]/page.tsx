import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, permanentRedirect } from "next/navigation";
import { ArticleLayout } from "@/components/ArticleLayout";
import { getPostBySlug, posts, relatedPosts } from "../posts";
import {
  canonicalHostForCountry,
  countryForHost,
  insightAlternates,
  isLaunchedMarket,
  site,
  soleLiveDomain,
} from "@/lib/site";

// Pre-render every post at build time so each canonical URL is
// available immediately.
//
// While one domain is live these serve straight from the prerender.
// Once a second country domain goes live the page reads the request
// host to gate cross-domain access, and Next renders it per host
// (Kenya posts on .com / .co.ke, Ghana posts on .com.gh) with anything
// outside its country redirecting 308 to the canonical host.
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.meta.slug }));
}

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  // Every post sets a heroImage and renders it on the page, but none of
  // them reached the share card: with no openGraph.images, all 350
  // articles unfurled as the same generic site image on WhatsApp,
  // LinkedIn and X. The hero is already the right picture for the
  // story, so use it, and give Twitter the large-image card that goes
  // with it.
  const ogImage = post.meta.heroImage
    ? [
        {
          url: post.meta.heroImage,
          alt: post.meta.heroAlt ?? post.meta.title,
        },
      ]
    : undefined;

  // Search-result copy, falling back to the editorial headline and
  // standfirst where they already fit. See PostMeta for why the two
  // are separate.
  const metaTitle = post.meta.metaTitle ?? post.meta.title;
  const metaDescription = post.meta.metaDescription ?? post.meta.description;

  return {
    // `absolute` suppresses the layout's "%s | Goldstay" template.
    //
    // Google gives a title around 600px and the suffix costs about 115
    // of them, which was pushing 129 articles that otherwise fit over
    // the line — more than half of every truncation in the catalogue,
    // spent on a word the searcher can already see in the domain and
    // that Google now renders separately from the site name in the
    // WebSite schema. The service and city pages keep the suffix,
    // where titles are short and the brand is worth the room.
    title: { absolute: metaTitle },
    description: metaDescription,
    // See PostMeta.noindex. `follow` stays on deliberately: the page
    // is out of the index but its links still pass to the service
    // pages, which is the direction we want equity flowing anyway.
    //
    // Articles for an unlaunched market are treated the same way. A
    // Ghana buyer guide is good work, but until Accra opens it asks
    // Google to read a Nairobi firm as a Ghanaian one, and it cannot
    // convert anybody. Flipping site.launchedMarkets puts all twelve
    // back into the index at once.
    ...(post.meta.noindex || !isLaunchedMarket(post.meta.country)
      ? { robots: { index: false, follow: true } }
      : {}),
    alternates: insightAlternates(post.meta.slug, post.meta.country),
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: "article",
      publishedTime: post.meta.publishedAt,
      modifiedTime: post.meta.updatedAt ?? post.meta.publishedAt,
      authors: [post.meta.author.name],
      tags: [...post.meta.tags],
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: ogImage,
    },
  };
}

export default function Page({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  // Cross-domain enforcement. A Kenya article hit on goldstay.com.gh
  // 308s to the Kenya host and vice versa, so each piece of content
  // ranks under a single domain rather than appearing on two TLDs.
  //
  // Skipped when the target resolves to the host we are already on.
  // canonicalHostForCountry falls back to a live domain, so while
  // .com.gh is dark a Ghana article requested on .co.ke resolves its
  // target to .co.ke — redirecting there would be an infinite loop.
  // Serving it is the better failure: the article is reachable on the
  // one domain we run instead of bouncing to a domain that does not
  // resolve. It stays out of the Kenya sitemap either way.
  //
  // Skipped entirely while one domain is live, and for the same reason
  // the check itself is skipped above: there is nowhere else to send
  // anyone. Reading `headers()` for an answer that cannot vary would
  // make all 350 articles render per request instead of being served
  // from the edge. See soleLiveDomain.
  const sole = soleLiveDomain();
  const host = (
    sole ??
    headers().get("host") ??
    site.domain
  ).toLowerCase();
  const hostCountry = countryForHost(host);
  if (hostCountry !== post.meta.country) {
    const target = canonicalHostForCountry(post.meta.country);
    if (target !== host && `www.${target}` !== host) {
      permanentRedirect(`https://${target}/insights/${post.meta.slug}`);
    }
  }

  const Body = post.Component;
  const related = relatedPosts(post.meta.slug);
  return (
    <ArticleLayout meta={post.meta} related={related}>
      <Body />
    </ArticleLayout>
  );
}
