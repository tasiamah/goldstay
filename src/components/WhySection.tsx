import {
  MapPin,
  DollarSign,
  LineChart,
  Globe2,
} from "lucide-react";
import { differentiators } from "@/lib/site";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";

const icons = [MapPin, DollarSign, LineChart, Globe2];

export function WhySection() {
  return (
    <section className="section">
      <div className="container-gs">
        <SectionHeader
          eyebrow="Why Goldstay"
          title="Built for diaspora landlords. Operated on the ground."
          lede="We combine local presence with international financial infrastructure. Nothing falls through the cracks."
        />

        <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {differentiators.map((d, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={d.title} delay={i * 0.05}>
                <div className="relative">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10 text-gold-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-2xl">{d.title}</h3>
                  <p className="mt-3 text-charcoal/70">{d.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
