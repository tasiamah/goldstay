import { painPoints } from "@/lib/site";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";
import {
  PhoneOff,
  Clock,
  AlertTriangle,
  ArrowRightLeft,
} from "lucide-react";

const icons = [PhoneOff, Clock, AlertTriangle, ArrowRightLeft];

export function ProblemSection({
  city,
}: {
  city?: "nairobi" | "accra";
}) {
  // The default "Currency Friction" pain point talks about KES or GHS, which
  // leaks Ghana onto Kenya-scoped surfaces (/nairobi, goldstay.co.ke). When
  // a city is known, swap that single body for the market's own currency.
  const localPainPoints =
    city === "nairobi"
      ? painPoints.map((p) =>
          p.title === "Currency Friction"
            ? {
                ...p,
                body: "Collecting rent in KES and wrestling with conversion, wire fees and timing every single month.",
              }
            : p,
        )
      : city === "accra"
        ? painPoints.map((p) =>
            p.title === "Currency Friction"
              ? {
                  ...p,
                  body: "Collecting rent in GHS and wrestling with conversion, wire fees and timing every single month.",
                }
              : p,
          )
        : painPoints;

  return (
    <section className="section relative">
      <div className="container-gs">
        <SectionHeader
          eyebrow="The problem we solve"
          title="Managing property from abroad is a second job you never signed up for."
          lede="Every diaspora landlord knows the cycle. We built Goldstay to end it."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {localPainPoints.map((p, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={p.title} delay={i * 0.05}>
                <article className="card h-full">
                  <Icon className="h-6 w-6 text-gold-600" />
                  <h3 className="mt-6 font-serif text-2xl">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                    {p.body}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
