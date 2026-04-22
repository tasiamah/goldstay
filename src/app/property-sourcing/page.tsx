import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  Search,
  Handshake,
  FileCheck,
  Eye,
  Building2,
  KeyRound,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { CTABanner } from "@/components/CTABanner";
import { FAQSection } from "@/components/FAQSection";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Property Sourcing for Diaspora Buyers",
  description:
    "Buy-side property sourcing in Nairobi and Accra. We find the right property, negotiate the price, verify the title and hand you a turnkey asset ready to rent. Free for buyers.",
  alternates: { canonical: "/property-sourcing" },
};

const pillars = [
  {
    icon: Search,
    title: "Brief and Search",
    body: "We start with your budget, target yield, timeline and lifestyle constraints. Then we shortlist properties from both on-market listings and off-market inventory in our network.",
  },
  {
    icon: Eye,
    title: "Remote Tour and Inspection",
    body: "Live video walk-throughs so you see the property as if you were there. In-person inspection by our team with a written report on condition, finishings and neighbourhood.",
  },
  {
    icon: Handshake,
    title: "Price Negotiation",
    body: "We represent the buyer, not the seller. We benchmark against comparable sales, negotiate on your behalf, and walk away when the number doesn't work.",
  },
  {
    icon: FileCheck,
    title: "Title and Legal Verification",
    body: "Our property lawyers verify title at the Lands Registry, check for encumbrances, confirm service charge status and draft a watertight sale agreement in your name.",
  },
  {
    icon: Building2,
    title: "Building Due Diligence",
    body: "For apartments, we pull service charge history, resident complaints, reserve fund health and developer track record. Red flags get a red flag. You pick what risk you're willing to carry.",
  },
  {
    icon: KeyRound,
    title: "Handover at Completion",
    body: "Keys, title documents, snagging list, utility transfers, management committee contacts and furnished inventory in one clean pack. Ready to rent the day you get it.",
  },
];

const steps = [
  {
    k: "01",
    title: "Brief call",
    body: "30 minutes on WhatsApp or Zoom. Budget, target yield, timeline, whether you'll eventually live in it yourself, what you absolutely don't want.",
  },
  {
    k: "02",
    title: "Shortlist in 14 days",
    body: "We come back with 5 to 8 properties that fit the brief, with video, photos, rental comps and expected net yield for each. You approve a short list.",
  },
  {
    k: "03",
    title: "In-person inspection",
    body: "We physically inspect every property on the short list, write condition reports and flag anything that would concern an owner who hadn't been there.",
  },
  {
    k: "04",
    title: "Negotiate and secure",
    body: "We negotiate on your behalf, lock in the price with a deposit, and run the conveyancing with our property lawyers to completion.",
  },
  {
    k: "05",
    title: "Handover, rent-ready",
    body: "At completion we hand you a turnkey property: keys, title documents, snagging list, utilities in your name and management committee contacts. You're ready to rent the day you receive it.",
  },
];

export default function Page() {
  return (
    <>
      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/locations/nairobi.jpg')",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/80 via-charcoal/70 to-charcoal/95" />
        <div className="container-gs pb-20 md:pb-32">
          <Reveal>
            <div className="max-w-3xl">
              <div className="eyebrow text-gold-400">Property sourcing</div>
              <h1 className="mt-6 font-serif text-display-lg text-cream balance">
                Buy in Nairobi or Accra without{" "}
                <em className="italic">flying over</em>, and without getting
                burned.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-cream/80 pretty md:text-xl">
                We do the running around you would have done if you still lived
                here. On-the-ground search, in-person inspection, price
                negotiation, title verification and handover. All of it, free
                for you as the buyer.
              </p>
              <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <a
                  href={waLink(
                    "Hi Goldstay, I'd like to discuss buying a property with your sourcing team",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Start a buying brief
                </a>
                <Link href="/list-your-property" className="btn-ghost-light">
                  Or fill in the form →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-gs">
          <SectionHeader
            eyebrow="How it works"
            title="Six things we do before you pay a single shilling for the property."
            lede="Everything a careful buyer would do if they lived in Nairobi or Accra full time. Done by people who actually do."
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
        <div className="container-gs">
          <SectionHeader
            eyebrow="The process"
            title="Five steps from brief to keys in your name."
            lede="Timelines are indicative. In practice most clients go from first call to completion in three to four months, depending on financing."
          />
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {steps.map((s, i) => (
              <Reveal key={s.k} delay={i * 0.05}>
                <div className="h-full rounded-3xl border border-charcoal/10 bg-cream p-6">
                  <div className="font-mono text-xs text-gold-600">{s.k}</div>
                  <h3 className="mt-6 font-serif text-xl">{s.title}</h3>
                  <p className="mt-3 text-sm text-charcoal/70">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-gs grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <div className="eyebrow">How we work</div>
              <h2 className="mt-4 font-serif text-display-md balance">
                Free for you. Designed to find a property you will actually keep.
              </h2>
              <p className="mt-5 text-charcoal/75">
                The service is free for you as the buyer. That means we can
                only succeed by finding you a property good enough that you
                want us to manage it afterwards, or good enough that you
                recommend us to the next diaspora buyer in your circle. The
                incentive is to find the right property, not to close the
                first one.
              </p>
              <ul className="mt-8 space-y-3 text-sm">
                {[
                  "On-the-ground search covering listed and off-market inventory",
                  "Written brief up front, written rationale for every shortlist",
                  "Walk away at any time, with no obligation",
                  "Seamless handover into Goldstay management when you're ready",
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
              <div className="eyebrow text-gold-400">Indicative yield</div>
              <h3 className="mt-4 font-serif text-2xl sm:text-3xl">
                2-bed apartment, Kilimani or East Legon
              </h3>
              <ul className="mt-8 divide-y divide-cream/10 text-sm">
                {[
                  ["Indicative purchase price", "USD 180,000 to 220,000"],
                  ["Long-term rent (gross)", "USD 1,400 to 1,900 / month"],
                  ["Short-stay potential (gross)", "USD 2,200 to 2,800 / month"],
                  ["Typical long-term net yield", "7 to 8.5% per year"],
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
                  <span className="text-cream">Paid to you in</span>
                  <span className="text-right font-serif text-xl text-gold-400 sm:text-2xl">
                    USD
                  </span>
                </li>
              </ul>
              <p className="mt-6 text-xs text-cream/50">
                Indicative only. Actual price and yield depend on the specific
                unit, building, finishing and market conditions. We give you a
                specific estimate after the first shortlist.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <FAQSection />
      <CTABanner
        headline="Thinking about buying?"
        subheadline="Start with a 30-minute brief call. No commitment, and the first shortlist lands within 14 days."
      />
    </>
  );
}
