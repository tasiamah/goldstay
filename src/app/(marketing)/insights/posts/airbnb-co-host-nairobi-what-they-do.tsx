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
  slug: "airbnb-co-host-nairobi-what-they-do",
  title:
    "What an Airbnb co-host does, and how to find one in Nairobi",
  description:
    "The word most Nairobi owners are reaching for is co-host. What the role covers, how a co-host gets paid, why it keeps the listing and the reviews in your name, and how to find one who will actually answer at midnight.",
  metaTitle: "Airbnb Co-Host in Nairobi: What They Do",
  metaDescription:
    "What an Airbnb co-host does, how co-host payouts work, and how to find one in Nairobi without losing your listing or reviews.",
  publishedAt: "2026-09-08",
  readingMinutes: 9,
  author: authors.editors,
  tags: [
    "Airbnb",
    "Co-Hosting",
    "Property Management",
    "Nairobi",
    "Short Let",
    "Kenya",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Airbnb co-host managing a short let apartment in Nairobi",
};

export default function Article() {
  return (
    <>
      <Lede>
        Most owners who come to us do not arrive with the word
        &quot;co-host&quot;. They arrive with a sentence: I have an apartment on
        Airbnb, I cannot keep doing this, is there someone who can run it for
        me. Co-host is the term for that someone, and it is worth understanding
        properly, because the difference between a co-host and a management
        company that takes over your listing is the difference between keeping
        two years of reviews and starting again from zero.
      </Lede>

      <H2 id="what-is-a-co-host">What is a co-host on Airbnb?</H2>

      <P>
        A co-host is a person or company you add to your own listing, with
        permissions you control, who runs the day to day of it. The listing
        stays on your account. The reviews accrue to you. The payout still
        lands in the bank account you nominated. What changes is who answers
        the messages, who meets the guest, who schedules the cleaner and who
        deals with the shower that stops working on a Sunday.
      </P>

      <P>
        That is the structural point and it is the one most owners miss. There
        are two quite different arrangements sold under similar language:
      </P>

      <UL>
        <LI>
          <strong>Co-hosting.</strong> Your listing, your account, your review
          history. Someone else operates it on your behalf.
        </LI>
        <LI>
          <strong>Full letting to an operator.</strong> The unit is listed on
          the operator account. They hold the listing, the reviews and often
          the guest payments. You receive a monthly figure from them.
        </LI>
      </UL>

      <P>
        Both can be run honestly and both are common in Nairobi. But only one
        of them leaves you with a transferable asset at the end of it. If you
        spend two years building a 4.9 rating and ninety reviews, and all of
        that sits on somebody else account, then your negotiating position on
        the fee is weaker every year rather than stronger, and the day you
        leave you are a brand new listing again.
      </P>

      <Pullquote>
        Ask whose account the listing sits on. It is a one sentence question
        and it decides whether the review history you spend two years building
        is yours or theirs.
      </Pullquote>

      <H2 id="what-does-a-co-host-do">What does an Airbnb co-host do?</H2>

      <P>
        In practice the job is a rota, not a task list. A long let manager
        deals with a handful of events a year. Short let work generates several
        a week, and most of them are time sensitive.
      </P>

      <UL>
        <LI>
          Listing setup and copy, photography coordination, and keeping the
          calendar synced if the unit sits on more than one platform
        </LI>
        <LI>
          Pricing, revisited continuously rather than set once at launch
        </LI>
        <LI>
          Guest enquiries and booking approvals, including the vetting decision
          on a request that does not look right
        </LI>
        <LI>
          Check in and check out, which in Nairobi frequently means a late
          arrival off a delayed flight and a guest who cannot work the gate
        </LI>
        <LI>
          Cleaning and laundry scheduled around back to back stays, plus the
          contingency when a cleaner does not turn up
        </LI>
        <LI>
          Consumables, linen replacement and inventory tracking
        </LI>
        <LI>
          Maintenance, including the repairs that have to happen while a guest
          is still in the unit
        </LI>
        <LI>
          Reviews, damage claims, and the occasional guest who has to be asked
          to leave
        </LI>
        <LI>
          Monthly reporting: what came in, what went out, what you are owed
        </LI>
      </UL>

      <P>
        A co-host who does the first two and none of the rest is a pricing
        consultant with a generous job title. Establish which of the list above
        is actually included before you agree a percentage, because the range
        of things people mean by co-hosting is enormous.
      </P>

      <H2 id="how-co-hosts-get-paid">How does a co-host get paid on Airbnb?</H2>

      <P>
        There are three arrangements you will encounter, and they have
        genuinely different consequences if the relationship ends badly.
      </P>

      <OL>
        <LI>
          <strong>A co-host payout split set inside Airbnb.</strong> Airbnb lets
          the host allocate a co-host a percentage of each reservation, or a
          fixed amount per booking, and pays it to them directly. The
          attraction is that nothing is owed between you: each payout is split
          at source, so there is no invoice, no arrears and no argument about
          what was collected.
        </LI>
        <LI>
          <strong>An invoice against a monthly statement.</strong> The full
          payout reaches you and the co-host bills their percentage afterwards
          against a statement of the month. This is how most management
          companies operate, including us, because it also has to account for
          direct bookings and for costs the platform knows nothing about.
        </LI>
        <LI>
          <strong>The operator collects and remits to you.</strong> Guest money
          lands with them and they send you the balance. This is the
          arrangement to look at hardest. Ask what happens to money held on
          your behalf if the company fails, and what happens to a booking
          already paid for a stay that falls after your notice period ends.
        </LI>
      </OL>

      <P>
        None of these is inherently wrong. The first is the cleanest for a
        single unit with all bookings on one platform. The second is
        unavoidable once there are direct bookings, cleaning costs and repairs
        in the picture, which is to say once the operation is real.
      </P>

      <Callout title="The question that reveals the most">
        Ask to see a real monthly statement with the owner details removed. If
        one exists as a standard document, the reporting is systematic. If the
        answer is a promise to send you a summary, you will spend the next two
        years reconstructing your own numbers from screenshots, and you will
        never quite know what the fee bought.
      </Callout>

      <H2 id="find-a-co-host">
        How to find a co-host for your Airbnb in Nairobi
      </H2>

      <P>
        Airbnb runs its own co-host directory in a number of markets, which is
        the thing people are looking for when they search for &quot;find a
        co-host&quot;. Coverage varies a great deal by city, and depth in
        Nairobi is thin enough that most owners here end up looking outside it.
        The realistic sources are word of mouth in your own building, the
        management companies that advertise short let work, and asking whoever
        cleans for you already who else they clean for.
      </P>

      <P>
        Whichever route you take, the filtering questions are the same, and
        they are mostly about capacity rather than enthusiasm:
      </P>

      <OL>
        <LI>
          <strong>Whose account does the listing sit on?</strong> Covered above,
          and worth asking first because the answer changes everything else.
        </LI>
        <LI>
          <strong>How many units does one coordinator handle?</strong> Attention
          is arithmetic. Past a certain ratio your unit gets whatever is left
          over at the end of the day.
        </LI>
        <LI>
          <strong>Who answers a guest at eleven at night, and who covers when
          that person is asleep or on leave?</strong> One person with a phone is
          not a rota, however committed they are.
        </LI>
        <LI>
          <strong>What can you spend without asking me?</strong> There should be
          a number, and a higher number above which you approve in writing.
        </LI>
        <LI>
          <strong>What is the notice period?</strong> Short let work is monthly
          work and the commitment should be monthly too. Long lock ins in this
          business are a red flag rather than a sign of seriousness.
        </LI>
        <LI>
          <strong>Can I see my own calendar and pricing?</strong> If you cannot
          see your occupancy you cannot tell whether the fee is earning
          anything.
        </LI>
      </OL>

      <P>
        On price, full short let management in Nairobi generally runs between
        15 and 25 percent of revenue, and the spread reflects real differences
        in what is included. We set out the arithmetic, and what the percentage
        is charged on, in{" "}
        <Link
          href="/insights/how-much-do-airbnb-managers-charge-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how much Airbnb managers charge in Kenya
        </Link>
        .
      </P>

      <H2 id="removing-a-co-host">How to remove a co-host from Airbnb</H2>

      <P>
        Worth knowing before you need it. Where the arrangement is a genuine
        co-hosting one, removal is an administrative act in your listing
        settings: you withdraw the permissions and any payout split, and the
        listing, the calendar and the review history remain yours. The practical
        work is the handover, which means recovering keys and access codes,
        redirecting the cleaner and confirming who is honouring bookings already
        taken for dates after the change.
      </P>

      <P>
        Where the unit was listed on somebody else account, removal is not
        administrative at all. You are closing one listing and opening another,
        and the reviews do not travel. This is the cost of the arrangement, and
        it is not visible on the day you sign up. It becomes visible on the day
        you want to leave, which is exactly when you have the least leverage.
      </P>

      <H2 id="is-a-co-host-worth-it">When a co-host is not worth it</H2>

      <P>
        Self managing is genuinely right for some owners and it would be
        dishonest of us to pretend otherwise. It works if you live in Nairobi,
        have one unit, can answer a phone at unsociable hours and have a
        cleaner you trust completely. In that situation the fee is a real
        saving, and the honest advice is to keep doing it.
      </P>

      <P>
        It stops working when you are abroad and cannot meet a guest, when you
        pass roughly two units, when your job does not tolerate interruption,
        or when you notice you have started to resent the guests. That last one
        is the reliable signal and it shows up in the reviews within a month.
      </P>

      <H2 id="how-goldstay-works">How Goldstay co-hosts</H2>

      <P>
        We act as co-host on units in Westlands, Kilimani, Riverside,
        Kileleshwa and the surrounding areas. The listing stays in your name
        and the reviews stay with you, which we do on purpose: it keeps the
        pressure on us to earn the renewal rather than to rely on holding your
        asset. Our fee is 20 percent of revenue. Expenses above USD 50 come
        with a receipt, anything above USD 250 is approved by you first, notice
        is 30 days with no exit fee, and the records come with you when you go.
      </P>

      <Callout title="Want a straight read on your unit?">
        Tell us the building, the bedroom count and what it is earning now, and
        we will tell you what we think it should be doing and whether we would
        take it on. We turn units down when the numbers do not work, because
        taking one that cannot succeed damages our own figures.{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Send us the details
        </Link>{" "}
        or read what is included in our{" "}
        <Link
          href="/airbnb-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Airbnb management service in Nairobi
        </Link>
        .
      </Callout>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/someone-to-manage-my-airbnb-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what happens when you hand a Nairobi Airbnb over
        </Link>
        ,{" "}
        <Link
          href="/insights/choosing-airbnb-management-company-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to choose an Airbnb management company
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/airbnb-nairobi-occupancy-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what Nairobi occupancy actually looks like
        </Link>
        .
      </P>
    </>
  );
}
