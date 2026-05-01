"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Single-value filter dropdown. Updates one URL query param while
// preserving the rest. Empty string === "all" (param is removed).
export function FilterSelect({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams?.get(name) ?? "";

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (e.target.value === "") params.delete(name);
    else params.set(name, e.target.value);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <label className="flex items-center gap-2 text-sm text-stone-600">
      <span className="hidden sm:inline">{label}</span>
      <select
        value={current}
        onChange={onChange}
        aria-label={label}
        className="rounded-md border border-stone-300 bg-white py-2 pl-3 pr-8 text-sm text-stone-900 shadow-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
      >
        <option value="">All {label.toLowerCase()}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
