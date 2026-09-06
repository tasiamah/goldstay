import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  Search,
  IdCard,
  FileSignature,
  ClipboardList,
  Handshake,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { CTABanner } from "@/components/CTABanner";
import { FAQSection } from "@/components/FAQSection";
import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  ServiceJsonLd,
} from "@/components/JsonLd";
import { waLink, alternateLanguagesFor, site } from "@/lib/site";
import { getServerCity } from "@/lib/getServerCity";

// Tenant finding service page.
//
// Like long-term management, this existed in the services array with a
// price and a feature list and had no URL. It is the one service aimed
// at landlords who are in the country and intend to self-manage, which
// is a different searcher from the diaspora landlord the rest of the
// site addresses, and it deserves its own page rather than a homepage
// anchor.

export function generateMetadata(): Metadata {
  const city = getServerCity();
  const cityPhrase =
    city === "nairobi"
      ? "Nairobi"
      : city === "accra"
        ? "Accra"
        : "Nairobi and Accra";

  const title =
    city === "nairobi"
      ? "Tenant Finding in Nairobi, Kenya"
      : city === "accra"
        ? "Tenant Finding in Accra, Ghana"
        : "Tenant Finding in Nairobi & Accra";

  return {
    title,
    description: `Tenant finding and vetting in ${cityPhrase} for landlords who manage their own property. Marketing, viewings, background and income checks, lease drafting and handover. One-time fee of one month's rent.`,
    alternates: {
      canonical: "/tenant-finding",
      languages: alternateLanguagesFor("/tenant-finding"),
    },
    openGraph: { title, type: "website" },
  };
}

const steps = [
  {
    icon: Search,
    title: "We market the unit",
    body: "Photographs, a written listing and distribution to our tenant waitlist, the portals and the corporate and NGO relocation contacts who come to us directly.",
  },
  {
    icon: Handshake,
    title: "We run the viewings",
    body: "You do not meet strangers at your gate or field calls at midnight. We shortlist, accompany every viewing and report back on who is serious.",
  },
  {
    icon: IdCard,
    title: "We vet properly",
    body: "ID, employer confirmation, income verification, two references and a face-to-face interview. Roughly half of applicants do not survive this, which is the point of it.",
  },
  {
    icon: FileSignature,
    title: "We draft the lease",
    body: "A lease prepared by our property lawyers in your name, with deposit, escalation, notice and repair obligations written properly. You sign it, not us.",
  },
  {
    icon: ClipboardList,
    title: "We hand over",
    body: "A photographed move-in inventory, meter readings, keys and utility transfers, so the deposit conversation at the end is settled by evidence.",
  },
];

