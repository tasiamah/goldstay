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
  slug: "estate-planning-diaspora-kenyans-wills-succession",
  title:
    "Estate planning for diaspora Kenyans: wills, succession and avoiding the family land mess",
  description:
    "Without a Kenyan-recognised will, Kenyan property goes through intestate succession under the Law of Succession Act, often messily and across borders. Here is how a diaspora Kenyan should structure a will, when a Kenyan trust makes sense, the role of dual citizenship and how to avoid the family land disputes that haunt every generation.",
  publishedAt: "2025-06-24",
  readingMinutes: 9,
  author: authors.legal,
  tags: [
    "Kenya",
    "Estate Planning",
    "Will",
    "Succession",
    "Diaspora",
    "Inheritance",
    "Trust",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Estate planning wills succession for diaspora Kenyans, Kenyan property inheritance and family land",
};

export default function Article() {
  return (
    <>
      <Lede>
        Almost every diaspora Kenyan we work with knows
        someone whose family lost a piece of land or got
        stuck in a multi-year succession case after a
        parent died. The pattern is consistent: no will, or
        a will that did not work in Kenya, mixed with a
        cross-border family situation and Kenyan property
        whose registration was never updated. The
        prevention is straightforward and inexpensive. The
        cost of skipping it is high. Here is the practical
        2026 picture for diaspora Kenyans planning around
        Kenyan property.
      </Lede>

      <H2 id="without-a-will">What happens without a will</H2>

      <P>
        Kenyan property of a person who dies without a
        valid will (intestate) is distributed under the
        Law of Succession Act. The Act lays out an order
        of priority among surviving spouse(s), children
        and parents. The surviving spouse takes a life
        interest in part of the estate; the children share
        the residue; specific rules apply where there is
        more than one surviving spouse.
      </P>

      <P>
        For diaspora families this default produces
        predictable problems:
      </P>

      <UL>
        <LI>
          Foreign-passport children may face delays in
          taking their share, particularly under the
          Article 65 freehold rule (covered in the{" "}
          <Link
            href="/insights/freehold-vs-leasehold-kenya-citizenship-rules"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            citizenship and freehold piece
          </Link>
          ).
        </LI>
        <LI>
          Disputes between children, between siblings of
          the deceased and the spouse, and between
          spouses where there are multiple recognised
          marriages.
        </LI>
        <LI>
          Properties become unsellable for years while the
          succession case sits in court.
        </LI>
        <LI>
          Land and apartments end up registered in a
          deceased person&rsquo;s name long after death,
          with rents diverted, service charge arrears
          accumulating and eventual buyers facing title
          chains they cannot clean up.
        </LI>
      </UL>

      <H2 id="kenyan-will">The Kenyan will</H2>

      <P>
        The cleanest single intervention for a diaspora
        Kenyan with property in Kenya is a Kenyan-law will,
        prepared and executed under the Law of Succession
        Act. Key requirements:
      </P>

      <OL>
        <LI>
          <strong>Written.</strong> Oral wills are
          recognised in narrow circumstances but should not
          be relied on.
        </LI>
        <LI>
          <strong>Signed by the testator.</strong> Or
          signed by another person at the testator&rsquo;s
          direction in their presence.
        </LI>
        <LI>
          <strong>Witnessed by at least two
          witnesses.</strong> Each witness signs in the
          presence of the testator. Witnesses cannot be
          beneficiaries.
        </LI>
        <LI>
          <strong>Clear identification of property and
          beneficiaries.</strong> Title numbers, addresses,
          full names of beneficiaries with KRA PINs and
          ID/passport numbers where available.
        </LI>
        <LI>
          <strong>Executor named.</strong> A trusted
          executor (or executors) who will obtain probate
          and administer the estate.
        </LI>
      </OL>

      <P>
        The will can be drafted by a Kenyan property
        lawyer, executed remotely with witnessed signing,
        and stored either with the lawyer, with a Kenyan
        bank&rsquo;s safe custody service, or registered
        with the Public Trustee.
      </P>

      <H2 id="cross-border">Cross-border wills: the trap to avoid</H2>

      <P>
        Diaspora Kenyans typically have a will in their
        country of residence (UK, US, Canada, UAE, EU)
        covering their assets there. A common mistake is
        assuming that will covers Kenyan property too.
      </P>

      <P>
        The reality:
      </P>

      <UL>
        <LI>
          Kenyan immovable property (land, buildings)
          devolves under Kenyan law regardless of where
          the deceased was domiciled.
        </LI>
        <LI>
          A will validly executed abroad can be admitted
          to probate in Kenya through the foreign grant
          resealing process, but it is slower and more
          expensive than a directly executed Kenyan will.
        </LI>
        <LI>
          A will executed only abroad and not properly
          referencing Kenyan property risks ambiguity that
          gets litigated.
        </LI>
      </UL>

      <P>
        The cleanest structure is two coordinated wills:
      </P>

      <OL>
        <LI>
          A will in your country of residence covering
          assets there
        </LI>
        <LI>
          A separate Kenyan-law will covering Kenyan
          property and Kenyan-located assets, with the
          two wills explicitly cross-referenced so neither
          revokes the other
        </LI>
      </OL>

      <P>
        Drafting fees are modest (KES 50,000 to KES
        200,000 for a Kenyan-law will from a competent
        property lawyer). For an estate that includes any
        Kenyan property worth keeping, this is the single
        cheapest piece of estate-planning insurance you
        will buy.
      </P>

      <H2 id="dual-citizenship-relevance">Why dual citizenship matters here</H2>

      <P>
        For an heir who is not a Kenyan citizen,
        inheritance of freehold land is automatically
        converted to 99-year leasehold under Article 65
        (covered in detail in the{" "}
        <Link
          href="/insights/freehold-vs-leasehold-kenya-citizenship-rules"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          citizenship and freehold piece
        </Link>
        ). The conversion is permanent. For families with
        freehold land they intend to keep across
        generations, the dual-citizenship status of the
        intended heirs is therefore a material planning
        question.
      </P>

      <P>
        For most apartment-only portfolios this does not
        matter; the underlying land is already leasehold.
        For family land, agricultural acreage and freehold
        suburban homes it matters a great deal.
      </P>

      <H2 id="trusts">When a Kenyan family trust makes sense</H2>

      <P>
        Family trusts under the Trustee Act, particularly
        registered family trusts under the Trustees
        (Perpetual Succession) Act framework, can be a
        powerful tool for diaspora estates. They allow:
      </P>

      <UL>
        <LI>
          Property held by the trust rather than by an
          individual whose death triggers succession
        </LI>
        <LI>
          Pre-defined trustees and beneficiaries with
          clear distribution rules
        </LI>
        <LI>
          Stamp duty exemption on transfers between
          spouses and into family trusts (subject to KRA
          approval)
        </LI>
        <LI>
          Continuity through generations without repeated
          succession events
        </LI>
      </UL>

      <P>
        Trusts are most useful for:
      </P>

      <OL>
        <LI>
          Estates of meaningful size (typically KES 50m+
          where the structure cost is justified)
        </LI>
        <LI>
          Multi-generational family land that the family
          intends to hold long term
        </LI>
        <LI>
          Cross-border families where multiple
          jurisdictions are involved
        </LI>
        <LI>
          Beneficiaries who are minors or otherwise not
          ready to hold property directly
        </LI>
      </OL>

      <P>
        For a single Nairobi apartment owned by a couple,
        a trust is probably overkill. A coordinated will
        does the job at a tenth of the cost.
      </P>

      <H2 id="probate">Probate and what your executor will face</H2>

      <P>
        Probate of a Kenyan will is granted by the High
        Court&rsquo;s Family Division. Typical sequence:
      </P>

      <OL>
        <LI>
          Executor files a petition for grant of probate
          with the will, a death certificate and an
          affidavit
        </LI>
        <LI>
          Court advertises the petition and waits a
          statutory period (typically 30 days) for any
          objections
        </LI>
        <LI>
          If no objections, grant of probate is issued,
          allowing the executor to deal with the assets
        </LI>
        <LI>
          Executor pays any debts and taxes, then
          distributes assets to beneficiaries
        </LI>
        <LI>
          Title transfers are processed at the Lands
          Registry
        </LI>
      </OL>

      <P>
        Realistic timeline for a clean, uncontested
        probate: 6 to 12 months. For a contested or
        complex estate: 2 to 5 years, sometimes longer.
        The cleanest estates are processed faster than
        the messy ones by a wide margin.
      </P>

      <H2 id="practical-checklist">Practical checklist for diaspora Kenyans</H2>

      <OL>
        <LI>
          <strong>Inventory.</strong> List every Kenyan
          asset: title numbers, account numbers, share
          holdings, insurance policies. Keep the inventory
          current and accessible to your executor.
        </LI>
        <LI>
          <strong>Kenyan will.</strong> Drafted by a
          competent Kenyan property lawyer, executed
          properly, stored where your executor can find
          it. Cross-referenced with your country-of-residence
          will.
        </LI>
        <LI>
          <strong>Citizenship status of intended heirs.</strong>{" "}
          Particularly relevant for any freehold property.
          Encourage adult diaspora children to claim or
          retain Kenyan citizenship if family land is
          intended to be kept long term.
        </LI>
        <LI>
          <strong>Executor brief.</strong> A single
          document your executor can read in one sitting:
          where the will is, who your lawyer is, what
          assets exist, where the title documents live,
          what bank accounts hold operating funds.
        </LI>
        <LI>
          <strong>Property management continuity.</strong>{" "}
          Property held under a long-term management
          arrangement does not stop generating rent at the
          owner&rsquo;s death. The management arrangement
          continues through probate and beyond. This is
          one of the underrated benefits of professional
          management for diaspora landlords.
        </LI>
        <LI>
          <strong>Update on life events.</strong> Marriage,
          divorce, births, deaths and significant property
          acquisitions or disposals trigger a review of
          both the inventory and the will.
        </LI>
      </OL>

      <Callout title="The single sharpest piece of advice">
        Most Kenyan family land disputes can be traced to
        one of three things: no will, a will that was not
        executed properly, or property still registered
        in a deceased person&rsquo;s name years after
        their death. All three are preventable for a
        few hundred dollars and an afternoon&rsquo;s
        work. The reason most families do not do it is
        that the topic is unpleasant, not that it is hard.
      </Callout>

      <Pullquote>
        The cheapest gift you can give the next generation
        of your family is a clean Kenyan will. The most
        expensive thing you can leave them is property in
        a name nobody can transfer.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We do not draft wills. We work alongside
        established Kenyan property lawyers who do, and we
        flag estate planning as a workstream during
        property purchase for clients who do not yet have
        a Kenyan-law will. For property under our
        management we ensure executor and successor
        contact details are documented so management
        continuity survives any owner-side life event
        without operational interruption.
      </P>

      <P>
        Read also our pieces on{" "}
        <Link
          href="/insights/freehold-vs-leasehold-kenya-citizenship-rules"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          freehold and the citizenship rule
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/personal-name-vs-company-buying-property-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          personal name versus company ownership
        </Link>{" "}
        for the structuring decisions that interact with
        succession.
      </P>
    </>
  );
}
