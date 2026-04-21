import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import { cities } from "@/lib/site";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";

const imageFor = (c: "nairobi" | "accra") =>
  c === "nairobi"
    ? "https://images.unsplash.com/photo-1623862827893-3c66e3f1b1f7?auto=format&fit=crop&w=1600&q=80"
    : "https://images.unsplash.com/photo-1589793907316-f94025b46850?auto=format&fit=crop&w=1600&q=80";

export function LocationsSection() {
  return (
    <section id="locations" className="section bg-white/50">
      <div className="container-gs">
        <SectionHeader
          eyebrow="Locations"
          title="Two cities. One standard."
          lede="We focus deeply on the neighbourhoods diaspora landlords actually own property in — and tenant demand is strongest."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {(["nairobi", "accra"] as const).map((key, i) => {
            const c = cities[key];
            return (
              <Reveal key={key} delay={i * 0.05}>
                <Link
                  href={`/${key}`}
                  className="group relative block overflow-hidden rounded-3xl border border-charcoal/10"
                >
                  <div
                    className="aspect-[4/3] bg-cover bg-center transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.04]"
                    style={{ backgroundImage: `url('${imageFor(key)}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-8 text-cream">
                    <div className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest-xl text-gold-400">
                      <MapPin className="h-3 w-3" />
                      {c.country}
                    </div>
                    <div className="mt-2 flex items-end justify-between">
                      <h3 className="font-serif text-4xl capitalize md:text-5xl">
                        {key}
                      </h3>
                      <ArrowUpRight className="h-6 w-6 transition-transform duration-500 ease-premium group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </div>
                    <p className="mt-4 max-w-md text-sm text-cream/80">
                      {c.neighbourhoods.join(" · ")}
                    </p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
