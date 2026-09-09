import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  LI,
  Lede,
  OL,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "how-much-do-airbnb-managers-charge-kenya",
  title: "How much do Airbnb managers charge in Kenya?",
  description:
    "The headline percentage is the least important part of the quote. What the fee is charged on, what it excludes, and how Airbnb own service fee fits alongside it, worked through with the arithmetic set out.",
  metaDescription:
    "Airbnb management in Kenya runs 15 to 25 percent of revenue. What the fee is charged on, what it excludes, and the arithmetic that decides.",
  publishedAt: "2026-09-09",
  readingMinutes: 9,
  author: authors.editors,
  tags: [
    "Airbnb",
    "Fees",
    "Property Management",
    "Nairobi",
    "Short Let",
    "Kenya",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Calculating Airbnb management fees for a Nairobi short let",
};

export default function Article() {
  return (
    <>
      <Lede>
        Full Airbnb management in Nairobi runs between 15 and 25 percent of
        revenue. Our own fee is 20 percent. That is the answer to the question
        as asked, and it is very nearly useless on its own, because two
        operators quoting the same percentage can take materially different
        amounts of money out of the same unit. What decides it is the basis the
        percentage is applied to and the list of things the fee does not cover.
      </Lede>

      <H2 id="what-is-an-airbnb-management-fee">
        What is an Airbnb management fee?
      </H2>

      <P>
        It is the recurring charge for operating the listing: pricing it,
        filling it, communicating with guests, arranging the changeover clean,
        handling maintenance between stays and accounting for the money. It is
        charged as a percentage of what the unit earns rather than as a flat
        monthly amount, because the work scales with the number of stays.
      </P>

      <P>
        It is not the same thing as the fee Airbnb itself charges, and the two
        are frequently confused. They stack.
      </P>

      <UL>
        <LI>
          <strong>Airbnb host service fee.</strong> Most individual hosts are on
          the shared structure, where the host pays roughly 3 percent of the
          booking subtotal and the guest pays a separate service fee on top.
          There is also a host-only structure, nearer 15 percent, which applies
          to hotels and to some listings connected through channel software.
          Check which one your listing is on, because it changes the arithmetic
          considerably.
        </LI>
        <LI>
          <strong>Your manager fee.</strong> The 15 to 25 percent. Charged on a
          basis you need to establish, discussed below.
        </LI>
        <LI>
          <strong>Cleaning.</strong> Usually recovered from the guest cleaning
          fee, sometimes not fully. Ask what happens in the months when it does
          not cover the cost.
        </LI>
      </UL>

      <H2 id="percentage-of-what">
        A percentage of what? The question that actually decides it
      </H2>

      <P>
        This is the part worth reading twice. There are three common bases and
        the difference between them is larger than the difference between a 15
        and a 20 percent headline rate.
      </P>

      <OL>
        <LI>
          <strong>Gross booking value.</strong> Everything the guest paid,
          including the cleaning fee they were charged and before the platform
          takes its cut. The largest of the three numbers, so a percentage of it
          is the largest fee.
        </LI>
        <LI>
          <strong>Revenue after platform commission.</strong> What Airbnb
          actually paid out. Smaller, and the more common professional basis.
        </LI>
        <LI>
          <strong>Revenue after platform commission and cleaning.</strong> The
          smallest base, and the one that most closely tracks what the operation
          earned rather than what it billed.
        </LI>
      </OL>

      <P>
        Take an illustrative month, with a round figure chosen for clean
        arithmetic rather than as a claim about what any particular unit earns.
        Suppose the guest paid USD 2,000 in total, of which USD 200 was the
        cleaning fee, and the platform retained 3 percent of the USD 1,800
        accommodation subtotal.
      </P>

      <UL>
        <LI>
          <strong>20 percent of gross booking value</strong> is 20 percent of
          USD 2,000, so USD 400.
        </LI>
        <LI>
          <strong>20 percent of revenue after platform commission</strong> is 20
          percent of about USD 1,946, so roughly USD 389.
        </LI>
        <LI>
          <strong>20 percent after commission and cleaning</strong> is 20
          percent of about USD 1,746, so roughly USD 349.
        </LI>
      </UL>

      <P>
        Fifty dollars a month between the widest and narrowest basis, on the
        same headline rate, which is six hundred a year on one unit. Now
        compare a 15 percent quote on gross, at USD 300, against a 20 percent
        quote after commission and cleaning, at USD 349. The cheaper looking
        rate is the more expensive one in some months and the less expensive one
        in others, depending entirely on how heavily the cleaning fee features.
        Nobody can tell you which is better from the percentages alone.
      </P>

      <Pullquote>
        Ask for the fee as a shilling figure against last month actual
        bookings, not as a percentage. It takes an operator ten minutes and it
        removes every ambiguity at once.
      </Pullquote>

      <H2 id="what-the-fee-excludes">What the fee does not cover</H2>

      <P>
        The exclusions are where quotes diverge most, and they are rarely
        volunteered. Establish each of these in writing.
      </P>

      <UL>
        <LI>
          <strong>Cleaning and laundry.</strong> Nearly always separate. Ask the
          per changeover cost and who absorbs the shortfall when the guest fee
          does not meet it.
        </LI>
        <LI>
          <strong>Consumables and linen replacement.</strong> Small monthly
          amounts that add up, and a common place for an unadvertised markup.
        </LI>
        <LI>
          <strong>Maintenance and repairs.</strong> Ask whether they charge a
          coordination fee on top of the vendor invoice, and ask to see the
          vendor invoice itself rather than a summary.
        </LI>
        <LI>
          <strong>Listing setup and photography.</strong> Sometimes a one off
          charge, sometimes absorbed.
        </LI>
        <LI>
          <strong>VAT.</strong> Ask whether the quoted percentage is inclusive
          or exclusive of VAT. On a 20 percent fee this is not a rounding
          difference, and it is the single most common reason a first invoice
          surprises somebody.
        </LI>
        <LI>
          <strong>Statutory filings.</strong> Whether they handle the rental
          income position with KRA, or leave it with you. Covered in{" "}
          <Link
            href="/insights/airbnb-tax-kenya-2026-host-guide"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            our guide to Airbnb tax in Kenya
          </Link>
          .
        </LI>
      </UL>

      <H2 id="per-month">
        Do Airbnb managers charge per month or per booking?
      </H2>

      <P>
        Percentage of revenue is the norm, and it is the structure that aligns
        best: if the unit earns nothing, the manager earns nothing, so the
        incentive to fill the calendar is real. You will also encounter two
        others.
      </P>

      <UL>
        <LI>
          <strong>A flat monthly retainer.</strong> Rare for short lets and
          usually a bad trade for the owner, because it pays the same in a full
          December and an empty February.
        </LI>
        <LI>
          <strong>Guaranteed rent.</strong> A fixed monthly amount regardless of
          bookings. Genuinely attractive if you value certainty, and you are
          handing over the upside to somebody who has priced the guarantee to be
          profitable at an occupancy they are confident of beating. Read the
          clause covering what happens if they hand the unit back mid term,
          because that is where the risk actually sits.
        </LI>
      </UL>

      <Callout title="Below ten percent, ask harder">
        Anyone quoting under about 10 percent for genuinely full short let
        management is either not doing the work or is making the margin
        somewhere you cannot see it. The usual places are cleaning charged to
        the guest at more than it costs, and a quiet markup on every repair. A
        low headline rate with an opaque cost stack is more expensive than a
        higher rate with receipts.
      </Callout>

      <H2 id="what-the-fee-should-earn">What the fee has to earn back</H2>

      <P>
        A management fee is only expensive if it does not pay for itself, and
        the honest test is not the percentage but the counterfactual. Twenty
        percent has to be recovered from some combination of the following, or
        it is not worth paying.
      </P>

      <UL>
        <LI>
          Better pricing. Most self managed listings are priced once at launch
          and then left, which in a market with a real high and low season is
          where the largest single loss sits.
        </LI>
        <LI>
          Higher occupancy, through faster response times and a review score
          that holds. Response speed is a ranking input, not just a courtesy.
        </LI>
        <LI>
          Fewer voids from cancellations handled badly or changeovers that were
          not covered.
        </LI>
        <LI>
          Lower maintenance costs from vendors used repeatedly rather than found
          in an emergency at an emergency price.
        </LI>
        <LI>
          Your own time, which is a real cost even though it never appears on a
          statement.
        </LI>
      </UL>

      <P>
        If a manager cannot articulate which of those they expect to move on
        your specific unit, the fee is a subscription rather than a service.
        Realistic occupancy assumptions to test any projection against are in{" "}
        <Link
          href="/insights/airbnb-nairobi-occupancy-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          our Nairobi occupancy piece
        </Link>
        , and the full cost stack behind a net figure is in{" "}
        <Link
          href="/insights/how-much-can-you-earn-airbnb-nairobi-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what you can actually earn from a Nairobi Airbnb
        </Link>
        .
      </P>

      <H2 id="goldstay-fee">What we charge</H2>

      <P>
        Twenty percent of revenue for Airbnb and short-stay management, and 10
        percent of collected rent for long-term management. Expenses above USD
        50 come with a receipt and anything above USD 250 is approved by you
        first. Notice is 30 days with no exit fee. The listing stays in your
        name, and the records come with you when you go. The full terms and the
        reasoning behind them are on our{" "}
        <Link
          href="/pricing"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          pricing page
        </Link>
        .
      </P>

      <Callout title="Get the fee as a real number, from us or anyone">
        Send us the building, the bedroom count and what the unit billed last
        month, and we will send back what our fee would have been on those
        actual bookings, in shillings, with the basis shown. Put the same
        request to everyone you are considering and the comparison stops being
        guesswork.{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Send us the unit
        </Link>{" "}
        or read what is included in{" "}
        <Link
          href="/airbnb-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Airbnb management in Nairobi
        </Link>
        .
      </Callout>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/someone-to-manage-my-airbnb-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          handing a Nairobi Airbnb over
        </Link>
        ,{" "}
        <Link
          href="/insights/airbnb-co-host-nairobi-what-they-do"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what an Airbnb co-host does
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/cost-of-property-management-kenya-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the cost of property management in Kenya
        </Link>
        .
      </P>
    </>
  );
}
