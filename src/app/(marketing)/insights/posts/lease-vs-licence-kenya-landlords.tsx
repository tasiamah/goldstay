import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  H3,
  LI,
  Lede,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "lease-vs-licence-kenya-landlords",
  title:
    "Lease or licence? The distinction that decides what rights your occupant has",
  metaTitle: "Lease vs Licence in Kenya: What Landlords Need to Know",
  description:
    "Calling an agreement a licence does not make it one. Kenyan courts look at exclusive possession, not the heading on the document, and getting the classification wrong changes who can be removed and how quickly.",
  metaDescription:
    "Lease or licence in Kenya: why the heading on the document does not decide it, and how the classification changes what rights your occupant has.",
  publishedAt: "2026-09-07",
  readingMinutes: 8,
  author: authors.legal,
  tags: ["Kenya", "Landlord", "Legal", "Lease", "Tenancy Agreement"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Nairobi apartment building where lease and licence arrangements differ",
};

export default function Article() {
  return (
    <>
      <Lede>
        A landlord who wants an occupant who is
        easy to remove is often advised to head
        the document &ldquo;licence agreement&rdquo;
        rather than &ldquo;lease&rdquo;. It is one
        of the more expensive pieces of informal
        advice circulating in Nairobi, because the
        heading is close to the least important
        thing on the page.
      </Lede>

      <P>
        Kenyan courts, following long established
        common law, decide what an agreement is by
        looking at what it actually does. If the
        occupant has exclusive possession of a
        defined space for a defined period at a
        rent, the arrangement is a lease, and it
        remains a lease if you have typed the word
        licence at the top forty times. The label
        is evidence of intention. It is not
        determinative, and where the substance
        contradicts it, the substance wins.
      </P>

      <H2 id="what-separates-them">What actually separates the two</H2>

      <P>
        A lease grants an interest in land. The
        tenant gets exclusive possession, which
        means the right to exclude everybody
        including the owner, for the term. A
        licence grants permission to be somewhere
        that would otherwise be trespass. The
        licensee has no interest in the land and
        no right to exclude the owner.
      </P>

      <P>
        Three features are usually decisive.
      </P>

      <H3 id="exclusive-possession">Exclusive possession</H3>

      <P>
        This is the main test. Can the occupant
        lock the door and keep the owner out? If
        yes, it is almost certainly a lease. Rooms
        in a shared house where the occupant has
        their own lockable room but shares a
        kitchen may still involve exclusive
        possession of the room itself.
      </P>

      <P>
        The reverse also holds and it is where
        landlords get caught. A clause reserving
        the owner an unrestricted right to enter
        at any time without notice looks like it
        defeats exclusive possession, but if in
        practice the owner never enters and the
        occupant treats the place as their own,
        a court may read the clause as a sham
        inserted to disguise a lease.
      </P>

      <H3 id="term">A defined term</H3>

      <P>
        A lease runs for a certain period, or for
        a period capable of being made certain: a
        year, six months, or month to month until
        terminated on notice. An arrangement with
        no ascertainable term points away from a
        lease.
      </P>

      <H3 id="rent">Rent, or the absence of it</H3>

      <P>
        Rent is usually present in a lease, though
        its absence does not by itself make an
        arrangement a licence. Regular periodic
        payment for occupation of a defined space
        is strong evidence of a tenancy whatever
        the parties call the payment.
      </P>

      <Callout title="The sham clause problem">
        Landlords are sometimes advised to insert
        a clause stating the owner may move other
        occupants into the same unit, on the
        reasoning that this defeats exclusive
        possession and converts the arrangement to
        a licence. Where the clause is never used
        and was never realistically going to be,
        courts have treated such provisions as
        artificial and disregarded them. A clause
        that describes something you have no
        intention of doing tends to damage your
        credibility on the clauses you do intend.
      </Callout>

      <H2 id="why-it-matters">Why the classification changes your position</H2>

      <UL>
        <LI>
          <strong>Removal.</strong> A licence can
          generally be terminated on reasonable
          notice under its own terms, and the
          licensee then has no right to remain. A
          tenant has security derived from the
          tenancy and, where the tenancy is
          controlled, from statute. Removing a
          tenant means the notice sequence and,
          if they do not go, a court or tribunal.
        </LI>
        <LI>
          <strong>Statutory protection.</strong>{" "}
          Where a residential tenancy falls under
          the Rent Restriction Act, the Act
          supplies notice periods and a tribunal
          and you cannot contract out of it. A
          genuine licence sits outside that
          framework.
        </LI>
        <LI>
          <strong>Business premises.</strong> A
          tenancy of shop, hotel or catering
          premises for an unspecified term, or a
          term not exceeding five years, may be a
          controlled tenancy under the Landlord
          and Tenant Shops, Hotels and Catering
          Establishments Act, bringing the
          Business Premises Rent Tribunal into
          play. This catches residential landlords
          who let a ground floor unit to a shop
          without thinking about which statute
          they have walked into.
        </LI>
        <LI>
          <strong>Transferability.</strong> A lease
          is an interest in land and can, subject
          to its terms, be assigned. A licence is
          personal and generally cannot.
        </LI>
        <LI>
          <strong>Registration and duty.</strong>{" "}
          Longer leases attract registration
          requirements and stamp duty. Licences
          generally do not, which is part of their
          appeal and part of why the classification
          gets litigated.
        </LI>
      </UL>

      <Pullquote>
        Courts read the arrangement, not the
        heading. If the occupant can lock the door
        and keep you out for a fixed period at a
        rent, you have granted a lease, whatever
        the document is called.
      </Pullquote>

      <H2 id="where-licences-are-genuine">Where a licence is genuinely the right instrument</H2>

      <P>
        None of this means licences are a fiction.
        There are arrangements that really are
        licences, and dressing them up as leases
        would be equally wrong.
      </P>

      <UL>
        <LI>
          <strong>Serviced and short-stay
          occupation.</strong> A guest in a
          furnished unit for a few nights, where
          the operator retains control, cleans,
          changes linen and can move the guest
          between units, is a licensee. This is
          the ordinary position for short-stay
          letting.
        </LI>
        <LI>
          <strong>Lodgers sharing with the
          owner.</strong> Someone occupying a room
          in a house the owner also lives in,
          without exclusive possession of the
          whole, is usually a licensee.
        </LI>
        <LI>
          <strong>Occupation pending
          completion.</strong> A buyer let into
          possession before completion under a
          sale agreement occupies under a licence,
          not a tenancy.
        </LI>
        <LI>
          <strong>Staff accommodation tied to
          employment.</strong> Where occupation is
          incidental to a job and ends with it, a
          service occupancy can be a licence.
        </LI>
      </UL>

      <H2 id="what-to-do">What this means practically</H2>

      <P>
        If you want a tenant, grant a lease and
        write it properly. The security a tenancy
        gives the occupant is the other side of a
        commitment that also gives you twelve
        months of predictable income, and trying
        to have the income without the commitment
        is what produces documents that fail.
      </P>

      <P>
        If your arrangement genuinely is a licence,
        make the substance match: retain control,
        retain access, retain the ability to
        relocate the occupant, and do those things
        in practice rather than only on paper.
      </P>

      <P>
        And if you are letting to a business, get
        advice before signing. The commercial
        statute has its own tribunal, its own
        notice regime and its own definition of a
        controlled tenancy, and a residential
        landlord who lets a ground floor unit to a
        salon on a handshake has usually not
        realised which framework now applies.
      </P>

      <Callout title="One practical test before you sign">
        Ask yourself whether you could walk into
        the property next Tuesday without asking.
        If the honest answer is no, you are
        granting a lease. Draft accordingly rather
        than hoping the heading saves you.
      </Callout>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We use leases for long term letting and
        licences for short stay, because that is
        what each arrangement actually is. On{" "}
        <Link
          href="/long-term-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          long-term management
        </Link>{" "}
        the tenant gets a properly drafted lease
        with exclusive possession and the notice
        provisions that go with it. On{" "}
        <Link
          href="/airbnb-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          short-stay management
        </Link>{" "}
        the guest occupies under a licence, we
        retain control of the unit, and no
        tenancy arises.
      </P>

      <P>
        Where we inherit a property whose
        agreement is misclassified, and we see it
        regularly, we say so before the renewal
        rather than after the dispute. This
        article is general information and not
        legal advice on your particular
        arrangement, which turns on facts we have
        not seen.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/tenancy-agreement-kenya-landlord-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what a landlord&rsquo;s tenancy agreement
          should contain
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/eviction-kenya-2026-landlord-playbook"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the eviction playbook
        </Link>
        .
      </P>
    </>
  );
}
