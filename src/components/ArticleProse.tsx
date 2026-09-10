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
/**
 * An answer-first summary for the top of an article.
 *
 * The money pages have had `KeyFacts` for a while and the articles have
 * had nothing, which turned out to be the wrong way round. On 9 Sep
 * thirty-eight articles were ranking in Google's top ten and
 * thirty-five of them took no clicks at all, which is what it looks
 * like when an AI Overview answers the question above the result. The
 * ranking is not the problem on those pages; there is simply nothing on
 * them shaped like an answer to lift.
 *
 * `Lede` is not that shape and should not be made into it. A lede sets
 * the problem up and earns the next paragraph: "three charges, three
 * collectors, three methods, here is the honest guide". That is a
 * promise, and a promise cannot be quoted.
 *
 * `answer` has to survive being cut out of the page. No "as we saw
 * above", no pronoun pointing at the lede, no "this guide explains".
 * State the answer, in numbers where there are numbers. If it reads
 * oddly pasted into a search result on its own, rewrite it.
 *
 * Sits after the lede rather than before it so the human still gets the
 * hook first; a machine does not care about order, only about finding a
 * self-contained paragraph somewhere near the top.
 */
export function KeySummary({
  question,
  answer,
  facts,
}: {
  question?: string;
  answer: string;
  facts?: { label: string; value: string }[];
}) {
  return (
    <aside className="my-10 rounded-2xl border border-charcoal/12 bg-sand/40 p-6 md:p-8">
      <div className="font-mono text-[0.7rem] uppercase tracking-widest-xl text-gold-700">
        In short
      </div>
      {question && (
        <h2 className="mt-3 font-serif text-xl text-charcoal md:text-2xl">
          {question}
        </h2>
      )}
      <p className="mt-3 text-base leading-[1.7] text-charcoal/85 md:text-lg">
        {answer}
      </p>
      {facts && facts.length > 0 && (
        <dl className="mt-6 grid gap-x-8 gap-y-4 border-t border-charcoal/10 pt-6 sm:grid-cols-2">
          {facts.map((f) => (
            <div key={f.label} className="flex flex-col gap-1">
              <dt className="font-mono text-[0.65rem] uppercase tracking-widest-xl text-charcoal/50">
                {f.label}
              </dt>
              <dd className="text-sm text-charcoal/85">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </aside>
  );
}

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
