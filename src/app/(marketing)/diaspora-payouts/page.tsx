import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Check,
  Clock,
  Globe2,
  Lock,
  Receipt,
  ShieldCheck,
  Smartphone,
  Wallet,
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
import { alternateLanguagesFor, site, waLink } from "@/lib/site";
import { getServerCity } from "@/lib/getServerCity";

// /diaspora-payouts — high-leverage SEO landing page for the
// "how do I receive rent from Kenya in USD" / "USD payouts from
// Kenyan rent" / "Wise vs SWIFT for Kenyan rental income" cluster
// of queries. Long-form because the SERP for these intents is
// dominated by 2,000-word how-to articles, not service pages —
// we need both the service pitch AND substantive how-it-works
// copy on the same URL to compete.
//
// Country-aware: the .co.ke surface frames the playbook around
// KES → USD; .com.gh swaps in GHS → USD. The neutral .com lists
// both. The matching long-form insights post lives at
// /insights/how-diaspora-landlords-get-paid-usd-from-kenyan-rent
// and is linked back to as the deeper read.

export function generateMetadata(): Metadata {
  const city = getServerCity();
  const cityPhrase =
    city === "nairobi"
      ? "Kenya"
      : city === "accra"
        ? "Ghana"
        : "Kenya & Ghana";

  return {
    // Title is built around the actual head query ("receive rent in
    // USD") rather than a brand line, so SERP truncation still
    // surfaces the intent match in the first 60 characters.
    title:
      city === "accra"
        ? "Receive Rent from Ghana in USD: Diaspora Payouts"
        : "Receive Rent from Kenya in USD: Diaspora Payouts",
    description: `How diaspora landlords receive their rental income from ${cityPhrase} in USD. Wise, SWIFT and M-Pesa rails compared, FX spreads explained, monthly statements and verified payout accounts.`,
    alternates: {
      canonical: "/diaspora-payouts",
      languages: alternateLanguagesFor("/diaspora-payouts"),
    },
  };
}

const PAYOUT_FAQS = [
  {
    q: "How do I receive rent from Kenya in USD?",
    a: "Goldstay collects rent in KES from your tenant or guest, deducts agreed expenses, and remits the net to your overseas account in USD (or GBP / EUR / AED) every month. The conversion uses the live Wise mid-market rate, not a marked-up retail spread, and the funds typically land within 1-2 working days of the statement being issued.",
  },
  {
    q: "What payout rail is cheapest: Wise, SWIFT or local bank?",
    a: "For diaspora landlords, Wise is almost always the cheapest. A KES → USD Wise transfer typically costs 0.5-0.9% all-in, lands in 1-2 working days, and uses the mid-market FX rate. A SWIFT wire from a Kenyan bank usually costs USD 25-50 in fees plus a 2-4% retail FX spread that hides on the deal ticket. We support both, plus M-Pesa for landlords who hold a Kenyan account.",
  },
  {
    q: "When does the money actually land?",
    a: "Goldstay's payout run is the 5th of each month. We issue the statement, debit our trust account, and push the wire / Wise transfer the same day. Wise lands within 1-2 working days, SWIFT within 3-5 working days. We email you when each step happens so you're never guessing where the money is.",
  },
  {
    q: "What FX rate do you use?",
    a: "The Wise mid-market rate at the moment of conversion. The rate plus the exact fee (in KES and USD) is shown line-by-line on every monthly statement. We never quote a 'house rate' or bake an FX margin into the management fee.",
  },
  {
    q: "Do I need a US dollar account?",
    a: "No. We pay into whatever account currency you nominate. USD, GBP, EUR, AED, CAD or AUD are the most common. The conversion happens before the wire so the receiving bank sees a clean foreign-currency credit and doesn't charge you a second FX margin on the way in.",
  },
  {
    q: "Is it legal to send rental income out of Kenya?",
    a: "Yes. Kenya runs no exchange controls on personal rental income for non-residents. The Central Bank of Kenya requires the originating institution (Goldstay's bank or Wise) to file a normal outbound-transfer report, which they do automatically. The receiving country may treat the income as foreign-source for your own tax return; speak to a local accountant about double-taxation relief.",
  },
  {
    q: "What about the 7.5% Monthly Rental Income tax (MRI)?",
    a: "MRI is a Kenya-side withholding on gross rent, paid to KRA before any payout to you. We file and pay it automatically every month and the receipt is attached to your statement. Diaspora landlords don't need to register with KRA themselves. Goldstay holds the MRI agency status. Read more: 'Kenya MRI tax for diaspora landlords' in our Insights.",
  },
  {
    q: "How do you verify my payout account before the first wire?",
    a: "Once in the owner portal, you upload two documents: proof of payout-account ownership (a bank letter, voided cheque, M-Pesa till statement or Wise screenshot showing your name) and a proof of ID (passport or national ID). Both go to encrypted storage and are reviewed by the verification team within one working day. Until the account is verified, no outbound transfer can be initiated against it. That's a hard server-side rule, not a process suggestion.",
  },
  {
    q: "Does Ghana work the same way?",
    a: "Yes. The mechanics are identical: GHS → USD via Wise, monthly statements on the same template, the same MRI-equivalent (Ghana's 8% withholding on rental income) handled before payout. The only practical difference is that local-bank SWIFT out of Ghana is slower than Kenya, so we steer Accra landlords toward Wise even more strongly.",
  },
  {
    q: "What happens if my bank rejects the wire?",
    a: "Goldstay's bank notifies us within 24 hours of any return. We email you immediately, hold the funds in the trust account (no rollover into the next month's statement), and re-send to a corrected account on your nod. A returned wire never disappears into a clearing limbo. We account for every shilling.",
  },
];

