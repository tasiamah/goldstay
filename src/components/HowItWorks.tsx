import { steps } from "@/lib/site";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section">
      <div className="container-gs">
        <SectionHeader
          eyebrow="How it works"
          title="Three steps. Zero admin on your side."
        />
        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="relative pl-0">
                <div className="font-mono text-sm text-gold-600">{s.n}</div>
                <div className="mt-4 hairline" />
                <h3 className="mt-8 font-serif text-3xl">{s.title}</h3>
                <p className="mt-4 text-charcoal/70">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
