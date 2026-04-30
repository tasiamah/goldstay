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
  slug: "tenant-rights-kenya-complete-guide",
  title:
    "Tenant rights in Kenya: the complete 2026 guide",
  description:
    "Tenant rights in Kenya are framed by the Distress for Rent Act, the Rent Restriction Act, the Landlord and Tenant Act and constitutional protections. Here is the honest 2026 plain-English guide on what tenants can and cannot do, and what landlords can and cannot do.",
  publishedAt: "2026-01-03",
  readingMinutes: 6,
  author: authors.legal,
  tags: [
    "Tenant Rights",
    "Kenya",
    "Lease",
    "Landlord",
    "Legal",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Tenant rights Kenya 2026 complete plain-English guide",
};

export default function Article() {
  return (
    <>
      <Lede>
        Tenant rights in Kenya are framed by
        the Distress for Rent Act, the Rent
        Restriction Act, the Landlord and
        Tenant (Shops, Hotels and Catering
        Establishments) Act and constitutional
        protections. The framework is older
        than most tenants realise and there
        are real protections built in. Here
        is the honest 2026 plain-English
        guide.
      </Lede>

      <H2 id="general">General tenant rights</H2>

      <UL>
        <LI>
          Quiet enjoyment of the property
          during the lease
        </LI>
        <LI>
          Reasonable notice from the
          landlord before entry
        </LI>
        <LI>
          Habitable property: water, basic
          structural integrity, lockable
          doors and windows
        </LI>
        <LI>
          Receipt for every rent payment
        </LI>
        <LI>
          Notice before termination per the
          lease (typically 2 to 3 months
          for residential)
        </LI>
        <LI>
          Refund of deposit on exit, less
          legitimate deductions documented
          and proven
        </LI>
      </UL>

      <H2 id="rent-restriction">Rent Restriction Act protection</H2>

      <UL>
        <LI>
          The Rent Restriction Act applies
          to most residential properties
          where rent is below a defined
          threshold (revised periodically;
          confirm current)
        </LI>
        <LI>
          Within scope: tenant cannot be
          evicted without process; rent
          cannot be increased without
          tribunal approval; deposit
          recovery has process protection
        </LI>
        <LI>
          Premium properties typically fall
          outside the threshold and
          contract terms apply
        </LI>
      </UL>

      <H2 id="entry">Entry rights of the landlord</H2>

      <UL>
        <LI>
          Landlord must give reasonable
          notice (typically 24 to 48 hours
          for non-emergency entry)
        </LI>
        <LI>
          Emergency entry permitted (water
          leak, fire risk)
        </LI>
        <LI>
          Entry without notice for routine
          inspections is not permitted
        </LI>
      </UL>

      <H2 id="eviction">Eviction process</H2>

      <UL>
        <LI>
          Landlord cannot self-evict;
          self-help eviction is unlawful
        </LI>
        <LI>
          Court or tribunal order required
        </LI>
        <LI>
          Distress for rent: landlord may
          attach goods through court
          process for unpaid rent
        </LI>
        <LI>
          Notice periods specified by
          lease and statute
        </LI>
      </UL>

      <H2 id="deposit">Deposit recovery</H2>

      <UL>
        <LI>
          Deposit refundable on exit less
          legitimate deductions
        </LI>
        <LI>
          Deductions must be documented
          (photographic evidence and
          itemised invoices)
        </LI>
        <LI>
          Disputes can be referred to
          Rent Restriction Tribunal where
          in scope; otherwise small claims
          court
        </LI>
      </UL>

      <H2 id="rent-increase">Rent increase</H2>

      <UL>
        <LI>
          Within Rent Restriction Act
          scope: tribunal approval required
        </LI>
        <LI>
          Outside scope: per lease
          provisions; commonly capped at a
          percentage at renewal
        </LI>
      </UL>

      <H2 id="tenant-obligations">Tenant obligations</H2>

      <UL>
        <LI>
          Pay rent on time
        </LI>
        <LI>
          Keep the property in reasonable
          condition
        </LI>
        <LI>
          Notify the landlord of damage or
          repair needs
        </LI>
        <LI>
          Respect compound rules and
          neighbour rights
        </LI>
        <LI>
          Vacate per notice when the lease
          ends
        </LI>
      </UL>

      <H2 id="disputes">Dispute resolution</H2>

      <UL>
        <LI>
          Rent Restriction Tribunal for
          residential within scope
        </LI>
        <LI>
          Business Premises Tribunal for
          commercial property
        </LI>
        <LI>
          Small claims court for monetary
          disputes
        </LI>
        <LI>
          High Court for complex matters
        </LI>
      </UL>

      <Callout title="The tenant rule">
        Document everything. Pay through
        the bank. Keep receipts. Know your
        scope under the Rent Restriction
        Act. The legal framework is more
        protective than most tenants assume,
        and most landlords respect process
        once the tenant is informed.
      </Callout>

      <Pullquote>
        Most Kenyan tenant rights disputes
        are won not in court but at the
        documentation stage. The tenant
        with photos, receipts and a
        signed lease has options the
        undocumented tenant does not.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For tenant disputes we coordinate
        with independent counsel. Read also
        our pieces on{" "}
        <Link
          href="/insights/tenant-deposit-disputes-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          tenant deposit disputes
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/how-to-break-nairobi-lease-early"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to break a Nairobi lease early
        </Link>
        .
      </P>
    </>
  );
}