const PILLARS = [
  {
    icon: Globe2,
    title: "FX you can read",
    body: "Mid-market rate, Wise's actual fee in KES and USD, and the exact converted amount, printed line-by-line on every statement. No hidden 'house rate'.",
  },
  {
    icon: Clock,
    title: "Monthly cadence",
    body: "Statement issued the 5th, wire pushed the same day, money in your account within 1-2 working days for Wise or 3-5 for SWIFT.",
  },
  {
    icon: ShieldCheck,
    title: "Verified accounts only",
    body: "We refuse to send a payout to an account we haven't verified against an ownership document. Removes the entire 'wrong-IBAN' failure mode.",
  },
  {
    icon: Receipt,
    title: "MRI handled for you",
    body: "Kenya's 7.5% Monthly Rental Income tax is filed and paid before you see the net. KRA receipts are attached to every statement.",
  },
  {
    icon: Lock,
    title: "Trust-account ringfence",
    body: "Tenant rent never touches Goldstay's operating bank. It sits in a regulated trust account until your statement signs off, then moves straight to you.",
  },
  {
    icon: Banknote,
    title: "Six payout currencies",
    body: "USD, GBP, EUR, AED, CAD or AUD. Pick whatever your home account is denominated in. We convert once, you receive a clean foreign-currency credit.",
  },
];

const RAILS = [
  {
    icon: Wallet,
    title: "Wise (recommended)",
    cost: "0.5-0.9% all-in",
    speed: "1-2 working days",
    fx: "Mid-market",
    best: "Diaspora landlords with a Wise multi-currency account, or any landlord who values FX transparency over end-to-end bank statements.",
    pill: "Cheapest",
  },
  {
    icon: Globe2,
    title: "SWIFT bank wire",
    cost: "USD 25-50 + 2-4% FX spread",
    speed: "3-5 working days",
    fx: "Bank retail",
    best: "Landlords whose home bank doesn't accept Wise, or who need a SWIFT/MT103 reference for accounting / mortgage-affordability evidence.",
    pill: "Bank-friendly",
  },
  {
    icon: Smartphone,
    title: "M-Pesa",
    cost: "KES 0-110 fixed",
    speed: "Instant",
    fx: "N/A (KES)",
    best: "Landlords who keep a Kenyan M-Pesa wallet, typically for living expenses on visits home, not as a primary payout channel.",
    pill: "Local only",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Tenant pays rent in KES",
    body: "Long-term tenants pay by bank standing order, M-Pesa or paybill into the Goldstay collection account on the 1st of the month. Short-stay guests pay by card at booking, processed via Airbnb / Booking.com / direct.",
  },
  {
    n: "02",
    title: "Statement issued on the 5th",
    body: "We close the previous month, deduct the agreed expenses (cleaning, MRI, repairs with photo evidence), and email you a one-page PDF showing every line and the resulting net.",
  },
  {
    n: "03",
    title: "FX conversion at mid-market",
    body: "The net KES is converted to your nominated currency using the Wise mid-market rate at the moment of conversion. The rate, the fee and the converted figure are all printed on the statement.",
  },
  {
    n: "04",
    title: "Money lands in your account",
    body: "Wise transfers typically land within 1-2 working days; SWIFT within 3-5. You get an email at each step (statement issued, transfer initiated, transfer landed) so you're never guessing where the money is.",
  },
];