export default function Page() {
  const city = getServerCity();
  const cityName =
    city === "nairobi" ? "Nairobi" : city === "accra" ? "Accra" : null;
  const cityPhrase = cityName ?? "Nairobi & Accra";

  const baseUrl =
    city === "nairobi"
      ? `https://${site.domains.nairobi}`
      : city === "accra"
        ? `https://${site.domains.accra}`
        : `https://${site.domain}`;
  const areaServed = cityName ? [cityName] : ["Nairobi", "Accra"];

  const faqs = [
    {
      q: `What does tenant finding cost in ${cityPhrase}?`,
      a: "A one-time fee of one month's rent, payable when the lease is signed and the tenant has moved in. Nothing is due if we do not place a tenant, and there is no monthly charge afterwards because we are not managing the property.",
    },
    {
      q: "How is this different from full management?",
      a: "Tenant finding ends at handover. You collect the rent, deal with repairs, handle the tax and manage the relationship. Full long-term management is 10% of collected rent and we do all of that for you, month after month.",
    },
    {
      q: "How long does it take to find a tenant?",
      a: "Typically two to six weeks for a well-presented unit priced to the market, and longer if it is priced above it. We will tell you honestly at the outset if the asking rent is going to be the reason it sits empty.",
    },
    {
      q: "What does the vetting actually involve?",
      a: "Identity documents, written confirmation from the employer, evidence of income, two references we genuinely call, and an interview in person. We share the file with you and you make the final decision, not us.",
    },
    {
      q: "What if the tenant leaves or stops paying soon after moving in?",
      a: "If a tenant we placed vacates or is removed for cause within six months, we find you a replacement at no further fee. That guarantee is why the vetting is as heavy as it is.",
    },
    {
      q: "Can I switch to full management later?",
      a: "Yes, and it is common. Landlords often self-manage until the first genuinely inconvenient thing happens, then move onto long-term management. There is no re-onboarding fee if you switch.",
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: baseUrl },
          { name: "Tenant Finding", url: `${baseUrl}/tenant-finding` },
        ]}
      />
      <ServiceJsonLd
        name="Tenant Finding"
        description={`Tenant sourcing and vetting in ${areaServed.join(" and ")} for self-managing landlords: marketing, accompanied viewings, background, employment and income checks, lease drafting and photographed handover.`}
        url={`${baseUrl}/tenant-finding`}
        serviceType="Tenant placement and referencing"
        areaServed={areaServed}
        priceDescription="One-time fee of one month's rent"
      />
      <FaqJsonLd items={faqs} />

      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
        <Image
          src="/images/locations/nairobi.jpg"
          alt={`Apartment buildings in ${cityPhrase} where Goldstay places vetted tenants`}
          fill
          priority
          sizes="100vw"
          quality={80}
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/80 via-charcoal/75 to-charcoal/95" />
        <div className="container-gs pb-20 md:pb-32">
          <Reveal>
            <div className="max-w-3xl">
              <div className="eyebrow text-gold-400">
                Tenant finding · One-time fee
              </div>
              <h1 className="mt-6 font-serif text-display-lg text-cream balance">
                Tenant finding in <em className="italic">{cityPhrase}</em>, for
                landlords who manage their own property.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-cream/80 pretty md:text-xl">
                We market the unit, run the viewings, vet the applicants
                properly and draft the lease. Then we hand you the keys and step
                away. One month&rsquo;s rent, once, payable only when a tenant
                actually moves in.
              </p>
              <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <a
                  href={waLink(
                    "Hi Goldstay, I'd like help finding a tenant for my property",
                    city ?? undefined,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Talk to us on WhatsApp
                </a>
                <Link href="/list-your-property" className="btn-ghost-light">
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
            eyebrow="How it runs"
            title="Five steps, then we are out of your way."
            lede="The work that decides whether a tenancy is easy or exhausting all happens before anyone moves in."
          />
          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.05}>
                <div className="card h-full">
                  <s.icon className="h-6 w-6 text-gold-600" />
                  <h3 className="mt-6 font-serif text-2xl">{s.title}</h3>
                  <p className="mt-3 text-sm text-charcoal/70">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white/50">
        <div className="container-gs max-w-4xl">
          <SectionHeader
            eyebrow="Why the vetting is heavy"
            title="A bad tenant costs more than a vacant month."
          />
          <Reveal>
            <p className="mt-10 text-lg leading-relaxed text-charcoal/85 pretty">
              Most landlord losses we are asked to clean up did not start with a
              repair or a market downturn. They started with someone being
              accepted because they were pleasant, available and willing to pay
              a deposit in cash. Rent arrears, a damaged unit and a months-long
              removal process all trace back to a decision made in an afternoon.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <ul className="mt-8 space-y-3 text-base">
              {[
                "Roughly half of applicants do not clear our checks",
                "References are called, not collected",
                "Income is evidenced against the rent, not assumed",
                "You see the full file and make the final call",
                "Replacement at no further fee if a placed tenant leaves for cause within six months",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-700">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-charcoal/80">{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-gs max-w-4xl">
          <SectionHeader
            eyebrow="Is this the right service"
            title="Tenant finding suits some landlords and not others."
          />
          <Reveal>
            <p className="mt-10 text-lg leading-relaxed text-charcoal/85 pretty">
              It works well if you are in the country, have time, and are
              comfortable handling repairs, rent chasing and the tax return
              yourself. It works badly if you are abroad, because the parts we
              are handing back to you are precisely the parts that are hard to
              do from another time zone.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-6 text-lg leading-relaxed text-charcoal/85 pretty">
              If you are overseas, look at{" "}
              <Link
                href="/long-term-management"
                className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
              >
                long-term management
              </Link>{" "}
              instead, where the 10% covers collection, maintenance, compliance
              and the monthly USD payout. If the unit would earn more on nightly
              bookings, compare it against{" "}
              <Link
                href="/airbnb-management"
                className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
              >
                Airbnb and short-stay management
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <FAQSection
        items={faqs}
        eyebrow="Tenant finding FAQ"
        title="What landlords ask before instructing us."
      />
      <CTABanner
        headline="Need a tenant you will not regret?"
        subheadline="Tell us the unit, the area and the rent you have in mind. We will tell you what it will realistically let for."
        city={city ?? undefined}
      />
    </>
  );
}
