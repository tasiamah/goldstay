// SortableHeader — clickable <th> that toggles a column's sort and
// redirects via Link. Pure presentation; nextSortFor + sortToParam
// live in lib/admin/table so we can unit-test the URL math.

import Link from "next/link";
import {
  buildHref,
  nextSortFor,
  sortToParam,
  type RawParams,
  type SortState,
} from "@/lib/admin/table";

export function SortableHeader({
  column,
  label,
  current,
  basePath,
  params,
  align = "left",
}: {
  column: string;
  label: string;
  current: SortState;
  basePath: string;
  params: RawParams;
  align?: "left" | "right";
}) {
  const isActive = current.column === column;
  const next = nextSortFor(column, current);
  const href = buildHref(basePath, params, {
    sort: sortToParam(next),
    page: "1", // resetting page on sort change keeps results consistent
  });
  const arrow = isActive ? (current.direction === "asc" ? "↑" : "↓") : "";
  return (
    <th
      className={`px-4 py-2 ${
        align === "right" ? "text-right" : "text-left"
      } text-xs font-semibold uppercase tracking-wider text-stone-500`}
    >
      <Link
        href={href}
        className={`inline-flex items-center gap-1 ${
          isActive ? "text-stone-900" : "hover:text-stone-700"
        }`}
        aria-sort={
          isActive
            ? current.direction === "asc"
              ? "ascending"
              : "descending"
            : "none"
        }
      >
        {label}
        {arrow ? (
          <span aria-hidden="true" className="text-stone-700">
            {arrow}
          </span>
        ) : (
          <span aria-hidden="true" className="opacity-0">
            ↕
          </span>
        )}
      </Link>
    </th>
  );
}

export function PlainHeader({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-4 py-2 ${
        align === "right" ? "text-right" : "text-left"
      } text-xs font-semibold uppercase tracking-wider text-stone-500`}
    >
      {children}
    </th>
  );
}
