// Pagination footer for any URL-driven table. Renders a row counter,
// page-size selector, and prev / window / next links. Skips itself
// entirely when there's only one page.

import Link from "next/link";
import {
  PAGE_SIZE_OPTIONS,
  buildHref,
  pageWindow,
  totalPages,
  type RawParams,
} from "@/lib/admin/table";

export function Pagination({
  basePath,
  params,
  page,
  pageSize,
  totalRows,
}: {
  basePath: string;
  params: RawParams;
  page: number;
  pageSize: number;
  totalRows: number;
}) {
  const total = totalPages(totalRows, pageSize);
  const start = totalRows === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalRows);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 bg-stone-50 px-4 py-3 text-xs text-stone-600">
      <p>
        {totalRows === 0 ? (
          "No rows"
        ) : (
          <>
            Showing <strong>{start.toLocaleString()}</strong>–
            <strong>{end.toLocaleString()}</strong> of{" "}
            <strong>{totalRows.toLocaleString()}</strong>
          </>
        )}
      </p>

      <form
        method="get"
        action={basePath}
        className="flex items-center gap-2"
      >
        <PreserveOtherParams
          params={params}
          omit={["pageSize", "page"]}
        />
        <label className="flex items-center gap-1">
          <span>Per page</span>
          <select
            name="pageSize"
            defaultValue={String(pageSize)}
            className="rounded-md border border-stone-300 bg-white px-2 py-1 text-xs text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          >
            {PAGE_SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-md border border-stone-300 bg-white px-2 py-1 text-xs text-stone-700 hover:bg-stone-100"
        >
          Apply
        </button>
      </form>

      {total > 1 ? (
        <nav className="flex items-center gap-1" aria-label="Pagination">
          <PageLink
            label="‹ Prev"
            disabled={page <= 1}
            href={buildHref(basePath, params, { page: String(page - 1) })}
          />
          {pageWindow(page, total).map((p) => (
            <PageLink
              key={p}
              label={String(p)}
              active={p === page}
              href={buildHref(basePath, params, { page: String(p) })}
            />
          ))}
          <PageLink
            label="Next ›"
            disabled={page >= total}
            href={buildHref(basePath, params, { page: String(page + 1) })}
          />
        </nav>
      ) : null}
    </div>
  );
}

function PageLink({
  label,
  href,
  active,
  disabled,
}: {
  label: string;
  href: string;
  active?: boolean;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <span className="rounded-md border border-stone-200 bg-stone-100 px-2 py-1 text-xs text-stone-400">
        {label}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={
        active
          ? "rounded-md bg-stone-900 px-2 py-1 text-xs font-medium text-white"
          : "rounded-md border border-stone-300 bg-white px-2 py-1 text-xs text-stone-700 hover:bg-stone-100"
      }
    >
      {label}
    </Link>
  );
}

// Renders <input type=hidden> for every other query param so the
// page-size form submission doesn't drop unrelated state (q, sort,
// country, …).
function PreserveOtherParams({
  params,
  omit,
}: {
  params: RawParams;
  omit: string[];
}) {
  const skip = new Set(omit);
  const fields: React.ReactNode[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (skip.has(k) || v === undefined || v === null || v === "") continue;
    if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (item)
          fields.push(
            <input key={`${k}-${i}`} type="hidden" name={k} value={item} />,
          );
      });
    } else {
      fields.push(<input key={k} type="hidden" name={k} value={String(v)} />);
    }
  }
  return <>{fields}</>;
}
