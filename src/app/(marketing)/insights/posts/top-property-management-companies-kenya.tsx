import Link from "next/link";
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
import { authors, type PostMeta } from "./_shared";

export const meta: PostMeta = {
  slug: "top-property-management-companies-kenya",
  title:
    "Top property management companies in Kenya: how to read the lists",
  description:
    "There are a lot of top ten lists for property management in Kenya and very few of them disclose who wrote them or on what basis. What to check before trusting one, the criteria that genuinely separate firms in this market, and how to assemble a shortlist that fits your particular property.",
  metaTitle: "Top Property Management Companies in Kenya",
  metaDescription:
    "Why the top 10 property management lists for Kenya are unreliable, the criteria that actually separate firms, and how to build your own shortlist.",
  publishedAt: "2026-09-09",
  readingMinutes: 10,
  author: authors.research,
  tags: [
    "Property Management",
    "Landlord",
    "Kenya",
    "Nairobi",
    "Choosing an Agent",
    "Diaspora",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Comparing property management companies in Kenya",
};

export default function Article() {
  return (
    <>
      <Lede>
        We are a property management company, so we are not going to hand you a
        ranked list of our competitors and pretend it is impartial. What we can
        do is something more useful: explain how to read the lists you will
        find, set out the criteria that actually distinguish firms in this
        market, and give you a method that produces a shortlist fitting your
        property rather than somebody&rsquo;s marketing budget.
      </Lede>

      <H2 id="why-lists-fail">Four things to check on any list you find</H2>

      <P>
        Most &quot;top ten property management companies in Kenya&quot; pages
        are content marketing, and that is not a scandal, it is just a fact
        about how they came to exist. Four quick checks tell you how much
        weight a given list can carry.
      </P>

      <OL>
        <LI>
          <strong>Who published it, and are they on it?</strong> The most
          common pattern is a list produced by a firm that appears somewhere in
          it, usually near the top. Not dishonest exactly, but it is an
          advertisement wearing the clothes of a survey. Check the footer and
          the about page.
        </LI>
        <LI>
          <strong>Are the criteria stated?</strong> A list that says what it
          measured, whether that is units under management, years trading or
          client retention, is making a claim you can interrogate. One that
          just asserts an order is expressing a preference.
        </LI>
        <LI>
          <strong>Is it dated, and is it maintained?</strong> Property
          management is a business where firms change hands, lose key staff and
          quietly stop taking new work. A list from three years ago is a
          historical document, and several of the names on it may no longer
          operate the way they did.
        </LI>
        <LI>
          <strong>Does it distinguish by segment?</strong> This is the failure
          that matters most and almost none of them address it. The firm best
          equipped to run a forty unit block with a service charge budget and a
          borehole is very unlikely to be the right choice for a single
          furnished two bedroom in Kilimani let to a diaspora owner. A single
          ranking implies one axis of quality, and there isn&rsquo;t one.
        </LI>
      </OL>

      <Pullquote>
        There is no best property management company in Kenya. There is a best
        one for a specific property, a specific owner and a specific letting
        strategy.
      </Pullquote>

      <H2 id="segments">Work out which segment you are in first</H2>

      <P>
        Before comparing anybody, place your property. The four segments below
        need genuinely different firms, and mixing them up is the most common
        reason a competent manager and a reasonable landlord end up unhappy
        with each other.
      </P>

      <UL>
        <LI>
          <strong>Single residential unit, owner resident in Kenya.</strong>
          You need tenant finding and a light touch. Full management is often
          not worth the fee, as{" "}
          <Link
            href="/insights/do-i-need-a-property-manager-nairobi"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            do you actually need a property manager
          </Link>{" "}
          works through.
        </LI>
        <LI>
          <strong>Single or few units, owner abroad.</strong> The binding
          constraint is communication across time zones and somebody physically
          attending. Reporting quality and response time matter more than
          scale.
        </LI>
        <LI>
          <strong>Whole blocks and commercial.</strong> Service charge
          administration, sinking funds, plant maintenance and statutory
          compliance. A different discipline, and firms that do this well are
          often poor at the individual diaspora landlord.
        </LI>
        <LI>
          <strong>Short let and Airbnb.</strong> A hospitality operation, not a
          letting one. Covered separately in{" "}
          <Link
            href="/insights/choosing-airbnb-management-company-nairobi"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            choosing an Airbnb management company
          </Link>
          .
        </LI>
      </UL>

      <H2 id="criteria">The criteria that actually separate firms here</H2>

      <P>
        These are the axes on which Kenyan managing agents genuinely differ,
        as opposed to the ones they all claim. Each is checkable before you
        sign.
      </P>

      <OL>
        <LI>
          <strong>Whether the fee is on rent collected or rent due.</strong>
          The clearest single dividing line in the market, because it decides
          who carries a defaulting tenant.
        </LI>
        <LI>
          <strong>Where client money sits.</strong> A designated client
          account, separate from the firm&rsquo;s trading account, versus rent
          paid into the operating account. This decides what you recover if the
          firm fails while holding two months of your income.
        </LI>
        <LI>
          <strong>Whether anyone physically inspects, and writes it up.</strong>
          Ask for a name, a frequency, and what the last inspection on a
          comparable unit found. This is where remote owners are most often
          quietly failed.
        </LI>
        <LI>
          <strong>Whether terms are published or quoted on a call.</strong> A
          published fee is a claim that can be compared. A quote after a
          discovery call is a price set with reference to you.
        </LI>
        <LI>
          <strong>Whether there are consequences or only promises.</strong>
          Response times and payout dates are worth little without an agreed
          consequence attached. The presence of one is a decent proxy for
          whether the firm expects to be held to anything.
        </LI>
        <LI>
          <strong>Who handles the MRI filing, and whether you see the
          receipt.</strong> Withholding the 7.5 percent and actually remitting
          it are different acts and only one leaves a trace.
        </LI>
        <LI>
          <strong>Manager-to-property ratio.</strong> Rarely disclosed, highly
          predictive, and there is a number past which the inspection in point
          three cannot physically be happening.
        </LI>
      </OL>

      <P>
        The full set of questions built from these, with our own answers next
        to them, is in{" "}
        <Link
          href="/insights/questions-to-ask-a-property-manager-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the questions to ask a property manager
        </Link>
        .
      </P>

      <H2 id="build-your-own">Building the shortlist</H2>

      <P>
        Assemble names from sources with evidence behind them rather than from
        a ranking. The best-run building near you, the other landlords in your
        block, and property advocates who see the aftermath of bad management
        are all better starting points than a list. Those routes are set out in
        detail in{" "}
        <Link
          href="/insights/how-to-find-a-property-manager-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to find a property manager in Nairobi
        </Link>
        , which also includes a one page brief to send to everyone you
        shortlist so the replies are actually comparable.
      </P>

      <Callout title="Three names, one written brief">
        Shortlist three, send all three the same brief, and insist on written
        answers. Phone quotes cannot be compared and neither party remembers
        them accurately. The firm that answers all of it has told you
        something; so has the firm that answers half and asks for a call.
      </Callout>

      <H2 id="are-we-on-it">Are we on the list?</H2>

      <P>
        We would be on a list of firms that publish their terms, and we should
        be honest about where we would not belong. We are built for the
        individual landlord, resident or abroad, with one to a handful of
        residential units in Nairobi. That is what our reporting, our payout
        mechanics and our USD remittance are designed around.
      </P>

      <P>
        We are not the right firm for a forty unit block needing service charge
        administration and a sinking fund, or for commercial and retail space.
        Those are genuinely different disciplines and there are Nairobi firms
        that have done them for decades. If that is your property, a specialist
        will serve you better than we would, and we would rather say so here
        than after you had signed.
      </P>

      <P>
        Where we do compete: 10 percent of collected rent for long-term
        management, 20 percent of revenue for short let, no setup fee, no
        contractor commission, no letting fee at renewal, nothing payable to
        leave, and written consequences behind the response time and the payout
        date rather than a service description. All of it is on{" "}
        <Link
          href="/pricing"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the pricing page
        </Link>{" "}
        so you can compare it against anyone without speaking to us.
      </P>

      <Callout title="Compare us properly">
        Send us your property and what you want, and we will answer in writing
        with a figure for that specific unit. Put the same brief to two others
        and read the three replies side by side. That is a better basis than
        any ranking, including one we wrote.
      </Callout>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/property-management-agreement-kenya-clause-by-clause"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the management agreement clause by clause
        </Link>
        {", "}
        <Link
          href="/insights/cost-of-property-management-kenya-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what management costs in Kenya
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/should-i-fire-my-nairobi-property-manager-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          whether to leave the manager you have
        </Link>
        .
      </P>
    </>
  );
}
