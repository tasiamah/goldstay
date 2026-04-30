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
  slug: "buying-property-expat-working-nairobi",
  title:
    "Buying property in Nairobi as a working expat",
  description:
    "Expats living and working in Nairobi often consider whether to buy or keep renting. The decision depends on length of stay, employer support, posting horizon and whether the buyer plans long-term Kenya exposure. Here is the honest 2026 guide.",
  publishedAt: "2026-01-18",
  readingMinutes: 6,
  author: authors.editors,
  tags: [
    "Expat",
    "Buyer Profile",
    "Nairobi",
    "Foreign National",
    "Buyer Guide",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Buying property expat working Nairobi 2026 guide foreign national",
};

export default function Article() {
  return (
    <>
      <Lede>
        Expats living and working in Nairobi
        often consider whether to buy or keep
        renting. The decision depends on length
        of stay, employer support, posting
        horizon and whether the buyer plans
        long-term Kenya exposure. Here is the
        honest 2026 guide.
      </Lede>

      <H2 id="legal">Legal framework</H2>

      <UL>
        <LI>
          Foreign nationals can own leasehold
          property in Kenya (typical lease
          99 years, capped by Constitution
          to 99 years)
        </LI>
        <LI>
          Foreign nationals cannot own
          freehold or agricultural land
          directly (except via Kenyan
          incorporated company subject to
          local-shareholding rules)
        </LI>
        <LI>
          Apartments are typically leasehold
          on a long lease via the
          development’s mother title
        </LI>
        <LI>
          Standalone houses on residential
          plots: most are leasehold;
          freehold pockets exist but are not
          available to foreign individuals
        </LI>
      </UL>

      <H2 id="who-buys">Who actually buys</H2>

      <UL>
        <LI>
          Expats with multi-year horizons
          and intent to retire in Kenya
        </LI>
        <LI>
          Expats married to Kenyan citizens
        </LI>
        <LI>
          Expats with strong local family
          ties
        </LI>
        <LI>
          Expat investors building Kenyan
          rental portfolio
        </LI>
        <LI>
          Senior corporate and diplomatic
          staff with confirmed long-stay
          plans
        </LI>
      </UL>

      <H2 id="who-doesnt">Who should not buy</H2>

      <UL>
        <LI>
          Expats on 2 to 4 year postings
          with rotation expected
        </LI>
        <LI>
          Expats without confirmed long-term
          Kenya exposure
        </LI>
        <LI>
          Expats whose company already
          provides housing allowance and
          where renting is more efficient
        </LI>
      </UL>

      <H2 id="suburbs">Where expats actually buy</H2>

      <UL>
        <LI>
          <strong>Karen</strong>: families
          with senior corporate roles and
          long stay plans
        </LI>
        <LI>
          <strong>Lavington and Spring
          Valley</strong>: family expats
          working centrally
        </LI>
        <LI>
          <strong>Gigiri-Rosslyn-Runda</strong>:
          UN, embassies, premium employers
        </LI>
        <LI>
          <strong>Westlands and Kilimani</strong>:
          singles and couples without
          children
        </LI>
        <LI>
          <strong>Muthaiga</strong>:
          ultra-premium long-stay families
        </LI>
      </UL>

      <H2 id="finance">Finance for expats</H2>

      <UL>
        <LI>
          Most expats pay cash; mortgage
          access for non-citizens is
          available but more constrained
        </LI>
        <LI>
          USD-income clients can get
          dollarised mortgages at certain
          banks (Stanbic, NCBA, StanChart)
        </LI>
        <LI>
          KES mortgage on USD income carries
          forex risk
        </LI>
      </UL>

      <H2 id="risks">Risks specific to expats</H2>

      <UL>
        <LI>
          Forex risk on exit if KES
          weakens against USD or GBP
        </LI>
        <LI>
          Capital gains tax on disposal
          (15 percent)
        </LI>
        <LI>
          Property management while
          travelling
        </LI>
        <LI>
          Title and structure diligence is
          even more important without local
          legal network
        </LI>
      </UL>

      <Callout title="The expat rule">
        Buy if your honest Kenya horizon is
        7+ years or if you plan to retire
        here. Rent if your horizon is
        shorter. The intermediate cases
        usually fall on the side of
        renting.
      </Callout>

      <Pullquote>
        Expat property mistakes in Nairobi
        almost always come down to a
        mismatch between purchase horizon
        and actual stay. Be honest about
        the posting reality.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For expat clients we run horizon,
        forex and structuring diligence
        honestly. Read also our pieces on{" "}
        <Link
          href="/insights/foreigners-buying-kenyan-property-explained"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          foreigners buying Kenyan property
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/british-buyers-kenyan-property-complete-guide-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          British buyers Kenyan property
        </Link>
        .
      </P>
    </>
  );
}
