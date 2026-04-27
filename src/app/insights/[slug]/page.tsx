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

  // Cross-domain enforcement. If a Kenya article is hit on goldstay.com.gh
  // (or a Ghana article on goldstay.com / goldstay.co.ke), 308 the
  // visitor to the canonical host. This keeps each piece of content
  // ranking under a single domain and stops Google from seeing the
  // same article on two TLDs.
  const host = headers().get("host") ?? site.domain;
  const hostCountry = countryForHost(host);
  if (hostCountry !== post.meta.country) {
    const target = canonicalHostForCountry(post.meta.country);
    permanentRedirect(`https://${target}/insights/${post.meta.slug}`);
  }

  const Body = post.Component;
  const related = relatedPosts(post.meta.slug);
  return (
    <ArticleLayout meta={post.meta} related={related}>
      <Body />
    </ArticleLayout>
  );
}
