import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/ArticleLayout";
import { getPostBySlug, posts, relatedPosts } from "../posts";
import { alternateLanguagesFor } from "@/lib/site";

// Pre-render every post at build time. dynamicParams is false so any
// other slug 404s instead of triggering on-demand rendering for an
// article that doesn't exist.
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.meta.slug }));
}

export const dynamicParams = false;

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  const path = `/insights/${post.meta.slug}`;
  return {
    title: post.meta.title,
    description: post.meta.description,
    alternates: {
      canonical: path,
      languages: alternateLanguagesFor(path),
    },
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
  const Body = post.Component;
  const related = relatedPosts(post.meta.slug);
  return (
    <ArticleLayout meta={post.meta} related={related}>
      <Body />
    </ArticleLayout>
  );
}
