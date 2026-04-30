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
  slug: "tenant-deposit-disputes-nairobi",
  title:
    "Tenant deposit disputes in Nairobi: how to recover your deposit",
  description:
    "Deposit recovery is the single most common tenant-landlord dispute in Nairobi. Most are avoidable with the right move-in process and the right move-out documentation. Here is the honest 2026 guide on how to recover your deposit.",
  publishedAt: "2025-12-31",
  readingMinutes: 5,
  author: authors.legal,
  tags: [
    "Deposit",
    "Tenant",
    "Nairobi",
    "Dispute",
    "Lease",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Tenant deposit disputes Nairobi recover deposit guide",
};

export default function Article() {
  return (
    <>
      <Lede>
        Deposit recovery is the single most
        common tenant-landlord dispute in
        Nairobi. Most are avoidable with the
        right move-in process and the right
        move-out documentation. Here is the
        honest 2026 guide on how to recover
        your deposit.
      </Lede>

      <H2 id="move-in">Start at move-in</H2>

      <UL>
        <LI>
          Walk through the property with
          the landlord or agent on the day
          of move-in
        </LI>
        <LI>
          Photograph and video every room,
          including walls, floors, kitchen
          and bathroom fittings
        </LI>
        <LI>
          Document any pre-existing damage
          on a written inspection schedule
          signed by both parties
        </LI>
        <LI>
          Confirm the inventory of furnished
          items where applicable
        </LI>
        <LI>
          Save a copy of the lease, deposit
          receipt and inspection schedule
        </LI>
      </UL>

      <H2 id="during">During the tenancy</H2>

      <UL>
        <LI>
          Notify landlord in writing of any
          damage or repair needs as they
          arise
        </LI>
        <LI>
          Keep all email and SMS
          correspondence
        </LI>
        <LI>
          Pay rent through the bank with
          consistent reference
        </LI>
        <LI>
          Respect compound rules to avoid
          dispute on exit
        </LI>
      </UL>

      <H2 id="move-out">At move-out</H2>

      <UL>
        <LI>
          Give written notice per the lease
        </LI>
        <LI>
          Clean the property professionally;
          photograph and video again
        </LI>
        <LI>
          Schedule a joint exit inspection
          with the landlord or agent
        </LI>
        <LI>
          Sign an exit schedule documenting
          the property condition
        </LI>
        <LI>
          Provide forwarding address and
          bank details for deposit refund
        </LI>
      </UL>

      <H2 id="legitimate">Legitimate deductions</H2>

      <UL>
        <LI>
          Damage beyond fair wear and tear
          (documented)
        </LI>
        <LI>
          Unpaid rent or service charge
        </LI>
        <LI>
          Cost of cleaning if the property
          was left dirty
        </LI>
        <LI>
          Replacement of missing furnished
          items per the inventory
        </LI>
        <LI>
          Outstanding utility bills in the
          tenant’s name
        </LI>
      </UL>

      <H2 id="not-legitimate">Not legitimate deductions</H2>

      <UL>
        <LI>
          Fair wear and tear (carpet
          softening, paint dulling)
        </LI>
        <LI>
          Pre-existing damage documented at
          move-in
        </LI>
        <LI>
          Cost of upgrades the landlord
          chose to make
        </LI>
        <LI>
          Generic “cleaning”
          charges with no invoice
        </LI>
        <LI>
          Cost of repairs not caused by
          the tenant
        </LI>
      </UL>

      <H2 id="dispute">If the landlord refuses to refund</H2>

      <UL>
        <LI>
          Send a formal demand letter
          (registered post or email) with
          itemised list of disputed amounts
        </LI>
        <LI>
          Allow 14 to 30 days for
          response
        </LI>
        <LI>
          Refer to Rent Restriction Tribunal
          (if in scope) or small claims
          court
        </LI>
        <LI>
          Engage a lawyer for amounts above
          KES 200,000
        </LI>
      </UL>

      <Callout title="The deposit rule">
        Photograph everything at move-in and
        move-out. Get the inspection
        schedule signed both times. Pay
        rent through the bank. Keep
        receipts. Following these four steps
        prevents the vast majority of
        deposit disputes.
      </Callout>

      <Pullquote>
        The tenant with photo evidence,
        receipts and signed inspection
        schedules wins almost every deposit
        dispute. The undocumented tenant
        loses almost every one.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For tenant deposit disputes we
        coordinate with independent counsel
        and documentary evidence. Read
        also our pieces on{" "}
        <Link
          href="/insights/tenant-rights-kenya-complete-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          tenant rights Kenya
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/how-to-rent-in-nairobi-foreigner"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to rent in Nairobi
        </Link>
        .
      </P>
    </>
  );
}
