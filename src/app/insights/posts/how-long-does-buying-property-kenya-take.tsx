import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  H3,
  LI,
  Lede,
  OL,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "how-long-does-buying-property-kenya-take",
  title:
    "How long does it actually take to buy property in Kenya in 2026?",
  description:
    "From the first viewing to holding a registered title in your name, how long does a Kenyan property purchase actually take? Here is the honest 2026 timeline broken down by stage, with the realistic ranges, the things that speed it up, and the things that slow it down.",
  publishedAt: "2025-12-02",
  readingMinutes: 7,
  author: authors.poonam,
  tags: [
    "Kenya",
    "Buying",
    "Timeline",
    "Process",
    "Diaspora",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "How long does buying property in Kenya take 2026 timeline by stage",
};

export default function Article() {
  return (
    <>
      <Lede>
        From the first viewing to holding a registered
        title in your name, how long does a Kenyan
        property purchase actually take? Most buyers
        underestimate the answer because the marketing
        promises a quick close and the reality is a
        sequence of legal, administrative and bank
        steps that each take their own time. Here is
        the honest 2026 timeline.
      </Lede>

      <H2 id="overall">The realistic overall picture</H2>

      <UL>
        <LI>
          <strong>Apartment from a credible developer
          or seller</strong>: 60 to 120 days from
          accepted offer to registered title
        </LI>
        <LI>
          <strong>Apartment with mortgage finance</strong>:
          90 to 150 days
        </LI>
        <LI>
          <strong>Plot of land in urban area</strong>:
          90 to 180 days
        </LI>
        <LI>
          <strong>Plot of agricultural land</strong>:
          120 to 270 days (LCB consent adds time)
        </LI>
        <LI>
          <strong>Standalone home with multiple
          consents</strong>: 120 to 240 days
        </LI>
        <LI>
          <strong>Off-plan property</strong>: 12 to 36
          months from deposit to handover, plus 30 to
          90 days for title transfer
        </LI>
      </UL>

      <H2 id="stages">Stage by stage breakdown</H2>

      <H3 id="search-offer">Property search and offer (1 to 8 weeks)</H3>

      <UL>
        <LI>
          Time to find the right unit varies
          enormously. For a serious buyer with a clear
          brief, 2 to 6 weeks is typical
        </LI>
        <LI>
          Offer letter, counter offer, accepted offer:
          5 to 14 days
        </LI>
      </UL>

      <H3 id="agreement">Sale agreement (2 to 4 weeks)</H3>

      <UL>
        <LI>
          Lawyer reviews title, runs official search
        </LI>
        <LI>
          Sale agreement drafted by buyer&rsquo;s or
          seller&rsquo;s lawyer
        </LI>
        <LI>
          Negotiation of clauses
        </LI>
        <LI>
          Signing and deposit (typically 10 percent)
          into client account
        </LI>
      </UL>

      <H3 id="completion">Completion period (60 to 90 days, varies)</H3>

      <P>
        Built into the sale agreement. Things that
        happen during this window:
      </P>

      <UL>
        <LI>
          Spousal consent if applicable
        </LI>
        <LI>
          Land Control Board consent if applicable
          (adds 4 to 12 weeks for agricultural land)
        </LI>
        <LI>
          Mortgage approval and disbursement (if
          applicable, 4 to 12 weeks)
        </LI>
        <LI>
          Stamp duty assessment and payment
        </LI>
        <LI>
          Final balance paid by buyer
        </LI>
      </UL>

      <H3 id="transfer">Transfer registration (3 to 12 weeks)</H3>

      <UL>
        <LI>
          For Nairobi and counties on Ardhisasa: 3 to
          6 weeks for clean transactions
        </LI>
        <LI>
          For paper-based registries: 6 to 16 weeks
        </LI>
        <LI>
          Registered title issued in buyer&rsquo;s
          name
        </LI>
      </UL>

      <H2 id="speed-up">What speeds the process up</H2>

      <UL>
        <LI>
          Cash purchase (no mortgage adds 4 to 12
          weeks easily)
        </LI>
        <LI>
          Property in a county on Ardhisasa
          (digital flow is faster than paper)
        </LI>
        <LI>
          Clean title from day one (no cautions, no
          succession issues, no missing documents)
        </LI>
        <LI>
          Both parties responsive
        </LI>
        <LI>
          A property lawyer who handles the file
          actively
        </LI>
        <LI>
          Pre-approved mortgage (where applicable)
        </LI>
      </UL>

      <H2 id="slow-down">What slows the process down</H2>

      <UL>
        <LI>
          Title issues (cautions, charges, succession
          gaps)
        </LI>
        <LI>
          Agricultural land requiring LCB consent
        </LI>
        <LI>
          Spousal consent disputes
        </LI>
        <LI>
          Mortgage processing
        </LI>
        <LI>
          Slow lawyers (on either side)
        </LI>
        <LI>
          Counties not yet on Ardhisasa
        </LI>
        <LI>
          Diaspora signatures requiring courier or
          embassy execution
        </LI>
      </UL>

      <H2 id="diaspora">For diaspora buyers specifically</H2>

      <P>
        Add 2 to 6 weeks to the timeline for the
        diaspora signature and execution overhead, or
        use a power of attorney to compress this.
        Detail in our{" "}
        <Link
          href="/insights/power-of-attorney-kenya-property-diaspora"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          power of attorney piece
        </Link>
        .
      </P>

      <H2 id="off-plan">Off-plan timelines specifically</H2>

      <P>
        Off-plan is the longest of all categories
        because the construction phase has to complete
        before title can transfer. Realistic ranges:
      </P>

      <UL>
        <LI>
          Marketing-to-deposit: 1 to 3 months
        </LI>
        <LI>
          Construction: 18 to 30 months for clean
          projects, longer for slipping ones
        </LI>
        <LI>
          Practical completion to handover: 1 to 3
          months
        </LI>
        <LI>
          Handover to registered title: 1 to 6 months
        </LI>
      </UL>

      <P>
        Realistic total: 2 to 4 years from deposit to
        registered title for a credible off-plan
        project. Detail in our{" "}
        <Link
          href="/insights/why-nairobi-off-plan-delivery-dates-slip"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          off-plan delays piece
        </Link>
        .
      </P>

      <Callout title="The realistic expectation">
        Set 90 to 150 days as your default planning
        horizon for a clean ready-property purchase
        with mortgage. Cash buyers can compress to 60
        to 90 days. Diaspora buyers should plan on
        the higher end of the range and use a POA to
        avoid courier delays.
      </Callout>

      <Pullquote>
        Sellers and agents often promise faster
        timelines than the system actually delivers.
        Plan around the realistic range, not the
        optimistic one. Surprise speed is welcome.
        Surprise delay is what causes buyers to
        accept compromises late in the file.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For our diaspora clients we run the file
        actively to compress the timeline where the
        external dependencies allow it. The only thing
        worse than a slow Kenyan transaction is a
        Kenyan transaction with both sides assuming
        the other side is moving it forward.
      </P>

      <P>
        Read also our pieces on{" "}
        <Link
          href="/insights/sale-agreement-stage-buying-property-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the sale agreement stage
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/offer-letter-stage-buying-property-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the offer letter stage
        </Link>{" "}
        for the procedural detail behind the timeline
        above.
      </P>
    </>
  );
}