export default function Page() {
  const city = getServerCity();
  const isAccra = city === "accra";
  const isNairobi = city === "nairobi";

  const baseUrl = isNairobi
    ? `https://${site.domains.nairobi}`
    : isAccra
      ? `https://${site.domains.accra}`
      : `https://${site.domain}`;

  const areaServed = isNairobi
    ? ["Nairobi"]
    : isAccra
      ? ["Accra"]
      : ["Nairobi", "Accra"];

  // Hero copy keys off the search intent on the localised domain so
  // the H1 can match the actual query verbatim. The neutral .com
  // hedges with both currencies.
  const sourceCcy = isAccra ? "GHS" : "KES";
  const sourceCountry = isAccra ? "Ghana" : "Kenya";
  const headline = isAccra
    ? "Receive your Ghanaian rent in USD, every month."
    : isNairobi
      ? "Receive your Kenyan rent in USD, every month."
      : "Receive your Kenyan or Ghanaian rent in USD, every month.";

  const lede = `${sourceCountry} rent collected in ${sourceCcy}. Net of expenses and ${
    isAccra ? "Ghana's 8% rental withholding" : "Kenya's 7.5% MRI tax"
  }. Converted at the Wise mid-market rate and wired to your account in USD, GBP, EUR, AED, CAD or AUD. One statement a month, line-by-line, no hidden FX margin.`;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: baseUrl },
          { name: "Diaspora Payouts", url: `${baseUrl}/diaspora-payouts` },
        ]}
      />
      <ServiceJsonLd
        name="Diaspora Rental Payouts"
        description={`Monthly USD remittance of rental income from ${areaServed.join(
          " and ",
        )} to diaspora landlords' overseas accounts. Mid-market FX, verified payout accounts, MRI / withholding handled, statements line-by-line.`}
        url={`${baseUrl}/diaspora-payouts`}
        serviceType="Cross-border rental remittance"
        areaServed={areaServed}
        priceDescription="Included in the standard 8% / 20% management fee"
      />
      <FaqJsonLd items={PAYOUT_FAQS} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
        <Image
          src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=2400&q=80"
          alt={`USD bank wire. Goldstay diaspora payouts for landlords with rental income in ${sourceCountry}`}
          fill
          priority
          sizes="100vw"
          quality={80}
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/85 via-charcoal/75 to-charcoal/95" />
        <div className="container-gs pb-20 md:pb-32">
          <Reveal>
            <div className="max-w-3xl">
              <div className="eyebrow text-gold-400">Diaspora payouts</div>
              <h1 className="mt-6 font-serif text-display-lg text-cream balance">
                {headline}
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-cream/80 pretty md:text-xl">
                {lede}
              </p>
              <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <a
                  href={waLink(
                    `Hi Goldstay, I'd like to receive my ${sourceCountry} rental income in USD`,
                    city ?? undefined,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Set up a USD payout
                </a>
                <Link href="/list-your-property" className="btn-ghost-light">
                  Or use the form →
                </Link>
              </div>
              <p className="mt-6 max-w-2xl text-sm text-cream/60">
                Already a landlord with us?{" "}
                <Link
                  href="/owner/payouts"
                  className="underline-offset-2 hover:text-cream hover:underline"
                >
                  Add or verify a payout method in the portal →
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* The default that costs you 4-6% — the SEO heart of the page,
          mirrors the framing of the long-form insights post. */}
      <section className="section">
        <div className="container-gs grid gap-12 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <div>
              <div className="eyebrow">Why this page exists</div>
              <h2 className="mt-4 font-serif text-display-md balance">
                The default flow costs diaspora landlords 4 to 6% a year.
              </h2>
              <p className="mt-5 text-charcoal/75">
                Most diaspora landlords lose more money to FX and bank
                friction than they do to bad tenants. The losses are
                invisible because they show up as exchange rates rather
                than line items, but they compound brutally. A 2% retail
                FX spread on a year of Nairobi rent costs you more than
                the gap between an 8% and a 10% management fee.
              </p>
              <p className="mt-4 text-charcoal/75">
                The default an agent will put you on, often without ever
                having the conversation, is: rent collects in {sourceCcy}{" "}
                into a local bank account. Once a quarter, somebody
                walks in and converts it at the bank&apos;s retail
                window. The bank takes a 2-4% spread plus a fixed wire
                fee. The diaspora landlord sees a USD figure and assumes
                that&apos;s what the rent was worth.
              </p>
              <p className="mt-4 text-charcoal/75">
                It isn&apos;t. It&apos;s what the rent was worth minus
                the FX margin minus the wire fee minus the cost of the
                90-day delay. We built the Goldstay payout flow
                specifically to remove all four of those leaks.
              </p>
              <p className="mt-6">
                <Link
                  href="/insights/how-diaspora-landlords-get-paid-usd-from-kenyan-rent"
                  className="inline-flex items-center gap-2 font-medium text-charcoal underline-offset-4 hover:underline"
                >
                  Read the deep dive: how the money actually moves{" "}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-charcoal/10 bg-charcoal p-6 text-cream sm:p-8 md:p-10">
              <div className="eyebrow text-gold-400">
                The leak, sized
              </div>
              <h3 className="mt-4 font-serif text-2xl sm:text-3xl">
                Annual cost of the &quot;default&quot; payout flow
              </h3>
              <p className="mt-3 text-sm text-cream/70">
                Two-bed apartment in Westlands at KES 120,000 / month.
                One year of rent, four payouts.
              </p>
              <ul className="mt-8 divide-y divide-cream/10 text-sm">
                {[
                  ["Gross annual rent", "KES 1,440,000 (~USD 11,160)"],
                  ["Bank retail FX spread (3%)", "USD 335 lost"],
                  ["4× SWIFT wire fees ($35)", "USD 140 lost"],
                  ["90-day cash drag (vs monthly)", "USD ~85 lost"],
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
                  <span className="text-cream">Annual leak</span>
                  <span className="text-right font-serif text-xl text-gold-400 sm:text-2xl">
                    USD ~560
                  </span>
                </li>
              </ul>
              <p className="mt-6 text-xs text-cream/50">
                Equivalent to 5% of gross rent. Goldstay&apos;s payout
                flow recovers most of this.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pillars */}
      <section className="section bg-white/50">
        <div className="container-gs">
          <SectionHeader
            eyebrow="What you actually get"
            title="Six things every diaspora payout flow should do, and that most don't."
            lede="None of these are exotic. They're hygiene. Goldstay treats them as the floor, not the ceiling."
          />
          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p, i) => (
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

      {/* Step-by-step */}
      <section className="section">
        <div className="container-gs">
          <SectionHeader
            eyebrow="How it runs"
            title={`From ${sourceCcy} on the 1st to USD in your account by the 7th.`}
            lede="The same four steps run every month, in the same order, on the same dates. Predictable cadence is half the value of a payout flow."
          />
          <ol className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.05}>
                <li className="card h-full list-none">
                  <span className="font-mono text-xs uppercase tracking-widest text-gold-700">
                    {s.n}
                  </span>
                  <h3 className="mt-3 font-serif text-2xl">{s.title}</h3>
                  <p className="mt-3 text-sm text-charcoal/70">{s.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Rail comparison */}
      <section className="section bg-white/50">
        <div className="container-gs">
          <SectionHeader
            eyebrow="Pick your rail"
            title="Wise, SWIFT or M-Pesa: the honest comparison."
            lede="We support all three because diaspora landlords don't all bank in the same place. The default is Wise; the override is yours."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {RAILS.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.05}>
                <div className="card h-full">
                  <div className="flex items-start justify-between gap-3">
                    <r.icon className="h-6 w-6 text-gold-600" />
                    <span className="inline-flex items-center rounded-full bg-gold-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-700">
                      {r.pill}
                    </span>
                  </div>
                  <h3 className="mt-6 font-serif text-2xl">{r.title}</h3>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <dt className="text-charcoal/60">Cost</dt>
                      <dd className="text-right text-charcoal/90">{r.cost}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <dt className="text-charcoal/60">Speed</dt>
                      <dd className="text-right text-charcoal/90">{r.speed}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <dt className="text-charcoal/60">FX rate</dt>
                      <dd className="text-right text-charcoal/90">{r.fx}</dd>
                    </div>
                  </dl>
                  <p className="mt-5 text-sm text-charcoal/70">
                    <span className="font-medium text-charcoal/90">
                      Best for:{" "}
                    </span>
                    {r.best}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trust + verification */}
      <section className="section">
        <div className="container-gs grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <div className="eyebrow">Verification</div>
              <h2 className="mt-4 font-serif text-display-md balance">
                We refuse to wire money to an account we haven&apos;t verified.
              </h2>
              <p className="mt-5 text-charcoal/75">
                Wrong-IBAN payouts are the most expensive operational
                mistake in diaspora property management. Once funds land
                in the wrong account, recovery is a 30 to 90 day
                ordeal. Goldstay closes the failure mode at source: the
                payout-account row is locked behind a verifiedAt flag,
                and our server-side rule refuses to record an outbound
                Transaction.PAYOUT against an unverified row. No human
                override.
              </p>
              <ul className="mt-8 space-y-3 text-sm">
                {[
                  "Upload proof of payout-account ownership in the portal",
                  "Upload a proof of ID (passport or national ID)",
                  "Verification team signs off within one working day",
                  "Server-side rule then unlocks payouts for that row",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-700">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="text-charcoal/80">{t}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8">
                <Link
                  href="/owner/payouts"
                  className="inline-flex items-center gap-2 font-medium text-charcoal underline-offset-4 hover:underline"
                >
                  Open the portal and verify a payout method{" "}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-charcoal/10 bg-stone-50 p-6 sm:p-8 md:p-10">
              <div className="eyebrow">Sample statement</div>
              <h3 className="mt-4 font-serif text-2xl sm:text-3xl">
                What lands in your inbox the 5th of every month
              </h3>
              <ul className="mt-8 divide-y divide-charcoal/10 text-sm">
                {[
                  [`Gross rent (1 month, ${sourceCcy})`, "120,000"],
                  [
                    isAccra
                      ? "Withholding tax (8%)"
                      : "MRI withholding (7.5%)",
                    isAccra ? "− 9,600" : "− 9,000",
                  ],
                  ["Goldstay management fee (8%)", "− 9,600"],
                  ["Repairs (with photos attached)", "− 4,500"],
                  [`Net to landlord (${sourceCcy})`, "96,900"],
                  [
                    "Wise FX (mid-market, 0.6% fee)",
                    isAccra ? "@ 13.4 GHS / USD" : "@ 129.5 KES / USD",
                  ],
                ].map(([k, v]) => (
                  <li
                    key={k}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <span className="text-charcoal/60">{k}</span>
                    <span className="text-right tabular-nums text-charcoal/90">
                      {v}
                    </span>
                  </li>
                ))}
                <li className="flex items-center justify-between gap-4 py-4">
                  <span className="font-medium text-charcoal">
                    Wired to your USD account
                  </span>
                  <span className="text-right font-serif text-xl text-gold-700 sm:text-2xl">
                    {isAccra ? "USD 718" : "USD 744"}
                  </span>
                </li>
              </ul>
              <p className="mt-6 text-xs text-charcoal/55">
                Illustrative figures. Real statements include the KRA
                MRI receipt, repair photos and the Wise transfer
                reference, all attached as a single PDF.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ — payout-specific. We pass an explicit list so the
          FAQPage schema above renders the same questions. */}
      <FAQSection
        items={PAYOUT_FAQS}
        eyebrow="FAQ"
        title="Diaspora payouts: your most common questions."
      />

      <CTABanner
        headline={
          isAccra
            ? "Ready to receive your Accra rent in USD?"
            : "Ready to receive your Nairobi rent in USD?"
        }
        subheadline="Get a specific payout setup walk-through within 24 hours. No commitment until your first statement."
        city={city ?? undefined}
      />
    </>
  );
}
