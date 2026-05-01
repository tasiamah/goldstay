import Link from "next/link";

// Renders a row of "× Country: Kenya" chips below the toolbar so an
// operator can see at a glance which filters narrow the list, and
// remove them one click at a time. Server component on purpose: it
// only needs the parsed filters and the base path.
export type Chip = { key: string; label: string };

export function ActiveFilterChips({
  chips,
  basePath,
  allParams,
}: {
  chips: Chip[];
  basePath: string;
  // The currently-applied params, so we can compute the "remove
  // this one" URL while preserving the others.
  allParams: Record<string, string | null | undefined>;
}) {
  if (chips.length === 0) return null;

  function urlWithout(key: string) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(allParams)) {
      if (k === key) continue;
      if (v === null || v === undefined || v === "") continue;
      params.set(k, v);
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs uppercase tracking-wider text-stone-400">
        Filters
      </span>
      {chips.map((c) => (
        <Link
          key={c.key}
          href={urlWithout(c.key)}
          className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-700 hover:bg-stone-100"
        >
          <span aria-hidden>×</span>
          <span>{c.label}</span>
        </Link>
      ))}
      <Link
        href={basePath}
        className="text-xs font-medium text-stone-500 underline-offset-2 hover:underline"
      >
        Reset all
      </Link>
    </div>
  );
}
