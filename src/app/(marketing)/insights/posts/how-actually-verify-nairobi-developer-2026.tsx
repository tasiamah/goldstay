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
  slug: "how-actually-verify-nairobi-developer-2026",
  title:
    "How to actually verify a Nairobi developer before paying any deposit",
  description:
    "Most off-plan buyers verify the developer through a Google search and a brochure. The honest 2026 verification process is more thorough. Here is the practical 12-step playbook for actually verifying a Nairobi developer before paying any deposit.",
  publishedAt: "2026-02-25",
  readingMinutes: 5,
  author: authors.legal,
  tags: [
    "Verification",
    "Developer",
    "Nairobi",
    "Diligence",
    "Off-Plan",
    "Buyer Guide",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "How actually verify Nairobi developer before paying deposit 2026",
};

export default function Article() {
  return (
    <>
      <Lede>
        Most off-plan buyers verify the
        developer through a Google search
        and a brochure. The honest 2026
        verification process is more
        thorough. Here is the practical
        12-step playbook.
      </Lede>

      <H2 id="1">1. Confirm legal entity at BRS</H2>

      <P>
        Search the developer’s name at the
        Business Registration Service.
        Verify directors, registration
        date, registered office, share
        capital. Cross-reference with the
        sale agreement counterparty.
      </P>

      <H2 id="2">2. Visit at least 2 prior delivered projects</H2>

      <P>
        Walk through the actual handed-over
        projects. Inspect build quality,
        finishes, governance, current
        condition. Talk to the security
        guard, the AOA chair, residents.
      </P>

      <H2 id="3">3. Reference call with prior buyers</H2>

      <P>
        Get contact for 3 to 5 prior
        buyers. Ask: did delivery match
        the brochure? was the timeline
        reasonable? were there hidden
        costs? would you buy again?
      </P>

      <H2 id="4">4. KRA tax compliance</H2>

      <P>
        Request KRA tax compliance
        certificate. A developer that
        cannot provide one has a problem
        you do not want to inherit.
      </P>

      <H2 id="5">5. Title at the Lands Registry</H2>

      <P>
        Verify the project plot title at
        the Lands Registry. Confirm
        ownership, encumbrances, zoning
        permit. The mother title must
        match the sale agreement.
      </P>

      <H2 id="6">6. NEMA, NCA, county approvals</H2>

      <P>
        Confirm NEMA EIA approval, NCA
        contractor certification, county
        building permit. Ask for copies;
        verify with the issuing
        authority.
      </P>

      <H2 id="7">7. Construction financing</H2>

      <P>
        Ask: is there bank construction
        financing in place, or are buyer
        deposits the only funding? The
        former is institutional; the
        latter is structurally fragile.
      </P>

      <H2 id="8">8. Court filings and judgement creditors</H2>

      <P>
        Search the e-Filing court system
        for litigation against the
        developer. Outstanding judgement
        creditors signal trouble.
      </P>

      <H2 id="9">9. Press and online reputation</H2>

      <P>
        Read beyond the marketing site.
        Property forums, Twitter / X
        threads, Facebook groups, news
        archives. Buyer complaints
        publicly aired matter; pattern
        beats incident.
      </P>

      <H2 id="10">10. Independent counsel review</H2>

      <P>
        Independent property law firm
        reviews the sale agreement,
        title chain, approvals,
        milestone structure and defect
        liability. Not the developer’s
        lawyer.
      </P>

      <H2 id="11">11. Site visit during construction</H2>

      <P>
        Visit the actual construction
        site. Verify activity, workers
        on site, materials being
        delivered, progress aligned with
        marketing claims. A quiet site
        is a warning sign.
      </P>

      <H2 id="12">12. EARB registration</H2>

      <P>
        If a registered estate agent is
        involved, verify EARB registration.
        For sourcing partners (like
        Goldstay), verify the firm’s
        track record and references.
      </P>

      <H2 id="walk-away">When to walk away</H2>

      <UL>
        <LI>
          Developer cannot provide tax
          compliance certificate
        </LI>
        <LI>
          No prior delivered projects to
          inspect
        </LI>
        <LI>
          Resistance to independent
          counsel
        </LI>
        <LI>
          Resistance to milestone-tied
          payments
        </LI>
        <LI>
          Outstanding judgement creditors
        </LI>
        <LI>
          Site activity quiet relative to
          claimed progress
        </LI>
        <LI>
          Pressure to close fast
        </LI>
      </UL>

      <Callout title="The developer verification rule">
        Run all 12 steps. Most buyers run
        2 or 3. The buyers who run all
        12 catch the problems early; the
        buyers who skip steps catch them
        when their deposit is unrecoverable.
        The hour spent on diligence is
        the cheapest hour in the
        purchase.
      </Callout>

      <Pullquote>
        Developer verification is not
        about catching the developer in
        a lie. It is about confirming
        the entire delivery chain
        actually exists and is durable
        through the timeline you need.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For sourcing clients we run all
        12 verification steps as
        standard. Read also our pieces
        on{" "}
        <Link
          href="/insights/how-to-verify-kenyan-property-developer"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          verify Kenyan developer
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/buying-off-plan-nairobi-risks-red-flags"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          off-plan risks
        </Link>
        .
      </P>
    </>
  );
}
