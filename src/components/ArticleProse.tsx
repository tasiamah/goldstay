import type { ReactNode } from "react";

// Tiny wrapper components that give every insights post a consistent
// prose rhythm without us hand-tuning Tailwind classes inside every
// article. Keeps the editorial voice cohesive: same H2 size, same
// paragraph leading, same callout treatment, same lede typography.
//
// We deliberately avoid the @tailwindcss/typography plugin here.
// "prose" is generic; this brand has a specific serif/charcoal
// rhythm, italics in gold, and pull-quotes that look like the rest
// of the site. Coding it explicitly is a few more lines and saves
// the dependency.

export function Lede({ children }: { children: ReactNode }) {
  return (
    <p className="font-serif text-xl leading-[1.55] text-charcoal/85 md:text-2xl">
      {children}
    </p>
  );
}

export function H2({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="mt-16 font-serif text-3xl leading-tight text-charcoal balance md:text-4xl"
    >
      {children}
    </h2>
  );
}

export function H3({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h3
      id={id}
      className="mt-10 font-serif text-2xl leading-tight text-charcoal"
    >
      {children}
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="mt-5 text-base leading-[1.75] text-charcoal/80 md:text-lg">
      {children}
    </p>
  );
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-5 list-disc space-y-2 pl-6 text-base leading-[1.75] text-charcoal/80 md:text-lg">
      {children}
    </ul>
  );
}

export function OL({ children }: { children: ReactNode }) {
  return (
    <ol className="mt-5 list-decimal space-y-2 pl-6 text-base leading-[1.75] text-charcoal/80 md:text-lg">
      {children}
    </ol>
  );
}

export function LI({ children }: { children: ReactNode }) {
  return <li className="pl-1">{children}</li>;
}

// Pull-quote treatment for the one or two lines per article we want
// the reader to leave with. Matches the gold-italic accent we use
// throughout the site so the article feels like a continuation of
// the brand and not a generic blog post.
export function Pullquote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-12 border-l-4 border-gold-500 pl-6 font-serif text-2xl italic leading-snug text-charcoal/90 md:text-3xl">
      {children}
    </blockquote>
  );
}

// Inline soft-callout box for "what this means in practice" or
// "common mistake" asides.
export function Callout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="my-10 rounded-2xl border border-gold-500/30 bg-gold-500/5 p-6 md:p-8">
      <div className="font-mono text-[0.7rem] uppercase tracking-widest-xl text-gold-700">
        {title}
      </div>
      <div className="mt-3 text-base leading-[1.7] text-charcoal/80 md:text-lg">
        {children}
      </div>
    </aside>
  );
}
