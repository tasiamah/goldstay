import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  H3,
  LI,
  Lede,
  OL,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "what-to-do-if-tenant-refuses-to-pay-rent",
  title:
    "What to do if your tenant refuses to pay rent in Kenya: the 2026 landlord guide",
  description:
    "Tenant non-payment is the single biggest source of stress for Kenyan landlords. Done right, the process is contained and the loss is limited. Done wrong, it drags for months and the loss compounds. Here is the honest 2026 step-by-step playbook on what to do when a tenant stops paying.",
  publishedAt: "2025-11-05",
  readingMinutes: 7,
  author: authors.poonam,
  tags: [
    "Kenya",
    "Landlord",
    "Rent",
    "Eviction",
    "Tenants",
    "Property Management",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "What to do if tenant refuses to pay rent Kenya 2026 landlord guide",
};

export default function Article() {
  return (
    <>
      <Lede>
        Tenant non-payment is the single biggest
        source of stress for Kenyan landlords, and
        it is the issue most likely to push absentee
        owners into making expensive emotional
        decisions. Done right, the process is
        contained and the loss is limited. Done
        wrong, it drags for months and the loss
        compounds. Here is the honest 2026 playbook.
      </Lede>

      <H2 id="day-1">Days 1 to 14: contain the situation</H2>

      <UL>
        <LI>
          Send a polite written reminder. Tenants
          sometimes default through cash flow
          shocks (delayed salary, family emergency)
          rather than bad faith
        </LI>
        <LI>
          Confirm the bank account or paybill is
          working correctly
        </LI>
        <LI>
          Phone call to understand the situation
        </LI>
        <LI>
          Begin formal documentation (logged
          messages, dated reminders)
        </LI>
      </UL>

      <H2 id="day-15">Days 15 to 30: formal notice</H2>

      <UL>
        <LI>
          Issue a formal written demand for the
          arrears, with a deadline
        </LI>
        <LI>
          Where applicable, copy the guarantor or
          referee
        </LI>
        <LI>
          Begin assembling documentation needed for
          a tribunal application: lease, payment
          history, demand letters, communication
          log
        </LI>
        <LI>
          Decide whether to negotiate a payment
          plan or proceed to eviction. If the
          tenant has a track record and a
          plausible reason, a payment plan often
          recovers more than a contested eviction
        </LI>
      </UL>

      <H2 id="day-30">Days 30 to 60: tribunal route</H2>

      <P>
        Where the tenancy is governed by the Rent
        Restriction Act (largely older mass-market
        tenancies) or by the Landlord and Tenant
        Act, the tribunal route applies. For most
        modern leases on residential property
        outside the controlled segment, the lease
        terms govern and the High Court route
        applies.
      </P>

      <UL>
        <LI>
          Engage a property advocate
        </LI>
        <LI>
          File at the Business Premises Rent
          Tribunal or the relevant court
        </LI>
        <LI>
          Maintain documented professional contact
          with the tenant; do not threaten,
          intimidate or attempt self-help eviction
        </LI>
        <LI>
          Self-help eviction (changing locks,
          throwing belongings out, cutting power)
          is illegal and exposes the landlord to
          counter-claims
        </LI>
      </UL>

      <H2 id="day-90">Days 60 to 180: hearing and order</H2>

      <UL>
        <LI>
          Tribunal or court hearing
        </LI>
        <LI>
          Order issued: typically eviction plus
          arrears
        </LI>
        <LI>
          Eviction executed by court bailiff,
          accompanied by police where required
        </LI>
        <LI>
          Arrears recovery: through deposit,
          guarantor, or in some cases salary
          attachment
        </LI>
      </UL>

      <H2 id="recovery">Recovery rates in practice</H2>

      <P>
        Honest expectation. After a contested
        non-payment running 3 to 6 months:
      </P>

      <UL>
        <LI>
          Deposit recovers 1 to 3 months of arrears
          and damage
        </LI>
        <LI>
          Direct cash recovery from the tenant is
          typically partial, sometimes nil
        </LI>
        <LI>
          Salary attachment works where the tenant
          is in salaried employment and the order
          can be enforced
        </LI>
        <LI>
          Guarantor recovery depends on the
          guarantor&rsquo;s willingness and capacity
          to pay
        </LI>
      </UL>

      <P>
        Most landlords recover 30 to 70 percent of
        the lost rent in a contested case, depending
        on circumstances.
      </P>

      <H2 id="prevent">Prevention is the real solution</H2>

      <H3 id="screen">Screening</H3>

      <P>
        Detail in our{" "}
        <Link
          href="/insights/tenant-screening-nairobi-how-we-do-it"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          tenant screening piece
        </Link>
        . Proper screening reduces non-payment
        incidence by an order of magnitude.
      </P>

      <H3 id="deposit">Deposit and rent in advance</H3>

      <UL>
        <LI>
          Deposit of 1 to 3 months
        </LI>
        <LI>
          Rent in advance of 1 to 3 months
        </LI>
        <LI>
          Guarantor for younger or thinner-credit
          tenants
        </LI>
        <LI>
          Lease terms that match the law
        </LI>
      </UL>

      <H3 id="management">Active management</H3>

      <P>
        Detail in our{" "}
        <Link
          href="/insights/why-property-management-matters-diaspora-landlords"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          property management piece
        </Link>
        . Tenants pay landlords who are
        professionally represented and persistent;
        they do not pay absentee landlords whose
        property is unmonitored.
      </P>

      <H2 id="diaspora">For diaspora landlords specifically</H2>

      <P>
        The single most important thing is to have
        a regulated property manager on the ground.
        Tenants in Nairobi pay the property manager
        who calls, the tribunal who summons, and
        the bailiff who serves. They do not pay
        the diaspora landlord whose only contact is
        a polite WhatsApp message every two weeks.
      </P>

      <Callout title="The honest verdict">
        Non-payment is best handled through
        prevention (screening), structured response
        (formal notices, professional negotiation,
        proper tribunal route) and never through
        self-help eviction. Recovery rarely reaches
        100 percent, but disciplined process keeps
        the loss to 1 to 3 months rather than 6
        to 12.
      </Callout>

      <Pullquote>
        Tenants who do not pay are usually telling
        you something about themselves and about
        your management. Both lessons need to be
        taken seriously next time you re-let.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For our management clients we run defined
        non-payment procedures: day 5 follow up,
        day 15 formal demand, day 30 escalation
        to landlord and lawyer, day 60 tribunal
        filing if not resolved. The discipline is
        the difference between a 6 week problem
        and a 6 month one.
      </P>

      <P>
        Read also our pieces on{" "}
        <Link
          href="/insights/how-to-evict-tenant-kenya-legally"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to evict a tenant legally
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/maintenance-handbook-diaspora-landlords"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          maintenance handbook
        </Link>
        .
      </P>
    </>
  );
}
