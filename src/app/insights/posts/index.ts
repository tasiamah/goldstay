import type { ComponentType } from "react";
import KenyaMriTax, {
  meta as kenyaMriTaxMeta,
} from "./kenya-mri-tax-diaspora-landlords";
import WhyViewingsMatter, {
  meta as whyViewingsMatterMeta,
} from "./why-property-viewings-matter-buying-remotely";
import WhyPropertyManagementMatters, {
  meta as whyPropertyManagementMattersMeta,
} from "./why-property-management-matters-diaspora-landlords";

export type { Author, PostMeta } from "./_shared";
export { authors } from "./_shared";

import type { PostMeta } from "./_shared";

export type Post = {
  meta: PostMeta;
  Component: ComponentType;
};

// Ordered newest-first. Adding a post means: drop a new file in this
// directory exporting `meta` and a default React component, then add
// a line here. The sitemap and the /insights index pick up the new
// entry automatically.
export const posts: readonly Post[] = [
  { meta: kenyaMriTaxMeta, Component: KenyaMriTax },
  { meta: whyViewingsMatterMeta, Component: WhyViewingsMatter },
  {
    meta: whyPropertyManagementMattersMeta,
    Component: WhyPropertyManagementMatters,
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.meta.slug === slug);
}

export function relatedPosts(slug: string, limit = 2): Post[] {
  return posts.filter((p) => p.meta.slug !== slug).slice(0, limit);
}
