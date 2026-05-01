// Small "?" icon next to a heading that reveals a one-paragraph
// explanation on hover or focus. Inspired by the
// <Tooltip><TooltipHeader/><TooltipBody/></Tooltip> pattern in
// apollo-ui — contextual, unobtrusive, always available.
//
// Pure CSS via group-hover / group-focus-within so it stays a
// server component (no JS shipped, no hydration cost). Mobile
// users open it via tap-to-focus on the <button>.
//
// Use it next to the <h2> of any dashboard section that needs a
// one-line explanation of "what is this and what's it for".

import type { ReactNode } from "react";

export type HelpHintProps = {
  label: string;
  children: ReactNode;
  align?: "left" | "right";
};

export function HelpHint({ label, children, align = "left" }: HelpHintProps) {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        aria-label={`What is ${label}?`}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-stone-300 text-[11px] font-medium text-stone-500 transition-colors group-hover:border-stone-500 group-hover:text-stone-900 group-focus-within:border-stone-500 group-focus-within:text-stone-900"
      >
        ?
      </button>
      <span
        role="tooltip"
        className={`pointer-events-none invisible absolute top-full z-20 mt-2 w-64 rounded-md border border-stone-200 bg-white p-3 text-xs leading-relaxed text-stone-700 opacity-0 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 ${
          align === "right" ? "right-0" : "left-0"
        }`}
      >
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500">
          {label}
        </span>
        <span className="mt-1 block">{children}</span>
      </span>
    </span>
  );
}
