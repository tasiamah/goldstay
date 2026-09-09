import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  Check,
  FileText,
  ArrowRightLeft,
  DoorOpen,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { CTABanner } from "@/components/CTABanner";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  ServiceJsonLd,
  ReviewJsonLd,
} from "@/components/JsonLd";
import { alternateLanguagesFor, launchedCityPhrase, site, waLink } from "@/lib/site";
import { getServerCity } from "@/lib/getServerCity";

// Changing property manager.
//
// The keyword audit in scripts/keyword-coverage.mjs found the
// "Switching" cluster 100% unclaimed: "agent not paying rent", "agent
// stole my rent", "change property manager", "switch property manager",
// "agent not remitting rent" and four more had no page and no article
// anywhere on the site.
//
// It is the hottest intent in this market and almost nobody writes for
// it. A landlord searching "my agent is not paying me rent" already
// owns a property, already pays a manager, and has already decided the
// arrangement is failing. They are not researching. They are looking
// for a replacement today.
//
// The reason the competition leaves it alone is that no management
// company wants to publish instructions for firing a management
// company. That squeamishness is the opportunity, and the only honest
// way to take it is to write the page a landlord actually needs,
// including the part that applies to leaving us. Hence the closing
// section: 30 days, no exit fee, full handover pack. A page that tells
// you how to fire your current agent but goes quiet about the exit
// terms of the agent writing it persuades nobody.
//
// Deliberately not a legal guide. Notice periods, deposits and agency
// obligations turn on the agreement that was signed and on facts we
// cannot see, so this points the reader at their own contract rather
// than asserting Kenyan law. Everything stated about Goldstay is
// already published in GuaranteesSection or on a service page.

export function generateMetadata(): Metadata {
  const city = getServerCity();
  const cityPhrase =
    city === "nairobi"
      ? "Nairobi"
      : city === "accra"
        ? "Accra"
        : launchedCityPhrase();

  const title =
    city === "accra"
      ? "Change Your Property Manager in Accra"
      : "Change Your Property Manager in Nairobi";

  return {
    title,
    description: `How to change property manager in ${cityPhrase}: the signs your agent is failing you, what to collect before you give notice, and how a handover actually works. No setup fee to move to Goldstay.`,
    alternates: {
      canonical: "/change-property-manager",
      languages: alternateLanguagesFor("/change-property-manager"),
    },
    openGraph: { title, type: "website" },
  };
}

// Described as patterns rather than accusations. Each one is a thing
// landlords have actually brought us, and each is observable from a
// bank statement rather than a feeling.
const signs = [
  {
    title: "The rent arrives late, short, or only after you ask",
    body: "A managed tenancy should credit you on a date you can predict without chasing. If the amount varies without an explanation attached, or the transfer only follows a reminder, the money is being used as working capital somewhere between the tenant and you.",
  },
  {
    title: "There is no monthly statement",
    body: "Not a WhatsApp message with a figure in it. An itemised statement showing rent received, deductions with reasons, tax withheld and the balance remitted. If you cannot reconstruct the month from what you were sent, you are not being reported to.",
  },
  {
    title: "Deductions appear without receipts",
    body: "Maintenance is a legitimate cost and a convenient one to inflate. A repair with no invoice, no photograph and no vendor name is a number somebody chose. Ask for the receipts for the last three months and see what comes back.",
  },
  {
    title: "You do not know who is in your property",
    body: "You should be able to name the tenant, see the signed lease, know the rent and the deposit held, and know when the term ends. Landlords are often surprised on at least one of those four.",
  },
  {
    title: "Nobody answers until you threaten to leave",
    body: "Responsiveness that depends on escalation is not responsiveness. It also tells you where your property sits on their list, which matters on the day something floods.",
  },
];

// Practical, in the order a landlord should actually do it. Notice
// comes fourth on purpose: giving it first is what leaves people
// without documents and without a tenant contact.
const steps = [
  {
    icon: FileText,
    title: "Read your agreement before you say anything",
    body: "Find the notice period, whether any fee is payable on exit, who holds the deposit and what the agent is obliged to hand back. This determines the order of everything below, and it is much harder to obtain a copy once you have announced you are leaving.",
  },
  {
    icon: AlertTriangle,
    title: "Ask for the file while the relationship is still normal",
    body: "The signed lease, the tenant's contact details, the deposit amount and where it is held, meter readings, the move-in inventory, the last twelve months of statements and any KRA remittance references. Request it as a routine review, not as a prelude to notice.",
  },
  {
    icon: Check,
    title: "Reconcile one month properly",
    body: "Take a single month and account for every shilling: rent due, rent received, each deduction against a receipt, tax withheld, amount remitted. One month is usually enough to tell an administrative mess from something worse, and it is the evidence you will need if there is a dispute.",
  },
  {
    icon: ArrowRightLeft,
    title: "Give notice in writing, then tell the tenant",
    body: "In writing, dated, on the terms your agreement sets out, and keep proof of delivery. Then write to the tenant yourself confirming who now collects the rent and where it goes, because a tenant who is not told will keep paying the person they have always paid.",
  },
];

