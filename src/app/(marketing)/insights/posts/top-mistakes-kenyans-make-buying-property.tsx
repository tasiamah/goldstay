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
  slug: "top-mistakes-kenyans-make-buying-property",
  title:
    "The top 10 mistakes Kenyans make when buying property in 2026",
  description:
    "Most Kenyan property losses are not exotic. They follow a small set of recurring mistakes that buyers make again and again. Here is the honest 2026 list of the top 10, with how each one happens and how to avoid it.",
  publishedAt: "2024-10-08",
  readingMinutes: 8,
  author: authors.editors,
  tags: [
    "Kenya",
    "Buying",
    "Mistakes",
    "Diaspora",
    "Property",
    "Diligence",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Top 10 mistakes Kenyans make buying property 2026 list",
};

export default function Article() {
  return (
    <>
      <Lede>
        Most Kenyan property losses are not exotic.
        They follow a small set of recurring mistakes
        that buyers make again and again. The names of
        the suburbs, the developers and the agents
        change. The mistakes do not. Here is the
        honest 2026 list of the top 10 mistakes
        Kenyans make when buying property, with how
        each one happens and how to avoid it.
      </Lede>

      <H2 id="m1">1. Trusting the seller’s lawyer</H2>

      <P>
        The seller’s lawyer represents the
        seller. The seller’s incentive is to
        complete the sale on the seller’s terms.
        Buyers who use the seller’s lawyer to
        save on fees are the buyers who later discover
        a problem with the title that nobody warned
        them about. Always engage your own lawyer.
      </P>

      <H2 id="m2">2. Skipping the official title search</H2>

      <P>
        A recent search produced by the seller is not
        a substitute for a fresh search through your
        own lawyer on the day of completion. Title
        positions change. Cautions get registered.
        Charges get added. Buyers who skip the fresh
        search are buying the title position from
        weeks or months earlier, not the position
        that exists today.
      </P>

      <H2 id="m3">3. Paying deposits to the seller or agent directly</H2>

      <P>
        Deposits should sit in the buyer’s
        lawyer’s client account, held against
        the completion of the sale. Deposits that move
        directly to the seller or agent are deposits
        that walk away with them if the deal falls
        apart. The client account is a regulated
        account; the agent’s personal M-Pesa is
        not.
      </P>

      <H2 id="m4">4. Buying off-plan from an unfamiliar developer</H2>

      <P>
        The lower price on off-plan reflects execution
        risk that the buyer takes on. Buying off-plan
        from a developer with no completed projects
        you can visit is buying execution risk you
        cannot price. Detail in our{" "}
        <Link
          href="/insights/how-to-verify-kenyan-property-developer"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to verify a developer piece
        </Link>
        .
      </P>

      <H2 id="m5">5. Stretching the budget to the bank’s ceiling</H2>

      <P>
        Banks lend up to roughly one third of net
        income on mortgage payments. Borrowing at the
        ceiling means any negative shock (job loss,
        rate rise, sudden expense) becomes a property
        crisis. Borrow at 50 to 70 percent of what the
        bank offers, not 100 percent.
      </P>

      <H2 id="m6">6. Letting a relative manage the project or property</H2>

      <P>
        The relative who handles construction
        oversight, rent collection or tenant management
        on your behalf without professional structure
        is the relationship that often degrades over
        time. Detail in our{" "}
        <Link
          href="/insights/how-to-tell-if-relative-kenya-scamming-you"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          relative scam piece
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/why-property-management-matters-diaspora-landlords"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          property management piece
        </Link>
        .
      </P>

      <H2 id="m7">7. Forgetting transaction costs</H2>

      <P>
        Stamp duty, legal fees, valuation, registration
        and immediate furnishing collectively add 6 to
        9 percent to the purchase price. Buyers who
        budget only the purchase price end up
        scrambling for an extra KES 500,000 on a KES
        8m apartment.
      </P>

      <H2 id="m8">8. Forgetting service charge</H2>

      <P>
        Apartment ownership comes with monthly service
        charge that may run KES 8,000 to KES 80,000
        depending on suburb and compound. Buyers who
        do not factor this into the running cost
        underestimate the true cost of ownership and
        sometimes default on payments after move-in.
      </P>

      <H2 id="m9">9. Choosing the suburb before the school or commute</H2>

      <P>
        First-time buyers often pick the suburb that
        matches their identity rather than the suburb
        that fits their daily logistics. Result: a
        beautiful Karen home with a 70 minute school
        run twice a day. Pick the school first or the
        work commute first; the suburb follows.
      </P>

      <H2 id="m10">10. Buying in the oversupplied segment</H2>

      <P>
        The cheap apartment in the oversupplied
        Kilimani micro market looks like a bargain.
        It is not. Property in oversupplied segments
        struggles to rent and resells slowly. Detail
        in our{" "}
        <Link
          href="/insights/nairobi-apartment-oversupply-2026-suburbs-to-avoid"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          oversupply piece
        </Link>
        .
      </P>

      <H2 id="bonus">Bonus mistakes worth naming</H2>

      <UL>
        <LI>
          Buying agricultural land without LCB consent
        </LI>
        <LI>
          Skipping spousal consent on a married
          seller’s property
        </LI>
        <LI>
          Failing to make a will, leaving the property
          to intestacy chaos
        </LI>
        <LI>
          Holding a single property unmanaged for years
          (vacancy, fraud risk, deterioration)
        </LI>
        <LI>
          Not insuring the property properly
        </LI>
      </UL>

      <Callout title="The defensive default">
        Independent lawyer, fresh title search,
        deposit in client account, regulated property
        manager rather than relative, modest leverage,
        documented contract, registered transfer,
        clean wills. Get those right and you have
        prevented eight of the ten mistakes above.
      </Callout>

      <Pullquote>
        Kenyan property is not riskier than property
        anywhere else. It is just less forgiving of
        skipped steps. Buyers who follow the proper
        sequence rarely have a story to tell. Buyers
        who skip steps usually have a long one.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For sourcing clients we run the proper sequence
        on every transaction and refuse to short-cut
        on any of the diligence above. The premium on
        professional service is small relative to the
        cost of any one of the mistakes above.
      </P>

      <P>
        Read also our pieces on{" "}
        <Link
          href="/insights/top-property-scams-kenya-2026-watchlist"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the top property scams watchlist
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/first-time-home-buyer-kenya-complete-guide-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the first-time buyer guide
        </Link>{" "}
        for the wider context.
      </P>
    </>
  );
}
