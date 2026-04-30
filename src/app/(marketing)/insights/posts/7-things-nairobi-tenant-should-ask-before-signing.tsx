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
  slug: "7-things-nairobi-tenant-should-ask-before-signing",
  title:
    "7 things every Nairobi tenant should ask before signing a lease",
  description:
    "Most Nairobi tenants sign leases without asking the questions that matter. The compound, the services, the rent, the rules and the exit terms can vary dramatically. Here are the 7 questions every Nairobi tenant should ask before signing.",
  publishedAt: "2026-04-08",
  readingMinutes: 5,
  author: authors.editors,
  tags: [
    "Tenant",
    "Lease",
    "Nairobi",
    "Renting",
    "Buyer Guide",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "7 things Nairobi tenant should ask before signing lease 2026",
};

export default function Article() {
  return (
    <>
      <Lede>
        Most Nairobi tenants sign leases
        without asking the questions that
        matter. The compound, the services,
        the rent, the rules and the exit
        terms vary dramatically. Here are
        the 7 questions every Nairobi
        tenant should ask before signing.
      </Lede>

      <H2 id="1">1. What is the all-in monthly cost?</H2>

      <P>
        Rent is one number. Service charge,
        generator levy, water levy, parking
        levy, internet, DSTV and security
        contribution can add 15 to 30 percent
        on top. Ask for the all-in number
        before signing.
      </P>

      <H2 id="2">2. Who pays the service charge?</H2>

      <P>
        In some compounds the landlord pays
        service charge from rent; in others
        the tenant pays separately. The
        same headline rent can mean
        meaningfully different total cost.
        Confirm in writing in the lease.
      </P>

      <H2 id="3">3. What happens during power and water outages?</H2>

      <P>
        Reliable backup power and water
        differ massively between compounds.
        Ask about the generator capacity,
        runtime, fuel arrangement and any
        levy. Ask about water tank capacity
        and city water reliability. The
        difference is real quality of
        life.
      </P>

      <H2 id="4">4. What is the deposit and refund policy?</H2>

      <P>
        Deposit is typically 1 to 2
        months. Confirm refund timeline
        (30 to 60 days standard), allowed
        deductions (damage beyond fair
        wear, unpaid rent, unpaid bills)
        and the inventory check process at
        check-in. Photograph everything at
        check-in.
      </P>

      <H2 id="5">5. What are the exit terms?</H2>

      <P>
        Notice period (often 60 to 90 days),
        early break clauses, lease break
        penalties. The cohort that gets
        caught: tenants on 1-year leases
        without break clauses who change
        jobs or relocate.
      </P>

      <H2 id="6">6. What are the compound rules?</H2>

      <UL>
        <LI>
          Pet policy (highly compound-specific)
        </LI>
        <LI>
          Short-let permission (most
          compounds prohibit)
        </LI>
        <LI>
          Visitor and parking rules
        </LI>
        <LI>
          Noise and event policy
        </LI>
        <LI>
          Renovation and decoration
          permissions
        </LI>
      </UL>

      <H2 id="7">7. Who is the actual landlord?</H2>

      <P>
        The agent is not the landlord.
        Confirm the registered title
        ownership and verify the
        landlord’s bank account before
        paying deposit or rent. The most
        common rental scam in Nairobi:
        someone without ownership taking
        deposits.
      </P>

      <H2 id="bonus">Bonus questions worth asking</H2>

      <UL>
        <LI>
          What is the rent escalation
          clause? (annual increase, often
          5 to 10 percent)
        </LI>
        <LI>
          Who handles maintenance and how
          quickly?
        </LI>
        <LI>
          Are utilities individually metered
          or shared?
        </LI>
        <LI>
          Is the unit furnished and what
          inventory?
        </LI>
        <LI>
          What happens if I want to
          renew?
        </LI>
      </UL>

      <Callout title="The tenant signing rule">
        Slow down before signing. Ask the
        7 questions. Get the answers in
        writing. The leases that produce
        problems are almost always the
        ones tenants signed without
        asking the questions that
        mattered.
      </Callout>

      <Pullquote>
        Renting in Nairobi works smoothly
        for the tenants who treat the
        lease as a real contract. It
        produces problems for the tenants
        who treat it as a formality.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For tenants we coordinate clear
        leases with verified landlords and
        full transparency. Read also our
        pieces on{" "}
        <Link
          href="/insights/tenant-rights-kenya-complete-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          tenant rights Kenya
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/tenant-deposit-disputes-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          tenant deposit disputes
        </Link>
        .
      </P>
    </>
  );
}
