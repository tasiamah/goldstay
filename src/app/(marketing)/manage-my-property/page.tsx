import type { Metadata } from "next";
import Link from "next/link";
import { Check, MessageCircle, ShieldCheck } from "lucide-react";
import { AirbnbDisclosure } from "@/components/AirbnbDisclosure";
import { BreadcrumbJsonLd, FaqJsonLd, ServiceJsonLd } from "@/components/JsonLd";
import { phone, site } from "@/lib/site";

// Paid-search landing page for the WhatsApp campaign.
//
// Kept deliberately separate from /list-your-property and
// /airbnb-management rather than pointing the ads at either, for three
// reasons.
//
// The ad has to land on a page whose headline matches the query, which
// is what Google scores as landing page experience and what decides
// how much each click costs. Those two pages are written for organic
// visitors who arrived mid-research; this one is written for somebody
// who typed "property manager nairobi" ninety seconds ago.
//
// It has exactly one call to action. Every WhatsApp button here goes
// through /go/whatsapp, which records the click server-side before
// redirecting, so the campaign can be measured against something ad
// blockers cannot drop. Adding a form would split the measurement and
// the intent for no gain: the whole premise of the campaign is that
// this audience would rather send a message than fill anything in.
//
// And it is noindex. It overlaps the homepage, which targets "property
// management nairobi" organically, and two pages of ours competing for
// one query helps neither. Note that noindex is not the same as
// disallow: /manage-my-property stays crawlable in robots.txt, because
// a landing page Googlebot cannot fetch gets the ad disapproved.

const WA_BASE = "/go/whatsapp?i=manage&p=%2Fmanage-my-property";

function waHref(source: string): string {
  return `${WA_BASE}&s=${source}`;
}

export const metadata: Metadata = {
  title: "Property Management in Nairobi | Talk to us on WhatsApp",
  description:
    "Nairobi property management for owners at home and abroad. 10% of collected rent long-term, 20% for short stay. No setup fee, nothing to leave. Message us on WhatsApp.",
  alternates: { canonical: "/manage-my-property" },
  // See the note above: paid destination only, so it cannot compete
  // with the homepage for the same query.
  robots: { index: false, follow: true },
};

const PROMISES = [
  {
    title: "Published fees, not a quote after a call",
    body: "10 percent of rent collected for long-term management. 20 percent of revenue for Airbnb and short stay. One month's rent if you only need a tenant found. Collected, not due, so we are not paid for a month you were not.",
  },
  {
    title: "Paid on the fifth, in USD if you want it",
    body: "Net rent clears to your account on the fifth of the month. If a bank holiday pushes the wire, we cover the charges rather than passing them on.",
  },
  {
    title: "A 48 hour response, with a consequence",
    body: "Miss a 48 hour reply on any request and we waive that property's management fee for the month. It is in the agreement, not on a slide.",
  },
  {
    title: "Your tax filed, with the receipt",
    body: "The 7.5 percent monthly rental income tax is calculated, withheld and remitted to KRA by the twentieth, and the receipt reference appears on your statement.",
  },
  {
    title: "Nothing to start, nothing to leave",
    body: "No setup fee, no commission taken from contractors, no letting fee charged again when a tenant renews, and no exit fee. Give notice and go.",
  },
  {
    title: "Someone actually visits",
    body: "A named manager inspects the property and writes it up, with photographs. The most common way a landlord abroad is failed is that the rent arrives and nobody has been inside for a year.",
  },
] as const;

const FAQS = [
  {
    q: "What do you charge to manage a property in Nairobi?",
    a: "10 percent of rent collected for long-term management, 20 percent of revenue for Airbnb and short stay, or a one-time fee of one month's rent if you only want a tenant found. There is no setup fee, no markup on maintenance, no letting fee at renewal and nothing payable if you leave.",
  },
  {
    q: "I live abroad. Can you manage the property without me being there?",
    a: "That is most of what we do. You never need to be in Kenya. We handle the tenant, the rent, the repairs, the county and KRA filings, and pay you in USD to an overseas account on the fifth of each month.",
  },
  {
    q: "I already have an agent. Can you take over?",
    a: "Yes, and we do the handover rather than leaving it to you. We write to the outgoing agent, recover the deposit, keys, tenancy agreement and tenant contact details, and photograph a fresh inventory before we take the first month's rent.",
  },
  {
    q: "How quickly will someone reply on WhatsApp?",
    a: "Within business hours, usually inside the hour, and always the same working day. Nairobi is GMT+3.",
  },
  {
    q: "Is my property the sort of thing you take on?",
    a: "We manage individual residential units in Nairobi, from one flat upward, both long-term and short stay. If your property would be better served by a specialist, for example a whole block needing service charge administration, we will tell you rather than take the work.",
  },
] as const;

