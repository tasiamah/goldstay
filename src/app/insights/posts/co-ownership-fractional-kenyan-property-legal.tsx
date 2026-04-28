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
  slug: "co-ownership-fractional-kenyan-property-legal",
  title:
    "Co-ownership and fractional Kenyan property: what is legal in 2026",
  description:
    "Co-ownership and fractional ownership of Kenyan property are growing categories, popular with diaspora groups, friend syndicates and sibling investments. Here is the honest 2026 guide on what is legal, the structures that work, the regulatory landscape and the agreements that prevent disputes.",
  publishedAt: "2025-11-12",
  readingMinutes: 6,
  author: authors.legal,
  tags: [
    "Kenya",
    "Co-ownership",
    "Fractional",
    "Investment",
    "Diaspora",
    "Legal",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Co-ownership and fractional Kenyan property 2026 legal guide",
};

export default function Article() {
  return (
    <>
      <Lede>
        Co-ownership and fractional ownership of
        Kenyan property are growing categories,
        popular with diaspora groups, friend
        syndicates, sibling investments and
        emerging fintech-style platforms. The
        legal framework allows it; the
        documentation is what determines whether
        the arrangement holds. Here is the
        honest 2026 guide.
      </Lede>

      <H2 id="forms">Legal forms of co-ownership in Kenya</H2>

      <UL>
        <LI>
          <strong>Joint tenancy</strong>: two or
          more co-owners hold the title together
          with rights of survivorship. The
          deceased&rsquo;s share passes
          automatically to the survivors. Common
          for spouses
        </LI>
        <LI>
          <strong>Tenancy in common</strong>:
          two or more co-owners hold defined
          shares (50 percent each, or 30/30/40,
          for example). Each share passes
          through the owner&rsquo;s estate, not
          to the survivors. Common for friend
          and sibling co-investments
        </LI>
        <LI>
          <strong>Company ownership</strong>: a
          private limited company holds the
          title; the co-owners hold shares in
          the company. Detail in our{" "}
          <Link
            href="/insights/personal-name-vs-company-buying-property-kenya"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            personal name vs company piece
          </Link>
        </LI>
        <LI>
          <strong>Trust ownership</strong>: a
          trust holds the property for the
          benefit of named beneficiaries
        </LI>
        <LI>
          <strong>SACCO ownership</strong>: a
          SACCO holds property and members hold
          equity claims through their
          membership
        </LI>
        <LI>
          <strong>REIT structure</strong>: CMA
          regulated; covered in our{" "}
          <Link
            href="/insights/kenya-reits-acorn-asa-ilam-fahari-vs-direct-property"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            REITs piece
          </Link>
        </LI>
      </UL>

      <H2 id="fractional">Fractional platforms</H2>

      <P>
        Newer platforms in Kenya offer
        fractional ownership where investors buy
        small shares in a property through a
        platform-managed structure. The
        regulatory environment for these
        platforms is still developing. CMA may
        regard some structures as collective
        investment schemes that require
        licensing.
      </P>

      <P>
        Investors should verify:
      </P>

      <UL>
        <LI>
          What entity actually holds the title
        </LI>
        <LI>
          What contractual rights the investor
          has against that entity
        </LI>
        <LI>
          Whether the structure is CMA
          regulated
        </LI>
        <LI>
          What happens on platform failure
        </LI>
        <LI>
          Exit liquidity (most platforms have
          limited secondary market)
        </LI>
      </UL>

      <H2 id="agreement">The co-ownership agreement</H2>

      <P>
        For any co-ownership arrangement, the
        co-ownership agreement is what prevents
        disputes from becoming litigation. Key
        clauses:
      </P>

      <UL>
        <LI>
          Defined ownership shares
        </LI>
        <LI>
          Decision making (unanimity, majority,
          delegated to a managing member)
        </LI>
        <LI>
          Income and expense allocation
        </LI>
        <LI>
          Capital call provisions (what
          happens if the property needs
          additional money)
        </LI>
        <LI>
          Default consequences (what happens if
          a co-owner does not pay their share)
        </LI>
        <LI>
          Buy-out mechanism (how to value and
          settle a co-owner who wants to exit)
        </LI>
        <LI>
          Right of first refusal (co-owners
          have first claim if a share is being
          sold)
        </LI>
        <LI>
          Death and succession
        </LI>
        <LI>
          Dispute resolution (arbitration
          clause)
        </LI>
        <LI>
          Property use rules (where co-owners
          intend to use the property
          themselves)
        </LI>
      </UL>

      <H2 id="common-disputes">Common co-ownership disputes</H2>

      <UL>
        <LI>
          One owner wants to sell, the others
          do not
        </LI>
        <LI>
          One owner is not paying their share
          of expenses
        </LI>
        <LI>
          Renovation disagreements
        </LI>
        <LI>
          Use of the property (one cousin
          treats it as a personal weekend home)
        </LI>
        <LI>
          Inheritance complications when one
          co-owner dies
        </LI>
        <LI>
          Tax treatment confusion
        </LI>
      </UL>

      <H2 id="diaspora">For diaspora groups specifically</H2>

      <P>
        Diaspora siblings, cousins and friend
        groups co-investing should structure
        through a company or trust rather than
        as individual tenants in common. The
        company structure simplifies decision
        making, succession and exit, and
        reduces the surface area for personal
        disputes to drive the property.
      </P>

      <Callout title="The co-ownership rule">
        Co-ownership of Kenyan property works
        when it is properly structured.
        Documents must be drafted by an
        advocate before the deal closes, not
        after the first dispute. The cost of
        proper documentation is small relative
        to the cost of resolving an undocumented
        co-ownership dispute later.
      </Callout>

      <Pullquote>
        Most co-ownership arrangements are made
        in good faith. The documents that
        prevent disputes are not a sign of bad
        faith; they are a sign that the
        co-owners take the arrangement
        seriously enough to protect each other.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For investor groups we structure the
        co-ownership through company or trust
        with our legal partners. Read also our
        pieces on{" "}
        <Link
          href="/insights/personal-name-vs-company-buying-property-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          personal name vs company
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/foreign-companies-owning-kenyan-property-structures"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          foreign companies owning Kenyan
          property
        </Link>
        .
      </P>
    </>
  );
}
