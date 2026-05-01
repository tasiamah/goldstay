// Breadcrumb trail rendered above page titles on detail surfaces.
//
// Server component so it composes naturally with our existing
// async pages. Pass an array of `{label, href?}` — the last item
// is rendered without an href and styled as the current page.
// Anything you can wedge into a Link works here.

import Link from "next/link";

export type Crumb = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-stone-500">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((crumb, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-1">
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="hover:text-stone-900 hover:underline"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "text-stone-900" : ""}
                >
                  {crumb.label}
                </span>
              )}
              {!isLast ? (
                <span aria-hidden="true" className="text-stone-300">
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
