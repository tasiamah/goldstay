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
  slug: "top-nairobi-property-scams-trending-2026",
  title:
    "Top Nairobi property scams trending in 2026",
  description:
    "Property scams evolve faster than the legal framework. Here are the Nairobi property scams trending in 2026: fake titles, double sales, milestone-driven off-plan fraud, fake agents, fraudulent diaspora roadshows and the new digital twists.",
  publishedAt: "2026-03-29",
  readingMinutes: 5,
  author: authors.legal,
  tags: [
    "Scams",
    "Fraud",
    "Nairobi",
    "Diaspora",
    "Buyer Guide",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Top Nairobi property scams trending 2026 buyer guide",
};

export default function Article() {
  return (
    <>
      <Lede>
        Property scams evolve faster than the
        legal framework. Here are the Nairobi
        property scams trending in 2026 and
        the practical defences for each.
      </Lede>

      <H2 id="fake-title">1. Fake title and forged identity</H2>

      <P>
        Forged title deeds and impersonation
        of registered owners. Defence: verify
        title via Ardhisasa or in-person at
        Lands Registry; KRA PIN and ID
        verification of the seller.
      </P>

      <H2 id="double-sale">2. Double sale</H2>

      <P>
        Same property sold to multiple
        buyers; first to register wins.
        Defence: lodge caveat at Lands
        Registry on offer signing; quick
        completion; title search day-of-completion.
      </P>

      <H2 id="off-plan">3. Off-plan vanishing developer</H2>

      <P>
        Developer takes deposits, builds
        slowly or not at all, eventually
        disappears or files insolvency.
        Defence: track record verification;
        milestone-tied payments; escrow
        where possible; independent counsel.
      </P>

      <H2 id="fake-agent">4. Fake estate agent</H2>

      <P>
        Person without mandate from the
        owner shows the property and takes
        deposits. Defence: insist on the
        owner’s power of attorney or
        direct meeting; pay through
        traceable bank channels; verify
        agent EARB registration.
      </P>

      <H2 id="diaspora-roadshow">5. Diaspora roadshow fraud</H2>

      <P>
        Glossy diaspora event in London,
        Atlanta, Dubai or Toronto presents
        unbuilt project; deposits collected;
        delivery never matches presentation.
        Defence: visit the site or send a
        local representative before paying;
        verify track record; independent
        legal review of all documentation.
      </P>

      <H2 id="land-cartel">6. Land cartel and irregular subdivision</H2>

      <P>
        Plot sold from informally subdivided
        land; title may be defective or
        contested. Defence: full title chain
        verification; LCB consent where
        applicable; on-site visit with
        surveyor.
      </P>

      <H2 id="rent-scam">7. Rent deposit scam</H2>

      <P>
        Fake landlord or agent collects
        rent and deposit on a property they
        do not own. Defence: verify
        ownership; meet the actual landlord;
        pay deposits to bank account
        matching the title.
      </P>

      <H2 id="digital">8. Digital and AI-assisted twists in 2026</H2>

      <UL>
        <LI>
          AI-generated fake property listings
          with photo-real images
        </LI>
        <LI>
          Voice cloning to impersonate
          known agents or relatives in
          phone calls
        </LI>
        <LI>
          Phishing emails appearing to
          come from law firms with bank
          details for completion payments
        </LI>
        <LI>
          Defence: verify by call-back to
          known numbers; never wire on the
          basis of an emailed bank detail
          change without phone verification
        </LI>
      </UL>

      <H2 id="mortgage-fraud">9. Mortgage and valuation fraud</H2>

      <P>
        Inflated valuation to support
        higher mortgage; collusion between
        seller, agent and valuer. Defence:
        bank-instructed valuer; independent
        counsel reviewing the valuation
        report.
      </P>

      <H2 id="construction">10. Construction milestone fraud</H2>

      <P>
        Developer represents milestone
        complete; collect milestone payment;
        reality is behind. Defence: independent
        site inspection; photo evidence
        signed off by your representative
        before milestone payment.
      </P>

      <Callout title="The scam-defence rule">
        Slow down. Pay through the bank.
        Verify with independent counsel.
        Visit the site or send a
        representative. Confirm bank details
        by call-back. The scams that
        succeed almost always succeed
        because the buyer skipped a step.
      </Callout>

      <Pullquote>
        Most Kenyan property scams are not
        sophisticated. They succeed because
        buyers skipped diligence to save
        time or money. Slow down. The
        diligence is cheaper than the
        scam.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For sourcing clients we run full
        scam-defence diligence. Read also
        our pieces on{" "}
        <Link
          href="/insights/diaspora-property-scams-trending-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          diaspora property scams
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/how-to-spot-fake-kenyan-title-deed"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to spot a fake title deed
        </Link>
        .
      </P>
    </>
  );
}
