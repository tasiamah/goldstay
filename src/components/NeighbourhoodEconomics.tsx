import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";
import { cities } from "@/lib/site";

function formatUsd(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

export function NeighbourhoodEconomics({
  city,
}: {
  city: "nairobi" | "accra";
}) {
  const c = cities[city];
  const cityName = city === "nairobi" ? "Nairobi" : "Accra";

  return (
    <section className="section bg-cream">
      <div className="container-gs">
        <SectionHeader
          eyebrow="By the neighbourhood"
          title={`What 2-bedroom rent actually looks like in ${cityName}, today.`}
          lede="Indicative monthly rent for a recently let, well-finished 2-bedroom apartment, in USD. These are the bands we'd expect to price a property into; the actual number depends on finishings, floor, view and season. Updated quarterly from our managed portfolio and comparable market listings."
        />

        <div className="mt-14 overflow-hidden rounded-3xl border border-charcoal/10 bg-white/70 shadow-soft">
          <div className="hidden md:grid md:grid-cols-[1.2fr_1fr_1.2fr] border-b border-charcoal/10 bg-cream-100/60 px-8 py-4 text-xs uppercase tracking-widest-xl text-charcoal/50 font-mono">
            <div>Neighbourhood</div>
            <div>2BR USD / month</div>
            <div>Typical tenant</div>
          </div>
          <div className="divide-y divide-charcoal/5">
            {c.neighbourhoods.map((n, i) => (
              <Reveal key={n.name} delay={i * 0.03}>
                <div className="grid grid-cols-1 items-center gap-2 px-6 py-5 md:grid-cols-[1.2fr_1fr_1.2fr] md:gap-6 md:px-8 md:py-6">
                  <div className="font-serif text-2xl text-charcoal md:text-3xl">
                    {n.name}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-xl text-charcoal md:text-2xl">
                      {formatUsd(n.twoBrUsd.min)}
                    </span>
                    <span className="text-charcoal/40">–</span>
                    <span className="font-serif text-xl text-charcoal md:text-2xl">
                      {formatUsd(n.twoBrUsd.max)}
                    </span>
                  </div>
                  <div className="text-sm text-charcoal/70">{n.tenant}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-6 text-xs text-charcoal/55">
          Ranges are indicative and not guaranteed returns. For a specific
          estimate against your property, use the{" "}
          <a href="/yield-calculator" className="link-underline text-charcoal">
            yield calculator
          </a>{" "}
          or message us.
        </div>
      </div>
    </section>
  );
}
