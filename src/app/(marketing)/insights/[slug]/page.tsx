import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, permanentRedirect } from "next/navigation";
import { ArticleLayout } from "@/components/ArticleLayout";
import { getPostBySlug, posts, relatedPosts } from "../posts";
import {
  canonicalHostForCountry,
  countryForHost,
  insightAlternates,
  site,
} from "@/lib/site";

// Pre-render every post at build time so each canonical URL is
// available immediately. The page itself reads the request host to
// gate cross-domain access, so Next renders it on demand per host
// (Kenya posts on .com / .co.ke, Ghana posts on .com.gh). Anything
// outside its country redirects 308 to the canonical host.
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.meta.slug }));
}

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.meta.title,
    description: post.meta.description,
    alternates: insightAlternates(post.meta.slug, post.meta.country),
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: "article",
      publishedTime: post.meta.publishedAt,
      modifiedTime: post.meta.updatedAt ?? post.meta.publishedAt,
      authors: [post.meta.author.name],
      tags: [...post.meta.tags],
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
  const host = (headers().get("host") ?? site.domain).toLowerCase();
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
