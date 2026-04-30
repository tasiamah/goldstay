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
  slug: "why-nairobi-property-prices-keep-rising-2026",
  title:
    "Why Nairobi property prices keep rising in 2026 despite oversupply",
  description:
    "Nairobi property prices have continued rising in 2026 despite headlines about apartment oversupply. The drivers are structural, not cyclical, and they explain why mid-premium and premium Nairobi property continues to outperform expectations.",
  publishedAt: "2026-04-07",
  readingMinutes: 5,
  author: authors.research,
  tags: [
    "Nairobi",
    "Prices",
    "Market",
    "2026",
    "Trend",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Why Nairobi property prices keep rising 2026 despite oversupply",
};

export default function Article() {
  return (
    <>
      <Lede>
        Nairobi property prices have continued
        rising in 2026 despite recurring
        headlines about apartment oversupply.
        The drivers are structural, not
        cyclical. Here is the honest 2026
        explanation.
      </Lede>

      <H2 id="drivers">The structural drivers</H2>

      <UL>
        <LI>
          <strong>Construction cost
          inflation</strong>: cement, steel,
          finishings and labour rose
          materially in the last 36 months;
          new build replacement cost
          underpins resale prices
        </LI>
        <LI>
          <strong>KES weakness</strong>:
          dollar-denominated tenants and
          buyers translate to KES at
          favourable rates; the local
          headline number rises
        </LI>
        <LI>
          <strong>Diaspora demand</strong>:
          remittances at record levels;
          Nairobi property is the dominant
          asset class for diaspora savings
        </LI>
        <LI>
          <strong>Limited premium plot
          supply</strong>: mature suburbs
          (Karen, Lavington, Spring Valley,
          Runda) cannot expand; scarcity
          underpins pricing
        </LI>
        <LI>
          <strong>Mortgage market expansion</strong>:
          KMRC affordable mortgages and
          KCB/Stanbic competition pulled
          rates down; more buyers can
          finance
        </LI>
        <LI>
          <strong>Population growth</strong>:
          Nairobi metro adds roughly half
          a million residents per year
        </LI>
      </UL>

      <H2 id="oversupply">The oversupply nuance</H2>

      <UL>
        <LI>
          Oversupply is real in specific
          tower clusters and weak compounds
        </LI>
        <LI>
          Quality stock with strong
          governance and reliable services
          is undersupplied
        </LI>
        <LI>
          The mass-market apartment segment
          has more inventory than demand in
          some pockets
        </LI>
        <LI>
          The premium and family standalone
          segments are structurally
          undersupplied
        </LI>
      </UL>

      <H2 id="watch">What to watch</H2>

      <UL>
        <LI>
          Mortgage rate cycle
        </LI>
        <LI>
          KES against USD and GBP
        </LI>
        <LI>
          Construction cost trajectory
        </LI>
        <LI>
          Diaspora remittance flows
        </LI>
        <LI>
          New build pipeline absorption rates
        </LI>
      </UL>

      <Callout title="The price rule">
        Nairobi property pricing is segmented.
        The headline “prices are
        rising” story is true for
        quality stock; the headline
        “oversupply” story is
        true for weaker compounds. Buy in
        the right segment and the rise is
        with you; buy in the wrong one
        and the segment is against you.
      </Callout>

      <Pullquote>
        Nairobi has not been one property
        market for the last decade. The
        media reports on it as if it were.
        That is where the confusion comes
        from.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For sourcing clients we run honest
        segment-by-segment pricing analysis.
        Read also our pieces on{" "}
        <Link
          href="/insights/apartment-oversupply-nairobi-real-or-myth"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          apartment oversupply Nairobi
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/nairobi-property-market-review-2026-h1"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Nairobi market review 2026 H1
        </Link>
        .
      </P>
    </>
  );
}
