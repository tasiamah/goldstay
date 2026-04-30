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
  slug: "chatgpt-prompts-nairobi-property-buyers",
  title:
    "ChatGPT for Nairobi property buyers: the prompts that actually work",
  description:
    "AI tools like ChatGPT can compress hours of property research into minutes if you prompt them properly. Here are the 2026 ChatGPT prompts that actually work for Nairobi property buyers, including diligence checklists, neighbourhood comparison and contract review.",
  publishedAt: "2026-04-01",
  readingMinutes: 5,
  author: authors.research,
  tags: [
    "ChatGPT",
    "AI",
    "Nairobi",
    "Property",
    "Buyer Tools",
    "Research",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "ChatGPT prompts Nairobi property buyers that actually work",
};

export default function Article() {
  return (
    <>
      <Lede>
        AI tools like ChatGPT can compress
        hours of property research into
        minutes if you prompt them properly.
        Here are the 2026 prompts that
        actually work for Nairobi property
        buyers.
      </Lede>

      <H2 id="research">Neighbourhood research prompt</H2>

      <P>
        “You are a Nairobi property
        analyst. Compare Kileleshwa, Lavington
        and Spring Valley for a returning
        diaspora family with two school-age
        children, working in Westlands. Cover
        commute, schools, security, lifestyle,
        community fit and resale liquidity.
        Be honest about the trade-offs.
        Output as a table with one column
        per suburb.”
      </P>

      <H2 id="contract">Contract review prompt</H2>

      <P>
        “Below is a Nairobi property
        sale agreement. Identify any clauses
        that are unusual, one-sided in
        favour of the seller, ambiguous on
        completion or payment, or that lack
        protection on title, completion
        deadline or default. List each
        concern with a brief explanation
        and a recommended counter-edit.
        I will run independent counsel after.
        [Paste contract here.]”
      </P>

      <H2 id="diligence">Diligence checklist prompt</H2>

      <P>
        “Generate a complete pre-purchase
        diligence checklist for an off-plan
        apartment in Nairobi. Cover
        developer, title, zoning, NEMA, NCA,
        county approval, sale agreement,
        payment milestones, specification,
        defect liability, service charge
        governance and tenant pool. Format
        as a printable checklist with
        checkboxes.”
      </P>

      <H2 id="affordability">Affordability prompt</H2>

      <P>
        “I earn KES 450,000 net per
        month in Nairobi, have KES 4m
        savings, no other debt. I want to
        buy in 18 months. Calculate the
        property price band I should be
        targeting, the recommended deposit,
        the indicative mortgage size at
        current rates, and my monthly cash
        flow after mortgage. Suggest the
        Nairobi suburbs that fit.”
      </P>

      <H2 id="comparables">Comparable pricing prompt</H2>

      <P>
        “I am being shown a 3-bed
        apartment in Kilimani at KES 22m.
        What questions should I ask to
        verify this is fair value? What
        comparable data points should I
        request from the agent? What
        signals would suggest the price is
        too high or too low?”
      </P>

      <H2 id="limits">Where ChatGPT cannot help</H2>

      <UL>
        <LI>
          Verifying actual title at the
          Lands Registry (you must do this
          or your lawyer must)
        </LI>
        <LI>
          Confirming current developer
          delivery on a specific project
        </LI>
        <LI>
          Site inspection, structural
          assessment, build quality
          observation
        </LI>
        <LI>
          Negotiating with humans
        </LI>
        <LI>
          Local relationships and reputational
          knowledge of specific developers,
          agents and lawyers
        </LI>
      </UL>

      <Callout title="The AI buyer rule">
        ChatGPT compresses research and
        improves contract review. It does
        not replace independent counsel,
        site inspection or local market
        knowledge. Use it as a force
        multiplier, not a substitute.
      </Callout>

      <Pullquote>
        The buyers using AI thoughtfully
        in 2026 ask better questions and
        sign better contracts. The buyers
        using it as a substitute for
        diligence buy the same problems
        the unaided market always did.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For sourcing clients we use AI in
        our internal diligence process and
        coordinate with independent local
        counsel and inspection. Read also
        our pieces on{" "}
        <Link
          href="/insights/diaspora-trip-checklist-buying-property-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          diaspora trip checklist
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/lawyer-reading-sale-agreement-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          lawyer reading sale agreement
        </Link>
        .
      </P>
    </>
  );
}
