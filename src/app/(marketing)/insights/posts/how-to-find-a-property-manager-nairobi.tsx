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
  slug: "how-to-find-a-property-manager-nairobi",
  title:
    "How to find a property manager in Nairobi",
  description:
    "Searching for a managing agent produces advertising, and advertising is the worst available signal for a business whose whole product is reliability. The six places Nairobi landlords actually find good managers, and the one-page brief to send the three you shortlist.",
  metaTitle: "How to Find a Property Manager in Nairobi",
  metaDescription:
    "The six places Nairobi landlords actually find a good property manager, where not to look, and the brief to send your shortlist.",
  publishedAt: "2026-09-09",
  readingMinutes: 10,
  author: authors.editors,
  tags: [
    "Property Management",
    "Landlord",
    "Nairobi",
    "Choosing an Agent",
    "Diaspora",
    "Kenya",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Finding a property manager in Nairobi",
};

export default function Article() {
  return (
    <>
      <Lede>
        The difficulty with finding a managing agent is that searching for one
        surfaces whoever spends most on being found, and spending on marketing
        correlates with almost nothing you care about. The product here is
        reliability over years, and reliability does not advertise well. What
        follows is where landlords who ended up happy actually looked.
      </Lede>

      <H2 id="order">The short answer</H2>

      <P>
        Work from evidence you can see towards claims you have to take on
        trust. That means starting with buildings and people already in front
        of you, and finishing with firms whose only evidence is their own
        website. Almost everybody does this in the opposite order, which is
        why the first two routes below are so underused.
      </P>

      <Pullquote>
        You are not looking for the best property manager in Nairobi. You are
        looking for one who is demonstrably good at the specific thing your
        property needs.
      </Pullquote>

      <H2 id="routes">The six places to look</H2>

      <OL>
        <LI>
          <strong>The best-run building you can get into.</strong> If there is
          a block in Kilimani or Lavington that visibly works, where the lifts
          run, the compound is clean, the bins are managed and the water does
          not fail, somebody is managing it competently. Ask the caretaker or
          the management committee who. This is the only route where you assess
          the work before you meet the salesperson.
        </LI>
        <LI>
          <strong>Other landlords in your own building.</strong> Your service
          charge meeting or owners&rsquo; WhatsApp group contains several
          people solving your exact problem in the same building, with the same
          water supply, the same tenants and the same county. Ask who they use
          and, more usefully, who they left and why. The second question
          produces better information than the first.
        </LI>
        <LI>
          <strong>Property advocates.</strong> Conveyancing and property
          lawyers in Nairobi see the aftermath of bad management: the deposit
          disputes, the tribunal filings, the agent who cannot account for
          eight months of rent. They know which names recur and they have no
          commercial reason to flatter anyone. If you used an advocate on your
          purchase, this is a free and very well-informed referral.
        </LI>
        <LI>
          <strong>Firms that publish their terms.</strong> A firm that puts its
          fee, its response time and its notice period in writing before you
          have spoken to anybody has made claims you can compare and hold them
          to. A firm that will not quote until you call is reserving the right
          to price you rather than the work, and you will not find out where
          you landed in that range.
        </LI>
        <LI>
          <strong>Your bank or diaspora network, with scepticism.</strong>
          Kenyan banks and diaspora associations often maintain lists of
          property partners. These are commercial relationships rather than
          endorsements, so treat the list as a source of names and do the
          verification yourself. It is still a better starting set than a
          search result.
        </LI>
        <LI>
          <strong>The letting boards on units like yours.</strong> Walk or
          street-view the streets around your property and note which agents
          are actually letting units of your size and standard. An agent
          visibly transacting in your micro-market knows your rent level and
          your tenant pool. One who mostly sells land in Kitengela does not,
          whatever the website says.
        </LI>
      </OL>

      <H2 id="where-not">Where not to look</H2>

      <UL>
        <LI>
          <strong>The first page of results, taken on its own.</strong> Useful
          for assembling names, worthless as a ranking. It tells you who
          invested in being visible, which is a marketing budget rather than an
          operational record. Use it to build the list, not to order it.
        </LI>
        <LI>
          <strong>Firms with no physical office you can visit.</strong>
          Everything that goes wrong with a Nairobi property is fixed by
          somebody turning up. An agent you cannot visit is an agent who may
          not be able to visit your tenant either.
        </LI>
        <LI>
          <strong>Anybody whose pitch is the lowest percentage.</strong>
          Nairobi long-term management runs roughly 8 to 15 percent of
          collected rent. Meaningfully below that band, something has been
          removed from the service, and the usual thing removed is the
          inspection. Whether you even need full management is worth settling
          first in{" "}
          <Link
            href="/insights/do-i-need-a-property-manager-nairobi"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            do you actually need a property manager
          </Link>
          .
        </LI>
        <LI>
          <strong>A relative who will do it as a favour.</strong> This is not a
          management arrangement, it is a relationship you are quietly
          spending, and it has no mechanism for being held to anything. It
          works until the first time you have to complain to someone you will
          see at Christmas.
        </LI>
      </UL>

      <H2 id="shortlist">Shortlist three, and brief them identically</H2>

      <P>
        Three is the right number: enough to see a range, few enough that you
        actually read the replies. The important discipline is sending all
        three the same brief, in writing, and asking for the answer in writing.
        Phone quotes cannot be compared and are not remembered accurately by
        either party.
      </P>

      <Callout title="The brief, to adapt and send to all three">
        <P>
          Property: [size, type, area, floor, furnished or unfurnished, current
          condition].
        </P>
        <P>
          Current position: [tenanted at KES X since date / vacant since date /
          currently on Airbnb / newly completed].
        </P>
        <P>
          Where I live: [Nairobi / London / Dubai / other], and the time zone I
          can realistically take calls in.
        </P>
        <P>
          What I want: [full management / tenant finding only / short let
          management], starting [date].
        </P>
        <P>
          Please reply in writing with: your fee and whether it is charged on
          rent collected or rent due; every other charge over a full year,
          including setup, maintenance markup, renewal or letting fees and
          anything payable on exit; the date I am paid each month and what
          happens if that date is missed; how much you can spend on a repair
          without my approval; who physically inspects the property and how
          often; who handles the MRI filing and whether I receive the receipt;
          your notice period; and the contact details of two current landlord
          clients, one of whom has had a tenancy go wrong.
        </P>
      </Callout>

      <P>
        Firms that answer that brief in full have told you most of what you
        need. Firms that answer half of it and ask for a call have also told
        you something. The reasoning behind each of those asks, and our own
        answers to them, is in{" "}
        <Link
          href="/insights/questions-to-ask-a-property-manager-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the questions to ask a property manager
        </Link>
        , and the contract those answers should end up inside is covered in{" "}
        <Link
          href="/insights/property-management-agreement-kenya-clause-by-clause"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the management agreement clause by clause
        </Link>
        .
      </P>

      <H2 id="already-have-one">If you already have a manager</H2>

      <P>
        Do not give notice until the successor is signed and has a start date.
        The worst version of this is a landlord in the notice period with
        nobody appointed and an outgoing agent who has run out of reasons to
        care. The sequence, and the notice letter itself, are in{" "}
        <Link
          href="/insights/terminate-property-management-agreement-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to terminate a property management agreement
        </Link>
        .
      </P>

      <H2 id="us">Where we fit</H2>

      <P>
        We are one of the firms in route four: the fee is published rather than
        quoted on a call, at 10 percent of collected rent for long-term
        management and 20 percent of revenue for short let, with no setup fee,
        no commission from contractors, no letting fee at renewal and nothing
        payable to leave. There are written consequences behind it rather than
        only a service description, including waiving a property&rsquo;s fee
        for the month if we miss a 48 hour response.
      </P>

      <P>
        We would rather you ran the first three routes before talking to us. If
        the best-run building near you is managed by someone else and the
        owners in it are happy, that is worth more than our website, and we
        would rather you found that out now than in a year.
      </P>

      <Callout title="Put us in your three">
        Send us the brief above and we will answer all of it in writing, with
        a figure for your specific property rather than a range. If your
        situation does not need us, that is what you will get back.
      </Callout>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/property-management-nairobi-what-you-actually-get-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what management in Nairobi actually gets you
        </Link>
        {", "}
        <Link
          href="/insights/cost-of-property-management-kenya-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what it costs
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/where-to-find-airbnb-co-host-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          where to find an Airbnb co-host
        </Link>
        .
      </P>
    </>
  );
}
