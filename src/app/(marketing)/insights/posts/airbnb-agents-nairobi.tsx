import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  KeySummary,
  LI,
  Lede,
  OL,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "airbnb-agents-nairobi",
  title: "Airbnb agents in Nairobi: hiring one, or becoming one",
  description:
    "Agent, co-host and management company are the same job under three names, and the search results for the word are stranger than the market behind them. What an Airbnb agent in Nairobi actually charges, the two questions that separate the good from the plausible, and the two honest routes in for people who want to become one.",
  metaTitle: "Airbnb Agents in Nairobi: Hiring or Becoming One",
  metaDescription:
    "What an Airbnb agent in Nairobi does, what they charge, how to vet one, and the two routes in if you want to become one.",
  publishedAt: "2026-09-10",
  readingMinutes: 10,
  author: authors.editors,
  tags: [
    "Airbnb",
    "Co-Hosting",
    "Nairobi",
    "Short Let",
    "Property Management",
    "Kenya",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "An Airbnb agent managing a furnished apartment in Nairobi",
};

export default function Article() {
  return (
    <>
      <Lede>
        Search for Airbnb agents in Nairobi and the first result is not a
        management company. On the day we checked it was an Instagram profile
        with a few hundred followers, sitting above every firm in the city
        including the ones paying for websites. That is worth pausing on,
        because it tells you something true about this market before you speak
        to anybody: the word agent has no fixed meaning here, and the people
        using it are not all after the same thing.
      </Lede>

      <KeySummary
        question="What is an Airbnb agent in Nairobi and what do they charge?"
        answer="Agent, co-host and management company are three names for one job in Nairobi: running a furnished unit on the owner's behalf, which covers the listing, nightly pricing, guest screening, check-ins, turnover cleaning and the money. Full management here runs 15 to 25 percent of revenue, and the headline percentage matters far less than what it is charged on and what it leaves out, because Airbnb's own host service fee of roughly 15 percent sits alongside it rather than inside it. Two questions separate firms fast: whether the listing stays on your Airbnb account or moves onto theirs, and whether you get an itemised monthly statement or a single figure in a message. A large share of people searching this phrase are not owners looking to hire at all, they want to become an agent, and there are two honest routes in: co-hosting for owners you find yourself, or leasing a unit and re-letting it with the owner's written consent to sublet."
        facts={[
          { label: "Also called", value: "Co-host, management company" },
          { label: "Market fee", value: "15 to 25% of revenue" },
          { label: "Our fee", value: "20% of revenue collected" },
          { label: "Airbnb host fee", value: "About 15%, charged on top" },
          { label: "Ask first", value: "Whose account holds the listing" },
          { label: "To become one", value: "Co-host, or lease and re-let" },
          { label: "Consent to sublet", value: "Required, and in writing" },
        ]}
      />

      <H2 id="the-word">The word tells you nothing, and that is the point</H2>

      <P>
        An Airbnb agent, a short-stay agent, a co-host and an Airbnb management
        company all describe the same work. Somebody else runs your furnished
        unit: they write and photograph the listing, set the nightly rate,
        screen and message guests, handle arrivals, organise the turnover
        clean, chase the maintenance and account for the money. Which of the
        four words a firm picks for itself is a marketing decision and nothing
        more.
      </P>

      <P>
        This matters because the label is doing no work for you when you
        compare quotes. Two firms describing themselves identically can operate
        on completely different terms, and the terms are where the money is. We
        wrote the arithmetic out in full in{" "}
        <Link
          href="/insights/how-much-do-airbnb-managers-charge-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what Airbnb managers charge in Kenya
        </Link>
        , and the short version is that the percentage is the least informative
        number in the conversation.
      </P>

      <H2 id="the-search-results">What the search results are telling you</H2>

      <P>
        When Google puts a small Instagram account above every website on a
        commercial query, it is not making a mistake. It is reporting that it
        could not find a page that answers the question well, and that the
        people asking it seem satisfied by a profile they can scroll. Compare
        it with a search for Airbnb management services, where real service
        pages fill the results and no social profile gets near the top.
      </P>

      <P>
        The difference is intent. When we harvested what Kenyan searchers
        actually complete this phrase with, the same suggestion came back
        against every variation we tried: how to become an Airbnb agent. Not
        how to hire one. That single fact explains the Instagram result, and it
        explains why some of the firms ranking for the term are collecting an
        audience rather than a client list.
      </P>

      <Pullquote>
        Half the people typing this phrase cannot hire you. They want your job.
      </Pullquote>

      <P>
        So if you are an owner reading this, the useful thing to know is that
        you are searching in a crowd of people who are not your peers, and the
        results have been shaped around them. Skip the follower counts. The
        rest of this is written for you, and the last section is written for
        the others, because both are legitimate and we work with both.
      </P>

      <H2 id="what-it-costs">What an agent in Nairobi actually costs</H2>

      <P>
        Full Airbnb management in Nairobi runs between 15 and 25 percent of
        revenue. Ours is 20 percent. The spread is real but it is not where
        firms differ most, because two agents quoting an identical percentage
        can take materially different amounts out of the same unit depending on
        what the percentage is applied to.
      </P>

      <UL>
        <LI>
          <strong>Revenue collected</strong> is what actually reached the
          account after the platform took its cut. A percentage of this is the
          smallest of the three and the only one you can verify against your
          Airbnb payout history
        </LI>
        <LI>
          <strong>Gross booking value</strong> is the headline figure before
          platform fees. A percentage of this is larger, and the gap widens
          every time Airbnb adjusts its own fee
        </LI>
        <LI>
          <strong>Airbnb&rsquo;s host service fee</strong> of roughly 15
          percent sits alongside your agent&rsquo;s fee rather than inside it.
          An owner budgeting 20 percent total is out by a wide margin
        </LI>
      </UL>

      <Callout title="The question to ask on the first call">
        Is your fee charged on revenue collected or on gross booking value, and
        can you show me last month&rsquo;s statement for a comparable unit with
        the platform fee as a separate line? A firm that itemises will send it.
        A firm that does not will explain why it cannot.
      </Callout>

      <H2 id="vetting">The two questions that separate them</H2>

      <P>
        Beyond the fee there are two structural questions, and they are worth
        more than an hour of conversation about service quality.
      </P>

      <OL>
        <LI>
          <strong>Whose Airbnb account holds the listing?</strong> If it stays
          on yours, the reviews, the ratings and the Superhost status you build
          are yours, and you can change agent without starting from zero. If it
          moves onto theirs, everything you accumulate belongs to them, and the
          cost of leaving rises every month you stay. This is the single most
          consequential term in a short-let management arrangement and it is
          almost never volunteered
        </LI>
        <LI>
          <strong>Who holds the guest money, and what do you receive?</strong>
          There is a real difference between an itemised monthly statement
          showing nights sold, platform fees, the management fee and costs as
          separate lines, and a figure sent in a message. The second is not
          necessarily dishonest, but it is unauditable, and a unit you cannot
          audit is a unit you cannot price
        </LI>
      </OL>

      <P>
        If you want the longer list, including the questions that catch out
        firms operating without the owner consent they claim to have, it is in{" "}
        <Link
          href="/insights/where-to-find-airbnb-co-host-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          where to find an Airbnb co-host in Nairobi
        </Link>
        , which also covers why Airbnb&rsquo;s own co-host directory is no help
        to you here. It does not operate in Kenya.
      </P>

      <H2 id="becoming-one">How to become an Airbnb agent in Nairobi</H2>

      <P>
        This is what most people searching the phrase are after, so here it is
        without the course-selling. There are two routes, they suit different
        amounts of capital, and only one of them requires you to find owners
        willing to trust you with an asset.
      </P>

      <P>
        <strong>Co-hosting.</strong> You run somebody else&rsquo;s unit for a
        share of the revenue, typically the 15 to 25 percent above. No capital
        beyond your time, and no exposure if the unit sits empty, because your
        fee is a percentage of nothing. The hard part is not the work, it is
        that a first client has to hand a stranger the keys to a property worth
        several million shillings on the strength of a conversation. Almost
        everybody who succeeds at this starts with a unit belonging to somebody
        who already knows them. What a co-host is actually responsible for is
        set out in{" "}
        <Link
          href="/insights/airbnb-co-host-nairobi-what-they-do"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what an Airbnb co-host in Nairobi does
        </Link>
        .
      </P>

      <P>
        <strong>Leasing and re-letting.</strong> You take a unit on a normal
        lease, furnish it, and let it nightly. The trade press calls this
        rent-to-rent or Airbnb arbitrage. You keep the whole margin instead of
        a percentage, and you carry the whole risk: rent falls due in a month
        whether or not anybody booked. The numbers for Nairobi specifically,
        including what furnishing a unit actually costs and what occupancy has
        to hold for it to work, are in{" "}
        <Link
          href="/insights/airbnb-arbitrage-nairobi-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Airbnb arbitrage in Nairobi
        </Link>
        .
      </P>

      <Callout title="The consent that decides whether you have a business">
        Leasing a unit and letting it nightly requires the owner&rsquo;s written
        permission to sublet. Not a verbal nod from a caretaker, and not
        silence. Without it you can be turned out with guests in the building
        and no way to honour bookings you have already taken payment for, and
        the building committee is under no obligation to give you notice. Get
        it in writing before you furnish anything.
      </Callout>

      <P>
        Neither route needs a licence in the sense people usually mean, but if
        you are letting property on behalf of owners for a fee you are close to
        work the Estate Agents Act regulates, and the position is worth
        understanding rather than assuming. Building committees are also the
        practical gatekeeper in most Nairobi apartment blocks, and several now
        refuse short lets outright regardless of what your lease says.
      </P>

      <H2 id="where-we-fit">Where we fit, for both of you</H2>

      <P>
        If you are an owner, we manage furnished units in Nairobi for 20
        percent of revenue collected, with no setup fee, no listing fee and no
        exit fee. The listing stays on your Airbnb account, so the review
        history and Superhost status you build stay yours and you can leave
        whenever you like. The monthly statement shows nights sold, platform
        fees, our fee and costs as separate lines. That is{" "}
        <Link
          href="/airbnb-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          our Airbnb management service
        </Link>
        .
      </P>

      <P>
        If you are becoming an agent by leasing and re-letting, we manage units
        for operators as well as owners, and it is now most of our short-let
        book. We will look at a lease before you sign it, help you get the
        consent to sublet properly rather than hopefully, and run the unit while
        you find the next one. Same 20 percent, same itemised statement. That
        is{" "}
        <Link
          href="/airbnb-arbitrage-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          management for operators
        </Link>
        .
      </P>

      <P>
        What we will not do is take a unit on without the owner&rsquo;s written
        permission where one is needed. Half of what we do is act for
        landlords, and we would be the visible party in any dispute. An agent
        willing to skip that step on your behalf is telling you how they will
        handle the next inconvenient rule.
      </P>
    </>
  );
}
