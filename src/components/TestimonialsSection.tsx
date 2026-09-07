import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";
import { testimonials } from "@/lib/testimonials";

// What landlords say. Renders nothing at all while lib/testimonials.ts
// is empty, which is the state it ships in.
//
// A section that says "testimonials coming soon", or one padded with
// invented quotes, is worse than no section: the first advertises that
// nobody has vouched for us yet, and the second is a lie attributed to
// a named person. So this returns null and the page simply does not
// have the section until there is something true to put in it.
//
// Placed after the guarantees on the homepage on purpose. That section
// makes six promises; this is where a landlord who has just read them
// finds somebody other than us saying we kept them.
export function TestimonialsSection() {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="section bg-white/50">
      <div className="container-gs">
        <SectionHeader
          eyebrow="In their words"
          title="What landlords say once we are running it."
          lede="Unedited, and named with permission. If you would like to speak to one of them before you decide, ask us and we will arrange it."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <Reveal key={`${t.name}-${t.date}`}>
              <figure className="flex h-full flex-col justify-between rounded-2xl border border-charcoal/10 bg-white p-7">
                <blockquote className="text-charcoal/85 pretty">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 border-t border-charcoal/10 pt-5">
                  <div className="font-medium text-charcoal">
                    {t.name}
                    {t.nameIsPartial ? (
                      <span className="ml-1.5 text-xs font-normal text-charcoal/45">
                        (name shortened at their request)
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 text-sm text-charcoal/60">
                    {t.location}
                  </div>
                  <div className="mt-2 font-mono text-[0.65rem] uppercase tracking-widest-xl text-charcoal/45">
                    {t.context}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
