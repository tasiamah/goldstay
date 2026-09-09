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
  slug: "do-i-need-a-property-manager-nairobi",
  title:
    "Do you actually need a property manager in Nairobi?",
  description:
    "Plenty of Nairobi landlords are paying for management they do not need, and a smaller number are saving a fee that is costing them multiples of it. The cases where self-managing genuinely wins, the cases where it does not, and the arithmetic that separates them.",
  metaTitle: "Do I Need a Property Manager in Nairobi?",
  metaDescription:
    "When a Nairobi landlord genuinely needs a property manager, when self-managing wins, and the arithmetic the fee has to earn back.",
  publishedAt: "2026-09-09",
  readingMinutes: 10,
  author: authors.research,
  tags: [
    "Property Management",
    "Landlord",
    "Nairobi",
    "Diaspora",
    "Yield",
    "Kenya",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Nairobi landlord deciding whether to hire a property manager",
};

export default function Article() {
  return (
    <>
      <Lede>
        We are a management company, so treat what follows accordingly. But we
        turn work away most months, usually from landlords whose situation does
        not need us, and it is worth writing down why. A fee paid for
        management you could do yourself in an hour a month is a straight
        deduction from your yield. A fee avoided on a property that genuinely
        needs managing tends to cost several times what the fee would have
        been.
      </Lede>

      <H2 id="short-answer">The short answer</H2>

      <P>
        It turns on three things, and none of them is the size or value of the
        property: how far away you are, whether the let is long-term or
        nightly, and how many units you have. If you live in Nairobi, own one
        flat, and it is let long-term to a tenant who pays, you probably do not
        need a manager. Change any one of those three and the answer starts to
        move.
      </P>

      <Pullquote>
        Distance and letting type decide this. Not the value of the property,
        which is what most people think they are deciding on.
      </Pullquote>

      <H2 id="do-not-need">When you genuinely do not need one</H2>

      <P>
        These are the cases where we would tell you to keep your money, and
        where taking you on would be selling you something you do not need.
      </P>

      <UL>
        <LI>
          <strong>You live in Nairobi and own one long-let unit with a sitting
          tenant.</strong> The work is a bank transfer to reconcile, a KRA
          filing, and two or three maintenance calls a year. That is an hour a
          month, and at 10 percent of a decent Kilimani rent you would be
          paying well over a thousand dollars a year for that hour.
        </LI>
        <LI>
          <strong>Your tenant is a long-standing one who pays on time.</strong>
          The largest single thing a manager does is stand between you and
          tenant problems. If you do not have tenant problems, you are buying
          insurance against a risk that has not materialised in years.
        </LI>
        <LI>
          <strong>You let to a corporate or an institution on a full repairing
          lease.</strong> Where the tenant maintains the unit and pays reliably
          by standing order, there is very little left to manage.
        </LI>
        <LI>
          <strong>You are in Nairobi and genuinely enjoy it.</strong> Some
          landlords like knowing their building, their caretaker and their
          tenant. That is a real advantage and no manager reproduces it.
        </LI>
      </UL>

      <P>
        In three of those four cases, the thing actually worth buying is not
        management. It is a one-off tenant find when the current tenant leaves,
        which is a different and much cheaper transaction.
      </P>

      <H2 id="do-need">When you almost certainly do</H2>

      <OL>
        <LI>
          <strong>You are outside Kenya.</strong> This is the big one, and the
          reason is not admin. It is that every problem in a Nairobi property
          is solved by somebody physically turning up, and that somebody cannot
          be you at short notice from Dubai. A caretaker who reports to nobody
          is not a substitute, and a relative doing you a favour is a
          relationship you are quietly spending.
        </LI>
        <LI>
          <strong>The unit is on Airbnb or let nightly.</strong> Short-stay is
          not a lighter version of long-let, it is a hospitality operation:
          guest messages at all hours, turnover cleans between stays, pricing
          that has to move weekly, and a review score that punishes every miss
          permanently. Self-managing this remotely is not difficult so much as
          incompatible with having a job.
        </LI>
        <LI>
          <strong>You have three or more units.</strong> At that point the
          arithmetic reverses. The fee stops competing with your spare time and
          starts competing with the cost of the voids, arrears and deferred
          maintenance that accumulate when nobody is systematically
          responsible.
        </LI>
        <LI>
          <strong>You are already in arrears or in dispute.</strong> If the
          tenant has stopped paying and you are abroad, the practical question
          is who attends, serves notice and appears at the tribunal. It is not
          a question you can answer with an app.
        </LI>
        <LI>
          <strong>The property is empty and has been for a while.</strong> A
          void is the most expensive state a property can be in, and it usually
          persists because nobody is showing the unit to anybody.
        </LI>
      </OL>

      <H2 id="arithmetic">The arithmetic the fee has to earn back</H2>

      <P>
        Take a well-finished two-bedroom in Kilimani let long-term at USD 1,500
        a month, which is the example we use on{" "}
        <Link
          href="/pricing"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          our pricing page
        </Link>
        . At 10 percent the management fee is USD 150 a month, so USD 1,800
        over a year. That is the number the manager has to earn back before
        they have done anything for you at all.
      </P>

      <P>
        Set against it, one avoided month of void is worth USD 1,500 on its
        own, which very nearly covers the annual fee from a single event. A
        second avoided void month covers it twice over. That is the whole case
        in one line, and it is why the calculation is so different for a
        landlord whose flat sits empty for two months between tenants than for
        one whose tenant has been in place for four years.
      </P>

      <P>
        The other side of the ledger is worth being equally honest about. If
        your unit does not go void, your tenant pays, and nothing breaks, the
        manager has earned the fee by doing the admin and being available. That
        is a real service and for a landlord abroad it is often worth USD 1,800.
        For a landlord in Kilimani with a spare hour a month, it is not.
      </P>

      <Callout title="The test we would apply">
        Count the months in the last three years that the property was empty,
        and the months the rent arrived late or not at all. Multiply by the
        monthly rent. If that number is larger than three years of management
        fees, the fee is not your problem and never was.
      </Callout>

      <H2 id="airbnb">The Airbnb question is a different question</H2>

      <P>
        Short-stay management runs 15 to 25 percent of revenue rather than 8 to
        15 percent of rent, so the fee is materially larger and the honest
        threshold is higher. What justifies it is that the work is genuinely
        continuous and that the manager is being paid to move a number you can
        see: occupancy and nightly rate. A long-let manager mostly protects
        against downside. A short-let manager is expected to produce upside,
        and you can hold them to it monthly.
      </P>

      <P>
        The version of this that almost never works is the owner abroad
        self-managing a Nairobi Airbnb through a cleaner and a WhatsApp group.
        It works for a few months, the review score erodes, and the listing
        drops down the rankings in a way that is slow and expensive to reverse.
        What that looks like in practice is set out in{" "}
        <Link
          href="/insights/why-nairobi-airbnb-hosts-losing-money-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          why Nairobi Airbnb hosts are losing money
        </Link>
        .
      </P>

      <H2 id="middle-option">The middle option nobody offers you</H2>

      <P>
        The choice is usually presented as full management or nothing, and for
        a lot of Nairobi landlords the right answer sits between them. Tenant
        finding on its own is a one-time fee of one month&rsquo;s rent: we
        market the unit, vet the applicants, verify employment and previous
        landlords, draw the tenancy and hand you a tenant. After that you
        manage, because you live here and it is an hour a month.
      </P>

      <P>
        That is the arrangement we would recommend to most resident landlords
        with one flat, and we say so knowing it earns us a fraction of what
        management would. It is also the arrangement that most reliably turns
        into management later, when the second unit arrives or the landlord
        moves abroad.
      </P>

      <H2 id="what-we-would-say">What we would tell you</H2>

      <P>
        If you are in Nairobi with one long-let unit and a tenant who pays: do
        not hire us, and call us when the tenant leaves. If you are abroad, or
        running nightly lets, or holding three or more units, or currently in
        arrears or sitting on a void: the fee is very likely the cheapest line
        in your P and L, and the question is which manager rather than whether.
      </P>

      <P>
        If it is the second, the next thing to read is{" "}
        <Link
          href="/insights/questions-to-ask-a-property-manager-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the questions to ask before you sign
        </Link>
        , which includes our own answers so you can compare us against whoever
        else you are considering.
      </P>

      <Callout title="Tell us the situation and we will tell you honestly">
        Send us the unit, where you live and how it is let. If the answer is
        that you do not need a manager, that is what you will get back, and it
        is the answer we give more often than people expect.
      </Callout>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/cost-of-property-management-kenya-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what management costs in Kenya
        </Link>
        {", "}
        <Link
          href="/insights/property-management-nairobi-what-you-actually-get-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what management actually gets you
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/why-property-management-matters-diaspora-landlords"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          why it matters more for diaspora landlords
        </Link>
        . If the answer turned out to be yes,{" "}
        <Link
          href="/insights/how-to-find-a-property-manager-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to find a property manager in Nairobi
        </Link>{" "}
        covers where to look.
      </P>
    </>
  );
}
