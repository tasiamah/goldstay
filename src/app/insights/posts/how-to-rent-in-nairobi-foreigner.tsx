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
  slug: "how-to-rent-in-nairobi-foreigner",
  title:
    "How to rent in Nairobi as a foreigner: the 2026 guide",
  description:
    "Renting in Nairobi as a foreign national is straightforward in principle and quirky in practice. Documents, deposits, agent fees, lease quirks and the suburbs that fit foreign tenant profiles. Here is the honest 2026 step-by-step guide.",
  publishedAt: "2026-01-09",
  readingMinutes: 6,
  author: authors.editors,
  tags: [
    "Renting",
    "Foreigner",
    "Nairobi",
    "Tenant",
    "Lease",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "How to rent Nairobi foreigner 2026 step-by-step guide",
};

export default function Article() {
  return (
    <>
      <Lede>
        Renting in Nairobi as a foreign national
        is straightforward in principle and
        quirky in practice. Documents, deposits,
        agent fees, lease quirks and the
        suburbs that fit foreign tenant
        profiles. Here is the honest 2026
        step-by-step guide.
      </Lede>

      <H2 id="suburbs">Where foreigners typically rent</H2>

      <UL>
        <LI>
          <strong>Westlands</strong>: corporate
          singles and couples, towers
        </LI>
        <LI>
          <strong>Kilimani and Lavington</strong>:
          professional cohort, family
          singles
        </LI>
        <LI>
          <strong>Gigiri-Rosslyn</strong>: UN
          and embassy staff
        </LI>
        <LI>
          <strong>Karen, Runda and Muthaiga</strong>:
          family expats with senior roles
        </LI>
        <LI>
          <strong>Riverside Drive</strong>:
          premium short and medium-term
        </LI>
      </UL>

      <H2 id="prices">2026 indicative rents</H2>

      <UL>
        <LI>
          1-bed Westlands: KES 60,000 to KES
          110,000
        </LI>
        <LI>
          2-bed Kilimani/Lavington: KES
          90,000 to KES 180,000
        </LI>
        <LI>
          3-bed Lavington/Kileleshwa: KES
          140,000 to KES 280,000
        </LI>
        <LI>
          Family standalone Karen/Runda: KES
          400,000 to KES 1.2m+
        </LI>
        <LI>
          Premium Gigiri standalone: KES
          500,000 to KES 1.5m+
        </LI>
      </UL>

      <H2 id="documents">Documents needed</H2>

      <UL>
        <LI>
          Valid passport
        </LI>
        <LI>
          Valid Kenyan visa, work permit
          (Class D) or dependant pass
        </LI>
        <LI>
          Employer letter or contract
          confirming income and stay
          length
        </LI>
        <LI>
          Reference letter from previous
          landlord (if available)
        </LI>
        <LI>
          KRA PIN if available (most
          landlords accept tenancy without
          PIN, some do not)
        </LI>
      </UL>

      <H2 id="deposit">Deposit and fees</H2>

      <UL>
        <LI>
          Security deposit: typically 1 to 2
          months&rsquo; rent
        </LI>
        <LI>
          First month&rsquo;s rent in
          advance
        </LI>
        <LI>
          Agent fee: typically 1
          month&rsquo;s rent (paid by
          tenant or landlord depending on
          arrangement)
        </LI>
        <LI>
          Service charge: separate from rent
          in most premium compounds
        </LI>
      </UL>

      <H2 id="lease">Lease quirks</H2>

      <UL>
        <LI>
          Most leases are 1 year renewable
          with 2 to 3 month notice
        </LI>
        <LI>
          Diplomatic clause (early exit
          without penalty on transfer) is
          available for diplomatic and UN
          staff with proof
        </LI>
        <LI>
          Furnished and serviced rentals
          available at premium; useful for
          short stay or pre-relocation
        </LI>
        <LI>
          Pet policy varies by compound;
          confirm before signing
        </LI>
      </UL>

      <H2 id="step-by-step">Step-by-step process</H2>

      <OL>
        <LI>
          Define budget, suburb and
          requirements (parking, security,
          power backup, schools nearby)
        </LI>
        <LI>
          Engage one or two reputable
          letting agents
        </LI>
        <LI>
          Tour 5 to 10 properties; do not
          commit on the first visit alone
        </LI>
        <LI>
          Verify compound governance and
          service charge collection
          discipline
        </LI>
        <LI>
          Negotiate rent, deposit, agent
          fee, lease term
        </LI>
        <LI>
          Have lease reviewed by lawyer or
          property manager
        </LI>
        <LI>
          Pay deposits and rent through
          traceable bank channels; never
          cash without proper receipt
        </LI>
        <LI>
          Conduct move-in inspection and
          document the property condition
          in writing with photos
        </LI>
      </OL>

      <H2 id="risks">Risks and red flags</H2>

      <UL>
        <LI>
          Landlord demanding cash without
          receipt
        </LI>
        <LI>
          Multiple keys offered; no clear
          owner
        </LI>
        <LI>
          Property listed by agent who
          cannot produce mandate
        </LI>
        <LI>
          Service charge collection
          undisclosed
        </LI>
        <LI>
          Lease lacking dispute and notice
          provisions
        </LI>
      </UL>

      <Callout title="The foreign tenant rule">
        Pay through the bank. Document the
        property condition. Negotiate the
        lease in writing. Pick the suburb
        that matches your honest profile.
        Done with discipline, the Nairobi
        rental market works smoothly for
        foreign tenants.
      </Callout>

      <Pullquote>
        Most foreign tenant disputes in
        Nairobi come down to deposit
        recovery at the end of the lease.
        Photograph the property on day one;
        keep the receipts.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For foreign tenant clients we
        coordinate suburb selection,
        compound diligence and lease
        negotiation. Read also our pieces
        on{" "}
        <Link
          href="/insights/diplomatic-tenants-nairobi-rental-market"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          diplomatic tenants
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/buying-property-expat-working-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          buying as expat
        </Link>
        .
      </P>
    </>
  );
}