export default function Page() {
  const city = getServerCity();
  const cityName =
    city === "nairobi" ? "Nairobi" : city === "accra" ? "Accra" : null;
  const cityPhrase = cityName ?? launchedCityPhrase();

  const baseUrl =
    city === "nairobi"
      ? `https://${site.domains.nairobi}`
      : city === "accra"
        ? `https://${site.domains.accra}`
        : `https://${site.domain}`;
  const areaServed = cityName ? [cityName] : ["Nairobi", "Accra"];

  const faqs = [
    {
      q: "My agent is not paying me rent. What do I do?",
      a: "Before you give notice, ask for the signed lease, the tenant's contact details, the deposit amount and the last twelve months of statements, and reconcile one month line by line. Do it as a routine review rather than as a warning, because documents become much harder to obtain once an agent knows you are leaving. Then give notice in writing on the terms your agreement sets, and write to the tenant yourself confirming where the rent now goes.",
    },
    {
      q: `How do I change property manager in ${cityName ?? "Kenya"}?`,
      a: "Read your management agreement for the notice period and any exit fee, collect the property file while the relationship is still normal, reconcile a month to establish where you stand, then serve written notice and redirect the tenant. The order matters: giving notice first is what leaves landlords without documents and without a direct line to their own tenant.",
    },
    {
      q: "Can I switch property manager while a tenant is in place?",
      a: "Yes, and most switches happen exactly that way. The tenancy is between you and the tenant, so changing who administers it does not end the lease. What has to move is the paperwork, the deposit and the tenant's payment instruction, which is the part we handle for you.",
    },
    {
      q: "What if my agent is not remitting rent at all?",
      a: "Establish whether the tenant is actually paying before you accuse anyone: contact the tenant directly and ask what they have paid and when. If the tenant is paying and you are not receiving it, you have a specific sum owed on specific dates, which is a much stronger position than a general complaint. Put the demand in writing with a deadline, keep every message, and take advice before the amount grows.",
    },
    {
      q: "Is this fraud, or just bad administration?",
      a: "Honestly, it is usually the second, and the distinction matters for what you do next. Late statements, missing receipts and sloppy reconciliation are the signature of a business that is disorganised and over-extended. Rent collected from a tenant and never passed on, especially once asked, is a different thing. The test is whether the money can be accounted for when you ask for it in writing, which is why reconciling one month properly comes before giving notice.",
    },
    {
      q: "How do I remove a property manager who will not cooperate?",
      a: "Serve the notice your agreement requires in writing regardless of whether they engage, keep proof of delivery, and write to the tenant yourself with the new payment instruction. An uncooperative agent cannot prevent the change, because the tenancy and the property are yours and the tenant can be told directly where to pay. What they can do is withhold the file and the deposit, which is why you collect the documents first.",
    },
    {
      q: "What does it cost to move to Goldstay?",
      a: "Nothing to onboard. There is no setup or onboarding fee for any service, so the first money we take is our percentage of the first rent we collect. Our fee is 10% of collected rent for long-term management and 20% of revenue for short-stay, published in full on our pricing page.",
    },
    {
      q: "Will you deal with my old agent for me?",
      a: "We will chase the file, the deposit and the outstanding statements, and we will write to the tenant with the new payment instruction. What we will not do is represent you in a legal dispute over money already missing. If it has reached that point you want a lawyer, and we will tell you so rather than take the property on and leave the question unresolved.",
    },
    {
      q: "What if my old agent refuses to hand over the deposit?",
      a: "It happens. Reconcile what is owed, put the demand in writing with a deadline, and keep every statement and message. A tenancy deposit is the tenant's money held on their behalf, so the tenant has an interest in its recovery too and is often willing to say so in writing. Beyond that it is a legal matter and worth proper advice.",
    },
    {
      q: "How long does a handover take?",
      a: "Usually one rent cycle. The limiting factor is almost never us, it is how quickly the outgoing agent releases the file and how soon the tenant's next payment date falls.",
    },
    {
      q: "How would I leave Goldstay if it did not work out?",
      a: "Thirty days' notice in writing, and that is the whole of it. No exit fee, no claw-back, no holding the deposit or the tenant relationship hostage, and we hand your next manager a full onboarding pack. We publish that for the same reason this page exists: an exit you can see is the only reason to believe the rest.",
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: baseUrl },
          {
            name: "Change Property Manager",
            url: `${baseUrl}/change-property-manager`,
          },
        ]}
      />
      <ReviewJsonLd />
      <ServiceJsonLd
        name="Property Manager Handover"
        description={`Taking over management of a tenanted property in ${areaServed.join(" and ")} from an outgoing agent: file and deposit recovery, tenant payment redirection, reconciliation and onboarding at no fee.`}
        url={`${baseUrl}/change-property-manager`}
        serviceType="Property management handover"
        areaServed={areaServed}
        priceDescription="No onboarding fee. 10% of collected rent thereafter"
      />
      <FaqJsonLd items={faqs} />

      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
        <Image
          src="/images/locations/nairobi.jpg"
          alt={`Residential buildings in ${cityPhrase} where Goldstay takes over management from outgoing agents`}
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
                Changing manager · No onboarding fee
              </div>
              <h1 className="mt-6 font-serif text-display-lg text-cream balance">
                How to change property manager in{" "}
                <em className="italic">{cityPhrase}</em>.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-cream/80 pretty md:text-xl">
                If the rent is late, the statements have stopped or nobody
                answers until you threaten to leave, the problem is not going to
                resolve itself. Here is what to collect before you give notice,
                in what order, and how a handover actually works.
              </p>
              <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <a
                  href={waLink(
                    "Hi Goldstay, I want to change property manager. Can you take over my property?",
                    city ?? undefined,
                  )}
                  data-wa-source="switch-hero"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Talk to us about taking over
                </a>
                <Link href="/pricing" className="btn-ghost-light">
                  See what we charge →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-gs">
          <SectionHeader
            eyebrow="Is it actually going wrong"
            title="Five signs of a bad property manager, all visible from a bank statement."
            lede="Bad management is easy to rationalise for years, because each individual month looks like an exception. These are the patterns worth checking rather than the feelings."
          />
          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {signs.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.05}>
                <div className="card h-full">
                  <AlertTriangle className="h-6 w-6 text-gold-600" />
                  <h3 className="mt-6 font-serif text-2xl">{s.title}</h3>
                  <p className="mt-3 text-sm text-charcoal/70 pretty">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white/50">
        <div className="container-gs">
          <SectionHeader
            eyebrow="How to leave properly"
            title="Four steps, and the order is the whole point."
            lede="Most landlords who come to us mid-dispute did the right things in the wrong sequence. They gave notice first, and lost access to the paperwork on the same day."
          />
          <div className="mt-16 grid gap-5 md:grid-cols-2">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.05}>
                <div className="card h-full">
                  <s.icon className="h-6 w-6 text-gold-600" />
                  <h3 className="mt-6 font-serif text-2xl">{s.title}</h3>
                  <p className="mt-3 text-sm text-charcoal/70 pretty">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-12 max-w-3xl text-lg leading-relaxed text-charcoal/85 pretty">
              None of the above is legal advice, and it is not meant to be. What
              notice you owe, what happens to the deposit and what your agent is
              obliged to return all turn on the agreement you signed, so read
              that first. If money is already missing rather than merely
              unexplained, the next call is to a lawyer and not to us.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-gs max-w-4xl">
          <SectionHeader
            eyebrow="What we do at handover"
            title="What taking over actually involves."
          />
          <Reveal>
            <ul className="mt-10 space-y-3 text-base">
              {[
                "No onboarding or setup fee, on any service",
                "We chase the outgoing agent for the lease, the deposit, the statements and the KRA references",
                "We write to your tenant with the new payment instruction and confirm receipt",
                "We reconcile the first month against what the old agent reported and show you the difference",
                "New lease documentation in your name where the existing paperwork will not stand up",
                "First statement on the 5th of the following month, with the payout in USD",
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
          <Reveal delay={0.05}>
            <p className="mt-8 text-lg leading-relaxed text-charcoal/85 pretty">
              What the ongoing arrangement looks like is set out on{" "}
              <Link
                href="/long-term-management"
                className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
              >
                long-term management
              </Link>{" "}
              and{" "}
              <Link
                href="/airbnb-management"
                className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
              >
                Airbnb management
              </Link>
              , and the fee for each is on the{" "}
              <Link
                href="/pricing"
                className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
              >
                pricing page
              </Link>
              . If you want to see the reporting before you commit to anything,
              ask us for a sample statement.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-white/50">
        <div className="container-gs max-w-4xl">
          <SectionHeader
            eyebrow="And leaving us"
            title="Thirty days, no exit fee, full handover pack."
          />
          <Reveal>
            <div className="mt-10 flex items-start gap-4">
              <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-700">
                <DoorOpen className="h-4 w-4" />
              </span>
              <p className="text-lg leading-relaxed text-charcoal/85 pretty">
                A page explaining how to fire your property manager is not worth
                much from a property manager who is quiet about their own exit
                terms. Ours are thirty days&rsquo; written notice, no exit fee,
                no claw-back, and a full onboarding pack handed to whoever takes
                over, including the tenant relationship and the deposit. It is
                in the management agreement, not in a sales conversation.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-6 text-lg leading-relaxed text-charcoal/85 pretty">
              We would rather you could leave easily and did not want to. An
              arrangement you stay in because leaving is expensive is the thing
              you are currently trying to get out of.
            </p>
          </Reveal>
        </div>
      </section>

      <FAQSection
        items={faqs}
        eyebrow="Changing manager FAQ"
        title="What landlords ask when they are already halfway out."
      />
      <TestimonialsSection />
      <CTABanner
        headline="Want us to take it over?"
        subheadline="Tell us the property, who manages it now and what has gone wrong. We will tell you honestly whether it is a handover or a legal problem first."
        city={city ?? undefined}
      />
    </>
  );
}
