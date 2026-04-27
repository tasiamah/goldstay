"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

// Search input for the /insights index. Acts as a real form (works with
// JS off, submits ?q=... to /insights) and as a debounced live filter
// when JS is on. The actual filtering happens server-side in
// /insights/page.tsx so the URL is the single source of truth and
// every result state is shareable and crawlable.
export function InsightsSearch({
  initialQuery,
  totalResults,
}: {
  initialQuery: string;
  totalResults: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(initialQuery);
  const [, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setValue(initialQuery);
  }, [initialQuery]);

  function pushQuery(next: string) {
    const search = new URLSearchParams(params?.toString() ?? "");
    if (next.trim()) {
      search.set("q", next.trim());
    } else {
      search.delete("q");
    }
    search.delete("page");
    const qs = search.toString();
    startTransition(() => {
      router.replace(qs ? `/insights?${qs}` : "/insights", { scroll: false });
    });
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setValue(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => pushQuery(next), 250);
  }

  function clear() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setValue("");
    pushQuery("");
  }

  return (
    <form
      action="/insights"
      method="get"
      role="search"
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        if (debounceRef.current) clearTimeout(debounceRef.current);
        pushQuery(value);
      }}
    >
      <label className="relative block">
        <span className="sr-only">Search insights</span>
        <Search
          aria-hidden
          className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/50"
        />
        <input
          type="search"
          name="q"
          value={value}
          onChange={onChange}
          autoComplete="off"
          placeholder="Search articles by topic, tag or keyword"
          className="w-full rounded-full border border-charcoal/15 bg-cream py-4 pl-14 pr-14 text-base text-charcoal placeholder:text-charcoal/45 transition focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
        />
        {value ? (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-charcoal/50 transition hover:bg-charcoal/5 hover:text-charcoal"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </label>
      <p
        className="mt-3 text-sm text-charcoal/55"
        aria-live="polite"
      >
        {initialQuery
          ? `${totalResults} ${totalResults === 1 ? "article" : "articles"} matching "${initialQuery}"`
          : `${totalResults} ${totalResults === 1 ? "article" : "articles"} in the library`}
      </p>
    </form>
  );
}
