import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  LI,
  Lede,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "foreign-companies-owning-kenyan-property-structures",
  title:
    "Foreign companies owning Kenyan property: which structures actually work in 2026",
  description:
    "Foreign investors and diaspora-owned international companies often want to hold Kenyan property through their own offshore or foreign vehicles. Here is the honest 2026 guide to which structures work, which do not, the citizenship rules that constrain freehold, and how to set things up so the title actually holds.",
  publishedAt: "2025-11-08",
  readingMinutes: 7,
  author: authors.legal,
  tags: [
    "Kenya",
    "Foreign Company",
    "Structures",
    "Investment",
    "Diaspora",
    "Legal",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Foreign companies owning Kenyan property 2026 structures legal guide",
};

export default function Article() {
  return (
    <>
      <Lede>
        Foreign investors and diaspora-owned
        international companies often want to hold
        Kenyan property through their own offshore
        or foreign vehicles. The legal framework
        allows it, but the rules are specific and
        the wrong structure can leave the
        investment exposed. Here is the honest
        2026 guide.
      </Lede>

      <H2 id="rules">The basic citizenship rule</H2>

      <P>
        Kenyan freehold title can only be held
        by Kenyan citizens. Non-citizens (whether
        natural persons or foreign companies) can
        hold Kenyan property only as:
      </P>

      <UL>
        <LI>
          Leasehold up to 99 years (renewable)
        </LI>
        <LI>
          Apartments under sectional properties
          where the head title is leasehold or
          held by a body corporate
        </LI>
        <LI>
          Property held by a Kenyan company in
          which the foreign entity is a
          shareholder
        </LI>
      </UL>

      <P>
        Detail in our{" "}
        <Link
          href="/insights/freehold-vs-leasehold-kenya-citizenship-rules"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          freehold vs leasehold piece
        </Link>
        .
      </P>

      <H2 id="structures">Common structures and how they work</H2>

      <H2 id="foreign-direct">1. Foreign company holds leasehold directly</H2>

      <UL>
        <LI>
          Foreign company registers as foreign
          entity at the Companies Registry
        </LI>
        <LI>
          Holds Kenyan leasehold property
          directly in its name
        </LI>
        <LI>
          Tax: foreign company is taxed in Kenya
          on Kenyan-source income
        </LI>
        <LI>
          Pros: simple, transparent, the
          foreign owner has direct title
        </LI>
        <LI>
          Cons: foreign tax compliance ongoing,
          freehold not available
        </LI>
      </UL>

      <H2 id="kenyan-subsidiary">2. Kenyan subsidiary holds title</H2>

      <UL>
        <LI>
          Foreign parent incorporates a Kenyan
          subsidiary (private limited company)
        </LI>
        <LI>
          Subsidiary holds the property (can be
          freehold; subsidiary is a Kenyan
          person)
        </LI>
        <LI>
          Subsidiary pays Kenyan corporate tax;
          dividends paid up to parent attract
          withholding tax (Kenya double tax
          treaties may reduce)
        </LI>
        <LI>
          Pros: freehold available, clear
          corporate structure, easier to
          transact in Kenya
        </LI>
        <LI>
          Cons: more administration, requires
          Kenyan resident director, Kenyan tax
          compliance
        </LI>
      </UL>

      <H2 id="trust">3. Trust holds title</H2>

      <UL>
        <LI>
          A Kenyan trust holds the property for
          the benefit of named beneficiaries
        </LI>
        <LI>
          Trustee can be a Kenyan corporate
          trustee
        </LI>
        <LI>
          Pros: succession simplification,
          confidentiality, asset protection
          features
        </LI>
        <LI>
          Cons: trust law and tax treatment can
          be complex; requires careful drafting
        </LI>
      </UL>

      <H2 id="poor-choice">Structures that often fail</H2>

      <UL>
        <LI>
          <strong>Title in a Kenyan
          relative&rsquo;s name</strong>. The
          legal owner is the relative, not the
          foreign investor. Disputes,
          succession problems, theft.
          Avoid
        </LI>
        <LI>
          <strong>Verbal agreement with
          developer</strong>. Particularly in
          off-plan. The legal title position
          determines ownership; verbal
          arrangements do not
        </LI>
        <LI>
          <strong>Power of attorney as a
          substitute for ownership</strong>. POA
          authorises actions on behalf of the
          principal; it does not transfer
          ownership
        </LI>
        <LI>
          <strong>Offshore companies that are
          not properly registered as foreign
          entities in Kenya</strong>. May
          struggle to enforce rights and
          transact
        </LI>
      </UL>

      <H2 id="tax">Tax considerations</H2>

      <UL>
        <LI>
          <strong>Stamp duty</strong>: 4 percent
          urban or 2 percent rural on transfer
          to the structure
        </LI>
        <LI>
          <strong>Kenya corporate tax</strong>:
          30 percent on profits (Kenyan
          subsidiary) or branch tax (foreign
          company directly)
        </LI>
        <LI>
          <strong>Withholding tax on dividends
          to foreign parent</strong>: 15 percent
          (modified by treaty)
        </LI>
        <LI>
          <strong>CGT</strong>: 15 percent on
          gain on disposal
        </LI>
        <LI>
          <strong>Double tax relief</strong>:
          available where Kenya has a treaty
          with the parent jurisdiction
        </LI>
      </UL>

      <H2 id="how">How to set up the right structure</H2>

      <UL>
        <LI>
          Engage a Kenyan corporate lawyer and
          tax adviser before purchase
        </LI>
        <LI>
          Engage your home jurisdiction
          equivalent for tax coordination
        </LI>
        <LI>
          Decide on the structure before the
          transaction; restructuring after
          purchase triggers stamp duty and CGT
        </LI>
        <LI>
          Document beneficial ownership,
          shareholder agreements, board
          resolutions
        </LI>
        <LI>
          Maintain ongoing compliance (annual
          returns, beneficial ownership
          register, tax filings)
        </LI>
      </UL>

      <Callout title="The foreign structure rule">
        Foreign companies can hold Kenyan
        property cleanly through one of three
        structures: foreign branch holding
        leasehold, Kenyan subsidiary holding
        freehold or leasehold, or trust
        holding for named beneficiaries.
        Anything informal or undocumented is
        not a structure; it is an exposure.
      </Callout>

      <Pullquote>
        The foreign-investor disputes that end
        in Kenyan courts are almost never
        about structures done correctly. They
        are about structures done informally.
        The cost of doing it correctly is
        small. The cost of doing it informally
        is sometimes the entire investment.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For foreign investor clients we
        structure ownership properly with our
        legal partners before the transaction
        closes. Read also our pieces on{" "}
        <Link
          href="/insights/british-buyers-kenyan-property-complete-guide-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          British buyers complete guide
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/personal-name-vs-company-buying-property-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          personal name vs company
        </Link>
        .
      </P>
    </>
  );
}
