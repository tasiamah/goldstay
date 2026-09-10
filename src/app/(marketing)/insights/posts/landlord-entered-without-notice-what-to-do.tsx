import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  KeySummary,
  LI,
  Lede,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "landlord-entered-without-notice-what-to-do",
  title:
    "Landlord entered without notice: what to do in Kenya",
  description:
    "Landlord entry without notice is a common Nairobi tenant complaint. Most landlords are unaware of their legal obligation; some know and ignore. Here is the honest 2026 guide on tenant rights, the legal framework and the practical response.",
  metaDescription:
    "Landlord entry without notice is a common Nairobi tenant complaint. Most landlords are unaware of their legal obligation; some know and ignore.",
  publishedAt: "2025-12-25",
  readingMinutes: 4,
  author: authors.legal,
  tags: [
    "Landlord",
    "Tenant Rights",
    "Kenya",
    "Privacy",
    "Lease",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Landlord entered without notice Kenya tenant guide",
};

export default function Article() {
  return (
    <>
      <Lede>
        Landlord entry without notice is a
        common Nairobi tenant complaint. Most
        landlords are unaware of their legal
        obligation; some know and ignore.
        Here is the honest 2026 guide on
        tenant rights, the legal framework
        and the practical response.
      </Lede>

      <KeySummary
        question="Can a landlord enter without notice in Kenya?"
        answer="Only in a genuine emergency. A tenant has a right to quiet enjoyment of the property, and a landlord must give reasonable notice before entering, which in practice means 24 to 48 hours. Emergencies that justify immediate entry are things like a burst pipe, a fire risk, a gas leak or an immediate structural danger. What does not qualify is a routine inspection, showing the place to prospective tenants, repair work that could have been scheduled, or simply checking up on the tenant. The proportionate response to a first breach is a written note asking for notice in future and citing the notice clause in the lease. If it continues, escalate in writing, and then to the Rent Restriction Tribunal where the tenancy falls within its scope, or the small claims court for damages or an injunction where it does not."
        facts={[
          { label: "Notice required", value: "Reasonable, typically 24 to 48 hours" },
          { label: "Emergency entry", value: "Burst pipe, fire, gas, structural" },
          { label: "Not an emergency", value: "Inspections, viewings, checking up" },
          { label: "First response", value: "Written note citing the lease clause" },
          { label: "If it continues", value: "Tribunal, or small claims court" },
          { label: "Underlying right", value: "Quiet enjoyment of the property" },
        ]}
      />

      <H2 id="legal">The legal framework</H2>

      <UL>
        <LI>
          Tenants have a right to quiet
          enjoyment of the property
        </LI>
        <LI>
          Landlord must give reasonable
          notice before entry (typically 24
          to 48 hours, except emergencies)
        </LI>
        <LI>
          Emergency entry permitted (water
          leak, fire risk, immediate
          structural concern)
        </LI>
        <LI>
          Routine inspection without notice
          is not permitted
        </LI>
      </UL>

      <H2 id="emergency">What counts as emergency</H2>

      <UL>
        <LI>
          Burst water pipe affecting
          property or neighbour
        </LI>
        <LI>
          Fire risk
        </LI>
        <LI>
          Immediate structural concern
          (collapsed ceiling, broken
          window security)
        </LI>
        <LI>
          Gas leak or other safety hazard
        </LI>
      </UL>

      <H2 id="not-emergency">What does not count</H2>

      <UL>
        <LI>
          Showing the property to potential
          new tenants without notice
        </LI>
        <LI>
          Routine inspection without notice
        </LI>
        <LI>
          “Checking up” on the
          tenant
        </LI>
        <LI>
          Repair work that could have been
          scheduled
        </LI>
      </UL>

      <H2 id="response">Practical response</H2>

      <UL>
        <LI>
          First time: a written note to the
          landlord requesting reasonable
          notice for future entry
        </LI>
        <LI>
          Cite the lease provision (most
          leases include reasonable-notice
          clauses)
        </LI>
        <LI>
          Keep correspondence in writing
        </LI>
        <LI>
          Repeat offence: a more formal
          letter or email referencing the
          legal framework and lease
        </LI>
        <LI>
          Continued breach: refer to Rent
          Restriction Tribunal where in
          scope; otherwise small claims
          court for damages or injunction
        </LI>
      </UL>

      <H2 id="security">Practical security measures</H2>

      <UL>
        <LI>
          Change locks (where lease
          permits) and provide a copy to
          the landlord per agreement
        </LI>
        <LI>
          Install a doorbell camera at the
          flat door (where compound permits)
        </LI>
        <LI>
          Document any unauthorised entry
          with date, time and details
        </LI>
        <LI>
          Do not escalate physically;
          escalate in writing
        </LI>
      </UL>

      <Callout title="The privacy rule">
        Document every unauthorised entry.
        Communicate in writing. Reference
        the lease and the legal framework.
        The vast majority of landlords
        adjust once they understand the
        tenant knows their rights.
      </Callout>

      <Pullquote>
        Most Kenyan landlords entering
        without notice are not malicious;
        they are unaware. A written
        reminder usually solves it. The
        ones who ignore the reminder are
        a much smaller cohort and they
        respond to the legal route.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For tenant clients facing landlord
        entry issues we coordinate written
        communication and legal escalation
        where needed. Read also our pieces
        on{" "}
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
      <P>
        Vetting at this level is what{" "}
        <Link
          href="/tenant-finding"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          our tenant finding and vetting
        </Link>{" "}
        is built around.
      </P>
    </>
  );
}
