// Inline glossary "tip" — a small dotted-underline indicator that
// reveals a one-line definition on hover/focus.
//
// Use it to demystify ops jargon for new hires. Examples:
//   <Tip term="ONBOARDING">
//     Property is being verified by Goldstay; not yet renting.
//   </Tip>
//   <Tip term="GMV">Gross merchandise value, ex commissions.</Tip>
//
// Native <abbr> with a title attribute would do most of the job
// but the styling is inconsistent across browsers and the
// platform team wanted a controlled visual treatment. Pure CSS,
// no client component needed.

import type { ReactNode } from "react";

export function Tip({
  term,
  children,
}: {
  term: ReactNode;
  children: ReactNode;
}) {
  return (
    <span className="group relative cursor-help">
      <span className="border-b border-dotted border-stone-400 text-stone-700">
        {term}
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-0 top-full z-20 mt-1 hidden w-64 rounded-md border border-stone-200 bg-white p-3 text-xs font-normal leading-relaxed text-stone-700 shadow-lg group-hover:block group-focus-within:block"
      >
        {children}
      </span>
    </span>
  );
}
