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
  slug: "buying-property-fresh-graduate-nairobi",
  title:
    "Buying property as a fresh graduate in Nairobi: the honest 2026 guide",
  description:
    "Buying property in your first decade of working life is harder than the marketing suggests, but it is possible. Here is the honest 2026 guide for fresh graduates in Nairobi on saving, mortgage qualification, neighbourhood selection and avoiding the early career property mistakes.",
  publishedAt: "2025-12-20",
  readingMinutes: 6,
  author: authors.editors,
  tags: [
    "Fresh Graduate",
    "First-Time Buyer",
    "Nairobi",
    "Buyer Guide",
    "Affordability",
    "Career",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Buying property as a fresh graduate Nairobi 2026 honest guide",
};

export default function Article() {
  return (
    <>
      <Lede>
        Buying property in your first decade of
        working life is harder than the
        marketing suggests but it is possible.
        Here is the honest 2026 guide for fresh
        graduates in Nairobi on saving, mortgage
        qualification, neighbourhood selection
        and avoiding the early career property
        mistakes.
      </Lede>

      <H2 id="should-you">Should you buy yet?</H2>

      <P>
        Renting in your 20s is often the right
        answer. Career mobility, lifestyle
        flexibility and the optionality to
        change cities matter. The mortgage
        commitment locks in a 25 year cash
        flow and a specific location.
      </P>

      <P>
        That said, if you are settled in
        Nairobi, the career trajectory is
        clear, you have built up real savings
        and you have credible income, buying
        can be a strong long-term move. The
        compounding from your 20s to your 40s
        is real.
      </P>

      <H2 id="saving">Saving the deposit</H2>

      <UL>
        <LI>
          Aim for at least 15 percent deposit
          plus 7 percent for stamp duty,
          legal and transfer
        </LI>
        <LI>
          On a KES 7m apartment, that is
          around KES 1.5m up front
        </LI>
        <LI>
          Money market funds, government
          bonds (Treasury Bills, Bonds via
          CBK) for the deposit savings
        </LI>
        <LI>
          SACCO membership for additional
          access to property finance
        </LI>
        <LI>
          Cut the recurring expenses;
          property is bought from saved
          income, not income alone
        </LI>
      </UL>

      <H2 id="mortgage">Mortgage qualification</H2>

      <UL>
        <LI>
          Banks lend on stable income,
          typically 12 to 24 months of clean
          payslips
        </LI>
        <LI>
          DSR cap typically 50 percent of net
          income
        </LI>
        <LI>
          First-time buyer products from KCB,
          NCBA, Stanbic, HFC and the
          Affordable Housing Programme
        </LI>
        <LI>
          KMRC-supported lower interest
          mortgage products
        </LI>
        <LI>
          Build the relationship with the
          bank for at least 6 months before
          applying
        </LI>
      </UL>

      <H2 id="suburbs">Suburbs that work</H2>

      <UL>
        <LI>
          Pipeline, Kiambu Road fringe,
          Kahawa Sukari, Kasarani for KES
          3m to KES 5m studios and 1-beds
        </LI>
        <LI>
          Donholm, Imara Daima, Embakasi
          for KES 4m to KES 7m mass-market
          2-bed
        </LI>
        <LI>
          Syokimau, Athi River, Kitengela
          for KES 4m to KES 8m 2-bed
        </LI>
        <LI>
          South B, South C, Lang’ata
          fringes for slightly higher
          tickets with stronger residential
          character
        </LI>
      </UL>

      <H2 id="mistakes">Mistakes to avoid</H2>

      <UL>
        <LI>
          Buying off-plan from an unknown
          developer with weak track record
        </LI>
        <LI>
          Stretching DSR to 60+ percent;
          banks may approve but life
          becomes hard
        </LI>
        <LI>
          Buying a property you bought
          because friends were buying it,
          not because the unit fits your
          life
        </LI>
        <LI>
          Skipping legal and survey
          diligence
        </LI>
        <LI>
          Forgetting that early career income
          can change; build cash buffer
        </LI>
      </UL>

      <Callout title="The fresh graduate rule">
        Buy when career and savings are
        ready, not before. When you do buy,
        choose a unit that fits your honest
        life and budget rather than the
        unit that signals success. The
        compounding works regardless of
        suburb prestige.
      </Callout>

      <Pullquote>
        Most early career property regrets
        are not market timing. They are
        units bought to impress rather than
        to live in.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For fresh graduate sourcing
        clients we run the affordability
        and life-fit conversation
        honestly. Read also our pieces on{" "}
        <Link
          href="/insights/first-time-home-buyer-kenya-complete-guide-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          first-time home buyer Kenya
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/cheapest-decent-suburbs-nairobi-2026-buyer-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          cheapest decent suburbs
        </Link>
        .
      </P>
    </>
  );
}
