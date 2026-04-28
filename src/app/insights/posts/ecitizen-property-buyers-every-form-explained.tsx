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
  slug: "ecitizen-property-buyers-every-form-explained",
  title:
    "eCitizen for property buyers: every form you actually need in 2026",
  description:
    "Almost every Kenyan property transaction now touches the eCitizen platform. KRA PIN, land searches, stamp duty, name search, business registration. Here is the full 2026 walk through of which eCitizen forms property buyers actually need, what they do, and how to use them from abroad.",
  publishedAt: "2024-12-19",
  readingMinutes: 7,
  author: authors.editors,
  tags: [
    "Kenya",
    "eCitizen",
    "Forms",
    "Buying",
    "Diaspora",
    "Government",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "eCitizen for property buyers, every form explained for Kenyan property transactions",
};

export default function Article() {
  return (
    <>
      <Lede>
        Almost every Kenyan property transaction now
        touches the eCitizen platform at some stage.
        For diaspora buyers in particular, eCitizen is
        the central interface with the Kenyan
        government, sitting between the buyer, KRA,
        the Lands Registry and the various counties.
        It is also genuinely confusing the first time
        you use it. This is the practical 2026 walk
        through of every eCitizen form a property buyer
        actually needs, what each one does, and how to
        use the platform efficiently from abroad.
      </Lede>

      <H2 id="account">Setting up your eCitizen account</H2>

      <P>
        Before any forms, the account itself.
      </P>

      <OL>
        <LI>
          Go to ecitizen.go.ke
        </LI>
        <LI>
          Register as either a Kenyan citizen (with ID
          number) or a foreign resident (with passport)
        </LI>
        <LI>
          Verify by SMS or email
        </LI>
        <LI>
          Link your KRA PIN if you have one (or apply
          for one through the platform if you do not)
        </LI>
      </OL>

      <P>
        Diaspora Kenyans should register as Kenyan
        citizens using their ID number, not as foreign
        residents using their passport. This unlocks
        the full set of services. If you do not have a
        Kenyan ID, apply for the ID first; eCitizen
        access flows from the ID.
      </P>

      <H2 id="kra-pin">KRA PIN registration and tax compliance</H2>

      <P>
        Required for any Kenyan property purchase.
      </P>

      <UL>
        <LI>
          <strong>iTax KRA PIN registration</strong>:
          accessed through the iTax module on eCitizen.
          Returns a personal identification number
          (PIN) used across all KRA functions
        </LI>
        <LI>
          <strong>Tax Compliance Certificate (TCC)</strong>:
          renewed annually through iTax. Required for
          various transactions and for sellers on
          completion
        </LI>
        <LI>
          <strong>Capital Gains Tax (CGT) iCMS</strong>:
          assessed and paid through iTax for sellers.
          Buyer may need access to confirm seller
          compliance
        </LI>
      </UL>

      <H2 id="ardhisasa">Ardhisasa: digital land services</H2>

      <P>
        Ardhisasa (ardhisasa.lands.go.ke) is the
        digital platform for land services in Nairobi
        County, Mombasa County and an expanding set of
        counties. Accessed through eCitizen-linked login.
      </P>

      <UL>
        <LI>
          <strong>Title search</strong>: official
          search of any title registered on Ardhisasa.
          KES 500. Returns owner name, parcel size,
          encumbrances, and registered restrictions
        </LI>
        <LI>
          <strong>Land Rates payment</strong>: county
          land rates for the parcel, calculated and
          payable through the platform
        </LI>
        <LI>
          <strong>Land Rent payment</strong>: National
          Land Commission rent for leasehold parcels
        </LI>
        <LI>
          <strong>Consent to transfer</strong>: where
          required (for charged property, for company
          owned property, and certain other situations),
          consent is requested and granted through the
          platform
        </LI>
        <LI>
          <strong>Stamp duty assessment</strong>:
          self-assessed, with valuation reference,
          and paid through the platform; receipt is
          attached to the transfer instrument at
          registration
        </LI>
        <LI>
          <strong>Transfer registration</strong>:
          digital lodgement of the transfer instrument,
          accompanied by the supporting documents
        </LI>
      </UL>

      <P>
        Detail in our{" "}
        <Link
          href="/insights/ardhisasa-using-kenya-digital-land-platform-from-abroad"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Ardhisasa piece
        </Link>
        .
      </P>

      <H2 id="business">Business registration through BRS</H2>

      <P>
        For buyers who want to hold property through a
        company, the Business Registration Service
        (BRS) accessed through eCitizen handles:
      </P>

      <UL>
        <LI>
          <strong>Name search and reservation</strong>:
          KES 150 search, KES 1,000 reservation
        </LI>
        <LI>
          <strong>Limited company registration</strong>:
          KES 10,000 statutory plus professional fees
          for completion
        </LI>
        <LI>
          <strong>Annual returns filing</strong>: required
          annually thereafter
        </LI>
        <LI>
          <strong>Beneficial ownership filing</strong>:
          required at registration and on changes
        </LI>
      </UL>

      <P>
        Detail in our{" "}
        <Link
          href="/insights/personal-name-vs-company-buying-property-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          personal name vs company piece
        </Link>
        .
      </P>

      <H2 id="immigration">Immigration department services</H2>

      <P>
        For non citizen buyers and for diaspora Kenyans
        who need passport renewal:
      </P>

      <UL>
        <LI>
          <strong>Passport application and renewal</strong>:
          for Kenyan citizens. The passport is the
          primary document used in property
          transactions abroad
        </LI>
        <LI>
          <strong>Class G investor permit</strong>: for
          non citizens making a USD 100k+ active
          business investment
        </LI>
        <LI>
          <strong>Class K retiree permit</strong>: for
          non citizens with USD 24k+ external annual
          income
        </LI>
        <LI>
          <strong>Permanent residence application</strong>
          : after 7 years of lawful residence
        </LI>
        <LI>
          <strong>Citizenship by descent registration</strong>
          : for diaspora Kenyans claiming citizenship
          under Article 14 of the 2010 Constitution
        </LI>
      </UL>

      <P>
        Detail in our{" "}
        <Link
          href="/insights/kenya-citizenship-by-investment-residence-permits-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          citizenship piece
        </Link>
        .
      </P>

      <H2 id="county">County government services</H2>

      <P>
        Counties have varying degrees of integration
        with eCitizen. For Nairobi County:
      </P>

      <UL>
        <LI>
          <strong>Land rates</strong>: paid through
          Ardhisasa or directly via Nairobi County
          portal
        </LI>
        <LI>
          <strong>Single Business Permit</strong>: for
          businesses operating from the property
        </LI>
        <LI>
          <strong>Change of user</strong>: for
          repurposing residential to commercial or
          vice versa, applied through the County
          Planning department
        </LI>
        <LI>
          <strong>Building approvals</strong>: for new
          construction or material renovations
        </LI>
      </UL>

      <H2 id="diaspora-flow">A typical diaspora property purchase flow</H2>

      <P>
        Putting it together, a clean diaspora buying
        process touches eCitizen as follows:
      </P>

      <OL>
        <LI>
          Activate Kenyan ID and eCitizen account
        </LI>
        <LI>
          Apply for or confirm KRA PIN through iTax
        </LI>
        <LI>
          Run Ardhisasa search on the target property
        </LI>
        <LI>
          Verify Tax Compliance Certificate of seller
          (through their PIN reference if shared)
        </LI>
        <LI>
          If buying via company, register the company
          through BRS
        </LI>
        <LI>
          Pay stamp duty through Ardhisasa once the
          sale agreement and valuation are in place
        </LI>
        <LI>
          Lodge transfer through Ardhisasa
        </LI>
        <LI>
          Receive registered title through Ardhisasa
        </LI>
        <LI>
          Activate land rates account on Ardhisasa for
          ongoing payment
        </LI>
      </OL>

      <H2 id="practical">Practical tips from abroad</H2>

      <UL>
        <LI>
          Use a single browser and device for eCitizen
          to avoid 2FA confusion
        </LI>
        <LI>
          Save the recovery email and recovery phone
          number to a place you can access from abroad
        </LI>
        <LI>
          Pay through Pesalink, M-Pesa Express or your
          Kenyan bank rather than international card
          (which sometimes fails)
        </LI>
        <LI>
          Keep a paper folder of every successful
          eCitizen transaction (PDF receipts download
          straight from the portal)
        </LI>
        <LI>
          For complex transactions (transfer, company
          registration), let your lawyer handle the
          submission rather than doing it yourself
          while jet-lagged on a Tuesday morning at 3am
        </LI>
      </UL>

      <Callout title="The diaspora user&rsquo;s rule of thumb">
        eCitizen is the gatekeeper for almost every
        Kenyan government interaction. Set up the
        account before you need it. Link KRA, link
        Ardhisasa, link your ID. Then your transactions
        flow rather than stall when you actually need
        them.
      </Callout>

      <Pullquote>
        Five years ago, doing a Kenyan property
        transaction from abroad meant sending physical
        documents back and forth. Today, almost every
        step touches a digital portal. The friction is
        much lower. The literacy needed is real, and
        worth investing 30 minutes to acquire.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For our diaspora clients we walk through the
        eCitizen, Ardhisasa and KRA setup as part of
        onboarding. Most transactional steps are then
        handled by our property lawyers under
        appropriate authority, but the client retains
        full account access and visibility into every
        flow that happens on their portal.
      </P>

      <P>
        Read also our{" "}
        <Link
          href="/insights/ardhisasa-using-kenya-digital-land-platform-from-abroad"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Ardhisasa piece
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/how-to-verify-kenyan-title-deed-from-abroad"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          title verification piece
        </Link>{" "}
        for the deeper dives on the tools above.
      </P>
    </>
  );
}
