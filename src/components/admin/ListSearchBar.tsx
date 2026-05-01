"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Debounced search input that updates `?q=` in the URL. Lives next
// to the FilterSelect on every admin list page.
//
// We keep a local state for the input value so typing is responsive
// even while the server fetches, then push a new URL after the
// debounce window. The pending bar visually confirms a query is in
// flight without blocking input.
const DEBOUNCE_MS = 220;

export function ListSearchBar({
  placeholder,
  ariaLabel,
}: {
  placeholder: string;
  ariaLabel?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initial = searchParams?.get("q") ?? "";

  const [value, setValue] = useState(initial);
  const [pending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // External param changes (e.g. operator clears via the chip below)
  // should sync back into the input.
  useEffect(() => {
    setValue(initial);
  }, [initial]);

  function pushQuery(next: string) {
    // Clone existing params so we don't blow away other filters
    // (status, country, type) when typing in the search box.
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (next.trim() === "") params.delete("q");
    else params.set("q", next);

    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setValue(v);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => pushQuery(v), DEBOUNCE_MS);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (timer.current) clearTimeout(timer.current);
    pushQuery(value);
  }

  return (
    <form onSubmit={onSubmit} className="relative w-full sm:max-w-xs">
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className="block w-full rounded-md border border-stone-300 bg-white py-2 pl-9 pr-8 text-sm text-stone-900 shadow-sm placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
      >
        ⌕
      </span>
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            setValue("");
            pushQuery("");
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-2 text-stone-400 hover:text-stone-600"
        >
          ×
        </button>
      ) : null}
      {/* Subtle in-flight indicator so the operator knows their
          keystroke landed, without a layout-shifting spinner. */}
      <span
        aria-hidden
        className={`absolute inset-x-0 bottom-0 h-px origin-left transform bg-stone-400 transition-transform duration-200 ${
          pending ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </form>
  );
}