export default function ManageMyPropertyPage() {
  return (
    <>
      <ServiceJsonLd
        name="Property Management"
        description="Long-term and short-stay property management in Nairobi for resident and diaspora owners: tenant finding and vetting, rent collection, maintenance, KRA filing and USD payouts."
        url={`https://${site.domains.nairobi}/manage-my-property`}
        serviceType="Residential property management"
        areaServed={["Nairobi"]}
        priceDescription="10% of collected rent long-term, 20% of revenue short stay"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `https://${site.domains.nairobi}` },
          {
            name: "Manage my property",
            url: `https://${site.domains.nairobi}/manage-my-property`,
          },
        ]}
      />
      <FaqJsonLd items={FAQS} />

      <section className="section pt-28" id="hero">
        <div className="container-gs max-w-3xl text-center">
          <div className="eyebrow">Nairobi property management</div>
          <h1 className="mt-4 font-serif text-display-md">
            Need someone to manage your property in Nairobi?
          </h1>
          <p className="mt-6 text-lg text-charcoal/70">
            Send us a message and tell us about the property. We will come back
            with what we would charge for your specific unit, what is included,
            and whether we are honestly the right firm for it. No call required
            and no obligation.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4">
            <a
              href={waHref("hero")}
              className="btn-primary inline-flex items-center gap-2 text-base"
              data-wa-source="ads-landing-hero"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              Message us on WhatsApp
            </a>
            <p className="text-sm text-charcoal/60">
              Replies within business hours, usually inside the hour. Or call{" "}
              <a
                href={phone.nairobi.href}
                className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
              >
                {phone.nairobi.display}
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="promises">
        <div className="container-gs">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-display-sm">
              What you are actually agreeing to
            </h2>
            <p className="mt-4 text-charcoal/70">
              Every one of these is in the management agreement. We publish them
              here so you can hold us to them, and compare us against anyone
              else without having to sit through a pitch.
            </p>
          </div>

          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PROMISES.map((p) => (
              <li
                key={p.title}
                className="rounded-lg border border-charcoal/10 p-6"
              >
                <Check
                  className="h-5 w-5 text-gold-600"
                  aria-hidden
                />
                <h3 className="mt-4 font-medium">{p.title}</h3>
                <p className="mt-2 text-sm text-charcoal/70">{p.body}</p>
              </li>
            ))}
          </ul>

          <div className="mt-12 text-center">
            <a
              href={waHref("promises")}
              className="btn-primary inline-flex items-center gap-2"
              data-wa-source="ads-landing-promises"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              Ask us about your property
            </a>
          </div>
        </div>
      </section>

      <section className="section bg-cream-100" id="how">
        <div className="container-gs max-w-3xl">
          <h2 className="text-center font-serif text-display-sm">
            What happens after you message
          </h2>
          <ol className="mt-10 space-y-6">
            {[
              {
                t: "You tell us the property",
                d: "Where it is, how many bedrooms, whether it is furnished, and whether it is tenanted, empty or already on Airbnb. Three lines is enough.",
              },
              {
                t: "We come back with numbers",
                d: "What it should realistically achieve on long-term rent and on short stay, net of costs, with our fee shown against each. If one is clearly better for you, we say which.",
              },
              {
                t: "You decide, in writing",
                d: "If it makes sense we send the management agreement with the fee and the commitments above written into it. If it does not, we tell you that instead, and there is no follow-up campaign.",
              },
            ].map((s, i) => (
              <li key={s.t} className="flex gap-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-500 font-medium">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-medium">{s.t}</h3>
                  <p className="mt-1 text-charcoal/70">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="container-gs max-w-3xl">
          <h2 className="text-center font-serif text-display-sm">
            Questions we get asked first
          </h2>
          <dl className="mt-10 space-y-8">
            {FAQS.map((f) => (
              <div key={f.q}>
                <dt className="font-medium">{f.q}</dt>
                <dd className="mt-2 text-charcoal/70">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section bg-charcoal text-cream-50" id="cta">
        <div className="container-gs max-w-2xl text-center">
          <ShieldCheck className="mx-auto h-8 w-8 text-gold-500" aria-hidden />
          <h2 className="mt-6 font-serif text-display-sm">
            Tell us about the property
          </h2>
          <p className="mt-4 text-cream-50/70">
            If we are not the right firm for it, we will say so and point you at
            what is. That happens more often than you would expect from a
            company running an advert.
          </p>
          <div className="mt-8">
            <a
              href={waHref("footer")}
              className="btn-primary inline-flex items-center gap-2"
              data-wa-source="ads-landing-footer"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              Message us on WhatsApp
            </a>
          </div>
          <p className="mt-6 text-sm text-cream-50/60">
            We use your message only to reply about your property. See our{" "}
            <Link
              href="/privacy"
              className="underline decoration-gold-500 underline-offset-4"
            >
              privacy policy
            </Link>
            . Published fees are on the{" "}
            <Link
              href="/pricing"
              className="underline decoration-gold-500 underline-offset-4"
            >
              pricing page
            </Link>
            .
          </p>
          {/* The most important placement of the three. This is the
              page a Google Ads reviewer lands on, and the campaign
              bids on Airbnb-branded queries. */}
          <AirbnbDisclosure className="mx-auto mt-4 max-w-md text-cream-50/50" />
        </div>
      </section>
    </>
  );
}
