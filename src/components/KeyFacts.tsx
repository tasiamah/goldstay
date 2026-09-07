import { Reveal } from "./Reveal";

/**
 * An answer-first summary block for the top of a money page.
 *
 * Two different readers are being served by the same markup. A landlord
 * skimming wants the fee, the payout date and the exit terms without
 * reading nine sections to assemble them. Google and the AI answer
 * engines want a short, self-contained, attributable answer to the
 * question the page is named after, and they will quote whatever is
 * closest to that shape. Our pages currently bury both: the fee is in
 * an FAQ two thirds down, the payout terms are in a guarantee card on a
 * different page, and there is no single paragraph anywhere that
 * answers "what is Airbnb management in Kenya" in a form anything
 * could lift.
 *
 * `answer` therefore has to work standing completely alone, with no
 * pronouns pointing at earlier copy and no "as described above". If it
 * cannot be pasted into a search result and still make sense, it is
 * written wrong.
 *
 * The facts render as a description list rather than a table or a set
 * of divs because that is the one HTML structure that says "these are
 * name/value pairs" without needing the styling to imply it.
 */
export type KeyFact = {
  label: string;
  value: string;
};

export function KeyFacts({
  question,
  answer,
  facts,
  footnote,
}: {
  question: string;
  answer: string;
  facts: KeyFact[];
  footnote?: string;
}) {
  return (
    <section className="border-y border-charcoal/10 bg-cream py-14 md:py-16">
      <div className="container-gs">
        <Reveal>
          <div className="mx-auto max-w-4xl">
            <div className="eyebrow text-gold-700">In short</div>
            <h2 className="mt-4 font-serif text-2xl balance sm:text-3xl md:text-4xl">
              {question}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-charcoal/85 pretty">
              {answer}
            </p>

            <dl className="mt-10 grid gap-x-10 gap-y-5 border-t border-charcoal/10 pt-8 sm:grid-cols-2">
              {facts.map((f) => (
                <div key={f.label} className="flex flex-col gap-1">
                  <dt className="font-mono text-[0.65rem] uppercase tracking-widest-xl text-charcoal/50">
                    {f.label}
                  </dt>
                  <dd className="text-charcoal">{f.value}</dd>
                </div>
              ))}
            </dl>

            {footnote && (
              <p className="mt-8 text-sm text-charcoal/60 pretty">{footnote}</p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
