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
  slug: "buying-property-unmarried-couple-kenya",
  title:
    "Buying property as an unmarried couple in Kenya: the honest guide",
  description:
    "Many couples buy property in Nairobi before marriage. The legal, tax and structuring decisions are different from a married couple&rsquo;s purchase. Here is the honest 2026 guide on co-ownership, financing, exit and the documentation that actually protects both parties.",
  publishedAt: "2026-01-15",
  readingMinutes: 6,
  author: authors.legal,
  tags: [
    "Unmarried Couple",
    "Co-Ownership",
    "Kenya",
    "Buyer Guide",
    "Legal",
    "Structuring",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Buying property unmarried couple Kenya 2026 honest guide",
};

export default function Article() {
  return (
    <>
      <Lede>
        Many couples buy property in Nairobi
        before marriage. The legal, tax and
        structuring decisions are different from
        a married couple&rsquo;s purchase. Here
        is the honest 2026 guide on
        co-ownership, financing, exit and the
        documentation that actually protects
        both parties.
      </Lede>

      <H2 id="ownership">Ownership structures</H2>

      <UL>
        <LI>
          <strong>Joint tenancy</strong>: both
          parties hold an undivided joint
          interest with right of survivorship
        </LI>
        <LI>
          <strong>Tenancy in common</strong>:
          each party holds a defined share
          (e.g. 60/40); on death the share
          passes by will or intestacy, not to
          the surviving co-owner
          automatically
        </LI>
        <LI>
          <strong>Sole ownership with
          contribution</strong>: title in one
          name, the other contributing under
          a separate documented loan or
          gift
        </LI>
        <LI>
          <strong>Company ownership</strong>:
          property held by a company in which
          both parties hold shares
        </LI>
      </UL>

      <H2 id="recommended">Recommended for unmarried couples</H2>

      <UL>
        <LI>
          Tenancy in common with explicit
          ownership shares matching financial
          contribution
        </LI>
        <LI>
          Co-ownership agreement covering
          contribution, exit, dispute
          resolution and treatment on
          relationship change
        </LI>
        <LI>
          Mirror wills appointing each
          other (if intended)
        </LI>
        <LI>
          Power of attorney provisions for
          incapacity
        </LI>
      </UL>

      <H2 id="finance">Finance considerations</H2>

      <UL>
        <LI>
          Banks accept joint mortgage
          applicants regardless of marital
          status
        </LI>
        <LI>
          Both parties co-sign and become
          jointly and severally liable
        </LI>
        <LI>
          Income aggregation increases
          mortgage size
        </LI>
        <LI>
          Default by one party affects the
          other
        </LI>
      </UL>

      <H2 id="exit">Exit if the relationship ends</H2>

      <UL>
        <LI>
          Co-ownership agreement should
          cover: forced sale, right of
          first refusal, valuation
          mechanism, mortgage assumption
        </LI>
        <LI>
          Without an agreement, a partition
          action through the courts is
          slow and expensive
        </LI>
        <LI>
          Refinancing to allow one party to
          buy out the other is a typical
          exit
        </LI>
      </UL>

      <H2 id="cohabitation">Cohabitation and presumption of marriage</H2>

      <UL>
        <LI>
          Kenyan courts have applied a
          presumption of marriage doctrine
          in some long-cohabitation cases
        </LI>
        <LI>
          The Marriage Act 2014 narrowed
          this but the legal landscape
          continues to evolve
        </LI>
        <LI>
          Document the property arrangement
          in writing; do not rely on
          presumptions
        </LI>
      </UL>

      <H2 id="risks">Risks</H2>

      <UL>
        <LI>
          Relationship breakdown without
          documentation produces expensive
          litigation
        </LI>
        <LI>
          Death without will produces
          succession outcomes that may not
          reflect intent
        </LI>
        <LI>
          Mortgage default by one party
          affects both parties&rsquo; credit
          and asset
        </LI>
      </UL>

      <Callout title="The unmarried couple rule">
        Document the arrangement in writing.
        Tenancy in common with explicit
        shares, a co-ownership agreement,
        and mirror wills. The cost is
        small; the protection is real.
        Property is the asset most likely
        to outlast the relationship.
      </Callout>

      <Pullquote>
        Most expensive Kenyan unmarried
        couple property disputes are not
        about the property; they are about
        the absence of a written agreement
        when the relationship ended.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For unmarried couple clients we
        coordinate with independent counsel
        on the co-ownership agreement. Read
        also our pieces on{" "}
        <Link
          href="/insights/personal-name-vs-company-buying-property-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          personal name vs company
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/property-and-divorce-kenya-honest-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          property and divorce Kenya
        </Link>
        .
      </P>
    </>
  );
}
