import type { Metadata } from "next";
import Link from "next/link";
import { Check, Camera, LineChart, MessageCircle, Sparkles, Wrench, Receipt } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { CTABanner } from "@/components/CTABanner";
import { FAQSection } from "@/components/FAQSection";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Airbnb & Short-Stay Management",
  description:
    "Full Airbnb and short-stay management in Nairobi and Accra. Photography, dynamic pricing, guest comms, cleaning and USD remittance. 20% of revenue.",
  alternates: { canonical: "/airbnb-management" },
};

const pillars = [
  {
    icon: Camera,
    title: "Listing & Photography",
    body: "Professional photography, copywriting and listing launch across Airbnb, Booking.com and direct booking channels.",
  },
  {
    icon: LineChart,
    title: "Dynamic Pricing",
    body: "We adjust nightly rates daily using occupancy, events and seasonality. Static weekly prices leave money on the table.",
  },
  {
    icon: MessageCircle,
    title: "Guest Communication",
    body: "24/7 response. Pre-stay screening. Smart check-in. Local guidebooks. A concierge experience, not a DIY message thread.",
  },
  {
    icon: Sparkles,
    title: "Turnover Cleaning",
    body: "Vetted housekeeping teams, hotel-grade linen inventory, inspection checklists and amenity restocking between every stay.",
  },
  {
    icon: Wrench,
    title: "Maintenance & Compliance",
    body: "On-call handymen, safety inspections, linen rotation and full fire / CO compliance to protect your asset.",
  },
  {
    icon: Receipt,
    title: "Monthly USD Statements",
    body: "Transparent revenue statements with every booking, expense and fee itemised. Net USD wired to your bank.",
  },
];

export default function Page() {
  return (
    <>
      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2400&q=80')",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/80 via-charcoal/70 to-charcoal/95" />
        <div className="container-gs pb-20 md:pb-32">
          <Reveal>
            <div className="max-w-3xl">
              <div className="eyebrow text-gold-400">Airbnb · Short-stay</div>
              <h1 className="mt-6 font-serif text-display-lg text-cream balance">
                Turn your apartment into a{" "}
                <em className="italic">five-star</em> short-stay, without
                lifting a finger.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-cream/80 pretty md:text-xl">
                We handle photography, pricing, guests, cleaning and maintenance. You get a
                monthly statement and a USD wire. Our fee is 20% of revenue. No listing fees,
                no setup fees, no surprises.
              </p>
              <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <a
                  href={waLink(
                    "Hi Goldstay, I'd like to discuss Airbnb / short-stay management for my property",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Get a yield estimate
                </a>
                <Link
                  href="/list-your-property"
                  className="btn-ghost-light"
                >
                  Or use the form →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-gs">
          <SectionHeader
            eyebrow="Everything included"
            title="Six pillars of full-service short-stay management."
            lede="This is not a listing service. It's end-to-end operations, done to a hospitality standard."
          />
          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <div className="card h-full">
                  <p.icon className="h-6 w-6 text-gold-600" />
                  <h3 className="mt-6 font-serif text-2xl">{p.title}</h3>
                  <p className="mt-3 text-sm text-charcoal/70">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white/50">
        <div className="container-gs grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <div className="eyebrow">Yield vs long-term</div>
              <h2 className="mt-4 font-serif text-display-md balance">
                Short-stay typically yields 40 to 70% more than long-term in the neighbourhoods we operate in.
              </h2>
              <p className="mt-5 text-charcoal/75">
                But only if the operation is tight. Bad photos, flat pricing, slow guest
                replies and patchy cleaning destroy the economics instantly. We run it like a
                boutique hotel, not a side hustle.
              </p>
              <ul className="mt-8 space-y-3 text-sm">
                {[
                  "Average occupancy 72%+ in our managed portfolio",
                  "Average review score 4.88 across Nairobi & Accra",
                  "Full damage deposit cover via platform guarantees",
                  "No lock-in. 30 days notice to exit anytime.",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-700">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="text-charcoal/80">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-charcoal/10 bg-charcoal p-6 text-cream sm:p-8 md:p-10">
              <div className="eyebrow text-gold-400">Illustrative economics</div>
              <h3 className="mt-4 font-serif text-2xl sm:text-3xl">
                2-bed apartment, Westlands or East Legon
              </h3>
              <ul className="mt-8 divide-y divide-cream/10 text-sm">
                {[
                  ["Nightly rate (avg)", "USD 85"],
                  ["Occupancy", "72%"],
                  ["Gross monthly revenue", "USD 1,836"],
                  ["Goldstay fee (20%)", "USD 367"],
                  ["Cleaning & platform fees", "USD 260"],
                ].map(([k, v]) => (
                  <li
                    key={k}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <span className="text-cream/60">{k}</span>
                    <span className="text-right">{v}</span>
                  </li>
                ))}
                <li className="flex items-center justify-between gap-4 py-4">
                  <span className="text-cream">Net to landlord</span>
                  <span className="text-right font-serif text-xl text-gold-400 sm:text-2xl">
                    USD 1,209
                  </span>
                </li>
              </ul>
              <p className="mt-6 text-xs text-cream/50">
                Illustrative only. Actual yield depends on location, size, furnishing and
                season. We&apos;ll give you a specific estimate after assessment.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <FAQSection />
      <CTABanner
        headline="Ready to turn it into a short-stay?"
        subheadline="Get a specific yield estimate for your apartment within 48 hours."
      />
    </>
  );
}
