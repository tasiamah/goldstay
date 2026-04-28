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
  slug: "kenya-affordable-housing-levy-1-5-percent-explained",
  title:
    "Kenya&rsquo;s 1.5% Affordable Housing Levy explained for diaspora landlords",
  description:
    "Who pays the 1.5% Affordable Housing Levy, who is exempt, what it actually funds, and what diaspora landlords specifically need to know about how it interacts with rental income, payroll obligations and the Affordable Housing Programme allocation rules.",
  publishedAt: "2025-08-29",
  readingMinutes: 7,
  author: authors.editors,
  tags: ["Kenya", "Tax", "Housing Levy", "AHP", "Compliance", "Diaspora"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Kenyan affordable housing programme construction site, 1.5 percent housing levy explained for landlords",
};

export default function Article() {
  return (
    <>
      <Lede>
        The 1.5% Affordable Housing Levy is one of the most
        widely discussed and least clearly understood tax
        items in Kenya right now. Diaspora landlords keep
        asking us three things: do I pay it on rental
        income, what does it actually fund, and does it give
        me anything in return. Here is the precise answer
        for each.
      </Lede>

      <H2 id="what-it-is">What the levy is</H2>

      <P>
        The Affordable Housing Levy was introduced under the
        Affordable Housing Act 2024 (replacing earlier
        Finance Act provisions that were challenged in
        court). It is a 1.5% deduction at source from gross
        income, matched by a further 1.5% from the employer
        for employed persons, with the proceeds ringfenced
        to fund the Affordable Housing Programme (AHP).
      </P>

      <H2 id="who-pays">Who pays it</H2>

      <UL>
        <LI>
          <strong>Employed Kenyans.</strong> 1.5% from gross
          monthly salary, matched by 1.5% from the employer.
          Total 3% goes to the Housing Fund. Deducted at
          source by the employer, no separate filing.
        </LI>
        <LI>
          <strong>Self-employed Kenyans (in a payroll-equivalent
          situation).</strong> 1.5% on gross monthly income,
          remitted directly to the Kenya Revenue Authority by
          the 9th of the following month.
        </LI>
        <LI>
          <strong>Non-resident individuals earning Kenyan
          payroll income.</strong> Pay on the same basis as
          resident employees on the salary portion. The
          employer remits.
        </LI>
      </UL>

      <H2 id="what-it-does-not-cover">What the levy does not cover</H2>

      <P>
        This is where most of the diaspora confusion lives.
        The levy applies to <strong>gross income from
        employment or self-employment</strong>. It does not
        currently apply to:
      </P>

      <UL>
        <LI>
          Rental income (covered by the 7.5% Monthly Rental
          Income tax up to the threshold; see our{" "}
          <Link
            href="/insights/kenya-mri-tax-diaspora-landlords"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            MRI tax piece
          </Link>{" "}
          for that)
        </LI>
        <LI>
          Capital gains from property sales (covered by 15%
          CGT)
        </LI>
        <LI>
          Investment income (interest, dividends)
        </LI>
        <LI>
          Pension and retirement income
        </LI>
      </UL>

      <P>
        For a typical diaspora landlord whose Kenyan income
        is purely rental, the housing levy does not apply to
        that rental income. You pay 7.5% MRI tax on the rent
        and that is the whole tax line on rent. The housing
        levy is a separate stream that captures payroll
        income.
      </P>

      <Callout title="The clean answer for diaspora landlords">
        If your only Kenyan income is from rented property,
        the 1.5% Affordable Housing Levy does not apply to
        you. You pay the 7.5% MRI tax on residential rent
        and that is the end of the rental income tax
        question. If you also draw a Kenyan salary or
        consulting income, the levy applies to that
        income, separately.
      </Callout>

      <H2 id="ahp-programme">The Affordable Housing Programme itself</H2>

      <P>
        The levy funds the construction of state-supported
        housing across the country. The official allocation
        target as of 2026 is 200,000 units over five years,
        across three tiers: social housing (target rent KES
        1,000 to 5,000 per month, for households earning up
        to KES 20,000), affordable housing (target sale
        price KES 1m to 3m, for households earning KES
        20,000 to 50,000) and affordable middle income
        (target KES 3m to 10m, for households up to KES
        150,000 monthly).
      </P>

      <P>
        Allocations are run through the Boma Yangu portal.
        Applicants register, the system runs a points-based
        allocation algorithm, and successful applicants
        proceed to payment plans (10% deposit, balance over
        25 years through the Kenya Mortgage Refinance
        Company).
      </P>

      <H2 id="diaspora-eligibility">Can diaspora Kenyans benefit?</H2>

      <P>
        A common diaspora question. The current rules:
      </P>

      <OL>
        <LI>
          The AHP allocation prioritises residents who have
          contributed to the housing fund through the levy.
          Diaspora Kenyans without a Kenyan payroll income
          do not contribute and therefore do not earn
          allocation points.
        </LI>
        <LI>
          Diaspora Kenyans can still apply through Boma
          Yangu and may be allocated, especially in lower
          demand zones, but the system is designed to favour
          contributors.
        </LI>
        <LI>
          The AHP units are not aimed at the diaspora
          investment market in any case. The price points
          and target demographics are local-resident first.
          For diaspora investors looking at Nairobi
          investment property, the AHP is not the channel.
          Private market acquisition through{" "}
          <Link
            href="/property-sourcing"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            property sourcing
          </Link>{" "}
          remains the route.
        </LI>
      </OL>

      <H2 id="indirect-effects">The indirect effects on the private market</H2>

      <P>
        Even if AHP is not directly available to diaspora
        investors, the programme is reshaping the Nairobi
        and broader Kenyan housing market in ways that
        affect private investors:
      </P>

      <UL>
        <LI>
          <strong>Land prices in AHP corridors.</strong> Land
          adjacent to large planned AHP estates (Mukuru,
          Starehe, Park Road in Ngara, parts of Mlolongo)
          has seen demand pick up from private developers
          looking to position for spillover. Mixed effects so
          far, with some pockets seeing 10 to 20 percent
          price moves.
        </LI>
        <LI>
          <strong>Mid-market rental supply.</strong> AHP
          delivery, where it works, gradually adds supply at
          the lower end of the rental market. For diaspora
          investors holding entry-level rental property
          (USD 600 to 900 a month rents), this is a
          long-term supply tailwind to be aware of, though
          delivery timelines mean the impact is years out.
        </LI>
        <LI>
          <strong>The KMRC effect on mortgages.</strong> The
          Kenya Mortgage Refinance Company refinances
          banks&rsquo; long-term mortgage portfolios at
          lower cost, partly funded by the housing levy
          stream. Over time this is gradually pushing
          mortgage rates down for borrowers in the
          KMRC-eligible segment. Limited diaspora benefit
          today, possibly more in future as eligibility
          rules expand.
        </LI>
      </UL>

      <Pullquote>
        The 1.5% levy does not apply to your rent. The
        Affordable Housing Programme it funds is reshaping
        parts of the Kenyan market you should track, but it
        is not a channel for diaspora investment buying
        today.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We track the AHP rollout because it changes the
        long-run dynamics of certain Nairobi submarkets,
        especially eastlands and the southern corridor. For
        clients with Kenyan payroll income on top of rental
        income, we coordinate with our tax partners to keep
        the levy filings clean alongside the MRI filings.
      </P>

      <P>
        Read the related pieces on{" "}
        <Link
          href="/insights/kenya-mri-tax-diaspora-landlords"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the 7.5% MRI tax
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/kenya-mortgage-rates-2026-diaspora-buyer-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Kenyan mortgage rates in 2026
        </Link>{" "}
        for the linked tax and finance picture.
      </P>
    </>
  );
}
