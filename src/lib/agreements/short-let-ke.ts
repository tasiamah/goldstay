// GoldStay Short-Let Property Management Agreement (Kenya).
//
// Faithful transcription of the executed source document, issued by
// EAR TADCO LIMITED t/a GoldStay under Kenyan law. It is the contract
// served to Kenyan clients onboarding a SHORT_TERM property; long-term
// lettings and Ghana properties still get the generic agreement in
// ./text.ts. The dispatcher lives in ./template.ts.
//
// Two rules when editing this file:
//
//   1. The clause text is legal copy. Do not reword it to read better.
//      If a clause needs to change, the source document changes first
//      and SHORT_LET_KE_VERSION is bumped, because every accepted
//      agreement stores the version it was accepted under and a
//      reprint must reproduce that exact text.
//   2. Never hard-code a commercial term that also lives on the
//      ManagementAgreement row. Fee, term length and notice period are
//      interpolated from the snapshot so the prose and the database can
//      never disagree — a contract saying "three months" while the row
//      says twelve is the one bug in here that would actually cost
//      money.
//
// Thresholds stated in the document itself and nowhere else (the USD 50
// evidence line, the USD 250 pre-approval line, the 5th-of-month payout
// date, the 14-day authority cure period) are hard-coded, because the
// document is their only source of truth.

import type { AgreementScheduleRow, AgreementSection } from "./text";
import type { SigningCapacity } from "@prisma/client";
import { SIGNING_CAPACITY_SCHEDULE_LABEL } from "@/lib/signing-capacity";
import { MANAGER, MANAGER_SIGNING_NAME } from "./manager";

// Bumped whenever the clause text below changes. Stored on every
// agreement row at issue and printed on the acceptance record, which
// clause 12.3 requires to identify the Agreement version.
//
// v2 removed the Forecast Monthly Management Fee: its Schedule 1
// line, its definition, and limb (b) of the clause 10.3 early-exit
// calculation, leaving the Early Termination Amount as unrecovered
// Startup Costs alone. The figure was never once recorded against a
// property, so every contract issued under v1 already printed it as
// "to be confirmed" with limb (b) yielding nothing — the change
// removes wording that had no operative effect rather than altering
// a term anyone relied on.
export const SHORT_LET_KE_VERSION = "short-let-ke-v2";

export type ShortLetContext = {
  // Header block and Schedule 1 "Client" row.
  clientLegalName: string;
  clientIdNumber: string | null;
  clientKraPin: string | null;
  clientAddress: string | null;
  // Schedule 1 "Client capacity and Property" row.
  signingCapacity: SigningCapacity;
  propertyDescription: string;
  bedrooms: number | null;
  maxOccupancy: number | null;
  // Dates. launchDate is null until the listing is published — the
  // Initial Commitment Period runs from it, so Schedule 1 says so
  // rather than inventing a date.
  startDate: Date;
  launchDate: Date | null;
  // Commercial terms, all snapshotted from the ManagementAgreement
  // row and pre-formatted by the caller. The `| null` ones render as
  // "to be confirmed", which Schedule 1 expressly permits.
  commissionPct: string;
  termMonths: number;
  noticePeriodDays: number;
  payoutCurrency: string;
  startupCostsBudgetFormatted: string | null;
  operatingReserveFormatted: string | null;
  // Reference printed at the head of the contract, e.g. GS-2026-004.
  reference: string | null;
};

const TBC = "To be confirmed through GoldStay onboarding";

function orTbc(value: string | null | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : TBC;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Schedule 1 rows. Kept separate from the clause list because the
// renderers lay tables out differently from prose, and because this is
// the only part of the contract that changes per client.
function scheduleOne(ctx: ShortLetContext): AgreementScheduleRow[] {
  return [
    {
      label: "Manager",
      value: [
        MANAGER_SIGNING_NAME,
        `Company no.: ${MANAGER.companyNumber}`,
        `Registered office: ${MANAGER.registeredOffice}`,
      ],
    },
    {
      label: "Client",
      value: [
        ctx.clientLegalName,
        `ID / registration no.: ${orTbc(ctx.clientIdNumber)}`,
        `KRA PIN: ${orTbc(ctx.clientKraPin)}`,
        `Address: ${orTbc(ctx.clientAddress)}`,
      ],
    },
    {
      label: "Client capacity and Property",
      value: [
        `Capacity: ${SIGNING_CAPACITY_SCHEDULE_LABEL[ctx.signingCapacity]}`,
        `Property: ${ctx.propertyDescription}`,
        `Bedrooms: ${ctx.bedrooms ?? "To be confirmed"}  |  Maximum occupancy: ${
          ctx.maxOccupancy ?? "To be confirmed"
        }`,
      ],
    },
    {
      label: "Dates and minimum term",
      value: [
        `Start Date: ${formatDate(ctx.startDate)}`,
        `Launch Date: ${
          ctx.launchDate
            ? formatDate(ctx.launchDate)
            : "Recorded by GoldStay when the Property is first published for booking"
        }`,
        `Initial Commitment Period: ${ctx.termMonths} full calendar months from the Launch Date`,
      ],
    },
    {
      label: "Appointment and channels",
      value: [
        "Exclusive",
        "Channels: Airbnb, Booking.com, GoldStay direct, and any further channel approved for the Property",
        "Listing account: GoldStay-controlled unless confirmed otherwise during onboarding",
      ],
    },
    {
      label: "Management Fee",
      value: [
        `${ctx.commissionPct} of Gross Booking Revenue, exclusive of applicable VAT or similar tax`,
      ],
    },
    {
      label: "Startup Costs",
      value: [
        "Reasonable photography and launch costs, itemised and deducted from the first payout",
        `Estimated budget (if known): ${orTbc(ctx.startupCostsBudgetFormatted)}`,
      ],
    },
    {
      label: "Payouts",
      value: [
        "By the 5th monthly for available preceding-month funds",
        `Currency: ${ctx.payoutCurrency}`,
        `Operating reserve: ${orTbc(ctx.operatingReserveFormatted)}`,
      ],
    },
    {
      label: "Pricing",
      value: [
        "Full dynamic pricing within the authority in this Schedule",
        "Nightly floor and Client blackout dates: as agreed through GoldStay onboarding",
      ],
    },
    {
      label: "Expense controls",
      value: [
        "Evidence above USD 50 equivalent where ordinarily available",
        "Written approval above USD 250 equivalent for a single non-emergency expense",
      ],
    },
    {
      label: "Rules, bookings and other terms",
      value: [
        "Special house rules: as agreed through GoldStay onboarding",
        "Existing confirmed bookings: none unless a list is attached",
        "Other agreed terms: none",
      ],
    },
  ];
}

export function buildShortLetKeSections(
  ctx: ShortLetContext,
): AgreementSection[] {
  const managerParty = `${MANAGER.legalName}, a private limited company registered in Kenya under company number ${MANAGER.companyNumber}, with its registered office at ${MANAGER.registeredOffice}, trading as “${MANAGER.tradingName}” (the “Manager”); and`;

  return [
    {
      heading: "Key commercial terms",
      body: [
        "A practical agreement between GoldStay and the person authorised to operate the Property for short stays.",
      ],
      rows: [
        { label: "Property", value: [ctx.propertyDescription] },
        { label: "Client", value: [ctx.clientLegalName] },
        { label: "Start date", value: [formatDate(ctx.startDate)] },
        {
          label: "Agreement reference",
          value: [ctx.reference ?? "Issued on acceptance"],
        },
        {
          label: "Management fee",
          value: [`${ctx.commissionPct} of Gross Booking Revenue`],
        },
        { label: "Client payout", value: ["5th monthly"] },
        { label: "Client visibility", value: ["Live dashboard"] },
        { label: "Payout currency", value: [ctx.payoutCurrency] },
        {
          label: "Minimum term",
          value: [`${ctx.termMonths} months from the Launch Date`],
        },
      ],
    },
    {
      heading: "Parties and agreement",
      body: [
        "This Short-Let Property Management Agreement (the “Agreement”) is entered into on the Start Date stated in Schedule 1 between:",
        `(a) ${managerParty}`,
        "(b) the person or entity identified in Schedule 1 (the “Client”).",
        "The Client appoints the Manager to market and manage the Property for short stays. The Client may be the registered owner, a tenant or lessee with written short-let rights, or another authorised operator. The Schedules form part of this Agreement.",
      ],
    },
    {
      heading: "1. Definitions and interpretation",
      body: [
        "1.1 “Booking Channel” means Airbnb, Booking.com, the GoldStay direct-booking channel, or another channel approved for the Property.",
        "1.2 “Gross Booking Revenue” means accommodation charges received for stays before channel commissions, processing charges, the Management Fee, or Property Expenses. It excludes separately itemised cleaning or laundry charges, refundable deposits, taxes collected for remittance, refunds, chargebacks, and damage compensation.",
        `1.3 “Management Fee” means ${ctx.commissionPct} of Gross Booking Revenue, plus any tax required by law to be charged on the fee.`,
        "1.4 “Launch Date” means the date on which the Property is first published and made available for booking through an approved Booking Channel, as recorded by the Manager.",
        "1.5 “Net Client Proceeds” means Gross Booking Revenue plus other non-refundable amounts collected for the Property, including separately itemised cleaning or laundry charges, less the Management Fee, channel and processing charges, refunds, chargebacks, taxes, Startup Costs, Property Expenses, reserves, and other authorised deductions.",
        "1.6 “Startup Costs” means reasonable launch costs such as photography, an initial deep clean, linen or consumable setup, access setup, listing assets, and minor styling. They are separate from the Management Fee.",
        "1.7 “Property Expenses” means reasonable third-party operating costs, including cleaning, laundry, consumables, maintenance, repairs, replacements, call-outs, utilities, licences, and approved professional services.",
      ],
    },
    {
      heading: "2. Appointment and authority",
      body: [
        "2.1 The Client appoints GoldStay as the exclusive manager of the Property for short-let bookings during this Agreement, unless Schedule 1 states otherwise.",
        "2.2 The Client authorises the Manager, as operational agent, to advertise the Property, manage prices, calendars and bookings, communicate with guests, collect proceeds, arrange access and service providers, enforce house rules, and provide reasonable guest remedies.",
        "2.3 The Manager may use employees and independent service providers but may not sell, mortgage, grant a long-term lease over, or otherwise encumber the Property.",
      ],
    },
    {
      heading: "3. Services",
      body: [
        "3.1 The Manager will provide the services listed in Schedule 2 with reasonable care and skill.",
        "3.2 Within the authority in Schedule 1, the Manager may adjust rates, minimum stays, promotions, and availability in response to demand.",
        "3.3 Occupancy, rates, revenue, guest conduct, reviews, and investment returns are not guaranteed. Forecasts are estimates.",
      ],
    },
    {
      heading: "4. Listings, calendars, and bookings",
      body: [
        "4.1 The Client must disclose personal stays, maintenance closures, third-party bookings, and other restrictions, and bears losses caused by undisclosed conflicts or blocked access.",
        "4.2 Confirmed bookings will be honoured unless agreed otherwise. Client-requested cancellations are at the Client’s cost, including refunds, relocation, channel penalties, and reasonable administration, except where caused by the Manager’s breach.",
        "4.3 The Manager may select reasonable channel settings and decline or cancel bookings for safety, fraud, legal compliance, non-payment, serious rule breaches, or protection of the Property, subject to channel rules.",
        "4.4 Schedule 1 identifies whether each listing is operated through a GoldStay-controlled account or a Client-controlled account. Channel rules prevail where they restrict ownership, access, or transfer.",
        "4.5 For a GoldStay-controlled account, as between the parties, the account, listing, listing URL, ranking, and review history remain with GoldStay and are not transferable to the Client. After termination, the Client may create a new listing independently using materials it owns, but has no right to GoldStay’s account or review history.",
        "4.6 For a Client-controlled account, the Client retains the account, listing, and review history and must give GoldStay the administrator, co-host, or equivalent access reasonably required during this Agreement. GoldStay’s access ends after termination and completion of the agreed handover.",
      ],
    },
    {
      heading: "5. Fees, taxes, statements, and Client payouts",
      body: [
        "5.1 The Manager earns the Management Fee on every booking confirmed during this Agreement, regardless of when the stay occurs, the revenue is received, or this Agreement ends. The fee becomes payable as the relevant revenue is received. Refunds, reversals, and chargebacks will be reflected in the next statement.",
        "5.2 Separately itemised guest-paid cleaning or laundry charges will be applied against the actual related costs. Any surplus is credited to the Client and any shortfall is charged to the Client as a Property Expense.",
        "5.3 By the 5th day of each month, the Manager will provide the preceding month’s statement and settle the Net Client Proceeds then available. Later-clearing revenue will be included in the next cycle.",
        "5.4 If Startup Costs are required, the Manager will notify the Client of the items and estimate before committing them, subject to clause 6.2. They will be itemised and deducted from the first payout. Any shortfall may be carried forward or must be paid within five business days after request.",
        "5.5 Startup Costs remain payable if the Client delays launch, withdraws the Property, or ends this Agreement before they are recovered. They are separate from the Management Fee.",
        "5.6 The Client can view bookings, performance, collections, expenses, fees, payouts, and monthly statements on the GoldStay platform. Live figures may be adjusted when transactions clear.",
        "5.7 Payouts will be made in the selected currency, less applicable conversion or transfer costs. The Manager may maintain the agreed reserve, carry forward a negative balance, and require a top-up within three business days. Bank-detail changes must pass GoldStay’s verification process.",
        "5.8 The Management Fee is exclusive of VAT and any similar tax applicable to the Manager’s services. GoldStay may add and collect such tax from the date it becomes legally applicable without requiring an amendment to this Agreement.",
        "5.9 The Client is responsible for income, rental, accommodation, property, and other taxes or statutory charges attributable to the Property or booking revenue. GoldStay is responsible for taxes on its own income and Management Fee, except amounts it is legally entitled to charge to the Client.",
        "5.10 A tourism or similar statutory levy is borne by the party made liable by law. If GoldStay is required or appointed to withhold, collect, or remit an amount attributable to the Client, Property, or booking revenue, it may deduct that amount from collections and remit it to the relevant authority. The deduction is treated as paid to the Client, and GoldStay will show it on the statement and provide available evidence. The Client must provide a valid KRA PIN and accurate tax and residency information during onboarding and notify GoldStay of changes.",
      ],
    },
    {
      heading: "6. Property expenses and maintenance",
      body: [
        "6.1 The Manager may incur reasonable Property Expenses for operations and guest readiness. Expenses over USD 50, or the KES equivalent, will have a receipt or other reasonable evidence where ordinarily available.",
        "6.2 A single non-emergency expense above USD 250, or the KES equivalent, requires written pre-approval. The Manager may exceed this limit to protect a person or the Property, restore an essential service during a stay, or comply with law, and will notify the Client promptly.",
        "6.3 Third-party costs are not marked up unless agreed in writing. Capital works, major replacements, refurbishment, legal work, insurance claims, and project management require a separate scope and fee.",
      ],
    },
    {
      heading: "7. Client authority and responsibilities",
      body: [
        "7.1 The Client warrants throughout this Agreement that it has the legal right to control the Property, offer it for short stays, receive booking income, and appoint the Manager.",
        "7.2 A Client who is not the registered owner warrants that it has the owner’s or landlord’s prior written consent for short-stay use, guest subletting or licensing, and appointment of a property manager. The Client confirms this authority by accepting this Agreement. GoldStay will ordinarily rely on that confirmation without requiring the underlying documents before launch, but may request them if a question about authority arises or if required by law or a Booking Channel. The Client must provide them within five business days.",
        "7.3 The Client warrants that the use complies with the title, lease, mortgage, building or association rules, licences, and law. GoldStay is entitled to rely on the Client’s warranties in this section and is not required to investigate or independently verify them. GoldStay is not responsible for loss caused by their inaccuracy unless GoldStay knew they were inaccurate and continued the affected Services without taking reasonable action.",
        "7.4 The Client must maintain a safe, functional, properly furnished Property, utilities, internet, access, operating information, house rules, and funds. The Client must disclose material defects, hazards, disputes, restrictions, infestations, or security concerns and remains responsible for relevant taxes, permits, approvals, and property obligations.",
        "7.5 If the Client’s authority is missing, withdrawn, expired, or disputed, including by an owner, landlord, building management, or authority, GoldStay may suspend the listing, bookings, Services, or payouts and may terminate under clause 10.5. If the authority is not restored or reasonably confirmed within 14 days, the suspension is treated as a Client-initiated early termination under clause 10.3.",
      ],
    },
    {
      heading: "8. Insurance, guest damage, and security",
      body: [
        "8.1 The Client must ensure suitable building, contents, public-liability, and short-let or hospitality insurance is maintained. Channel protections are not insurance.",
        "8.2 The Manager will reasonably document reported guest damage and pursue available deposits or channel claims but does not guarantee recovery.",
        "8.3 The Manager may hold and share keys or access credentials with verified persons who need access. The Client must replace compromised locks or credentials when advised.",
      ],
    },
    {
      heading: "9. Information, confidentiality, and platform",
      body: [
        "9.1 Each party must comply with the Data Protection Act, 2019 and other applicable Kenyan law. Except where a different role applies by law or is agreed for a specific activity, each party acts as an independent data controller for its own purposes. GoldStay may process Client, guest, and vendor information to provide the Services, operate the platform, process payments, prevent fraud, keep records, and comply with law, including through suitable service providers. Where guest identity documents are collected directly by building security or another third party for its own access-control purposes and are not received or stored by GoldStay, GoldStay does not collect or hold them. Each party will notify the other without undue delay of a personal data breach affecting the other party’s information.",
        "9.2 Each party must protect the other’s non-public commercial, financial, guest, security, and personal information, except where lawful disclosure is required or made to advisers or service providers under confidentiality duties.",
        "9.3 The Client licenses the Manager during this Agreement to use supplied Property materials for marketing. GoldStay retains its platform, branding, workflows, analytics, and independently created materials, subject to the listing arrangements in clause 4.",
        "9.4 Platform access is personal to the Client. The Client must protect login credentials, report suspected unauthorised access, and retain independent copies of statements needed for tax or audit purposes.",
      ],
    },
    {
      heading: "10. Term and termination",
      body: [
        `10.1 This Agreement starts on the Start Date. The initial commitment runs for ${ctx.termMonths} full calendar months from the Launch Date (the “Initial Commitment Period”).`,
        `10.2 The Client may not terminate for convenience during the Initial Commitment Period. A ${ctx.noticePeriodDays}-day notice may be given during it but cannot take effect before it ends. Afterwards, either party may terminate on at least ${ctx.noticePeriodDays} days’ written notice without an exit fee.`,
        "10.3 Withdrawing the Property, blocking substantially all availability, withholding access, losing the authority required by clause 7, or otherwise preventing performance during the Initial Commitment Period is a Client-initiated early termination. The Client must pay confirmed-booking costs and Management Fees earned under clause 5.1, plus an Early Termination Amount equal to unrecovered Startup Costs. This is a reasonable estimate of onboarding and reserved-capacity costs, not a penalty, and will be reduced to avoid recovery exceeding GoldStay’s reasonably anticipated loss.",
        "10.4 If the Property does not launch within 30 days after the Start Date because of the Client, the Manager may terminate and recover properly incurred amounts.",
        "10.5 Either party may terminate for a material breach not remedied within seven days after notice, or immediately if it cannot be remedied. The Manager may suspend Services or payouts for safety, fraud, unlawful use, insufficient funds, serious defects, or material risk.",
        "10.6 Bookings confirmed before termination remain subject to this Agreement and the Management Fee under clause 5.1. Unless otherwise agreed, GoldStay may continue administering those bookings. If the Client or a replacement manager takes them over, the Client must account to GoldStay as revenue is received and pay the same Management Fee, together with reasonable direct handover costs. The Manager may deduct amounts due, retain a reasonable reserve for pending refunds or chargebacks, issue a final reconciliation, and pay the balance.",
      ],
    },
    {
      heading: "11. Liability",
      body: [
        "11.1 The Manager is responsible for direct loss caused by its fraud, wilful misconduct, gross negligence, or material breach. To the extent permitted by law, it is not liable for indirect loss, anticipated profit, reputational loss, or events outside its reasonable control.",
        "11.2 Except for liability that cannot lawfully be limited, the Manager’s total liability will not exceed the Management Fees paid or payable for the Property during the six months before the event giving rise to the claim.",
        "11.3 The Manager is not liable for guests, neighbours, building management, utilities, Booking Channels, banks, authorities, or independent vendors, except where it failed to use reasonable care in selection or coordination.",
        "11.4 The Client indemnifies the Manager against third-party claims, penalties, refunds, relocation costs, losses, and reasonable expenses arising from the Client’s breach, unsafe conditions, lack or loss of authority, inaccurate instructions, unpaid property obligations, or the Client’s invitees, except to the extent caused by the Manager’s fraud, wilful misconduct, or gross negligence.",
      ],
    },
    {
      heading: "12. Communications and acceptance",
      body: [
        "12.1 Formal notices must be sent through the GoldStay platform or another agreed written channel. WhatsApp may be used for operations but is not the sole method for termination, bank-detail changes, or amendments unless receipt and authenticity are confirmed.",
        "12.2 Operational approvals may be recorded through the platform or acknowledged WhatsApp. The Manager may retain these records as evidence of instructions.",
        "12.3 This Agreement may be accepted through the GoldStay platform, signed electronically, or signed in counterparts. The acceptance record should identify the user, Agreement version, identity confirmation, and date and time. GoldStay will provide a downloadable copy or receipt.",
        "12.4 Amendments must be recorded in writing and accepted by both parties. Agreed updates to Schedule 1 do not amend unrelated clauses.",
      ],
    },
    {
      heading: "13. General and disputes",
      body: [
        "13.1 The Manager is an independent contractor. Nothing creates employment, partnership, joint venture, or authority beyond this Agreement. Neither party may assign this Agreement without consent, except that the Manager may assign it to an affiliate or business successor on notice without reducing the Client’s rights.",
        "13.2 This Agreement and its Schedules are the entire agreement. Schedule 1 prevails for property-specific commercial terms. If a provision is unenforceable, the remainder continues. Delay in exercising a right is not a waiver.",
        "13.3 Neither party is liable for delay caused by events outside reasonable control. Accrued payment obligations are not excused.",
        "13.4 Kenyan law applies. A dispute must first be described in writing and discussed in good faith for 14 days. If unresolved, the courts of competent jurisdiction in Nairobi have jurisdiction, without preventing urgent interim relief.",
      ],
    },
    {
      heading: "Schedule 1 — Property and commercial terms",
      body: [
        "The operational selections below may be completed before acceptance or confirmed through the agreed GoldStay onboarding workflow.",
      ],
      rows: scheduleOne(ctx),
    },
    {
      heading: "Schedule 2 — Core services",
      body: [
        "Subject to the Agreement and the Property’s agreed onboarding plan, the Management Fee includes coordination of the following core services:",
      ],
      bullets: [
        "Onboarding, listing creation or optimisation, house rules, calendars, approved Booking Channels, and pricing within Schedule 1.",
        "Enquiries, reservations, check-in and check-out communication, stay support, review follow-up, and reasonable complaint handling.",
        "Coordination of cleaning, laundry, restocking, maintenance, and emergency response. Third-party costs remain Property Expenses.",
        "Revenue reconciliation, fee and expense reporting, monthly statements, platform visibility, Client payouts, and reasonable assistance with channel damage claims.",
        "Client communication through the GoldStay platform and WhatsApp, with a target response within 48 hours; urgent in-stay issues receive 24/7 escalation support.",
      ],
    },
    {
      heading: "Not included unless separately agreed",
      body: [],
      bullets: [
        "Furniture procurement, interior design, major refurbishment, capital projects, or contractor project management.",
        "Legal, tax, licensing, valuation, insurance-broking, debt-collection, or court services.",
        "Payment of Property obligations from GoldStay’s funds, or guarantees of occupancy, revenue, guest conduct, damage recovery, platform availability, or returns.",
      ],
    },
    {
      heading: "Execution",
      body: [
        "The parties confirm that they have read, understood, and agreed to this Agreement, including its Schedules. A person signing for an entity warrants that they are authorised to bind it. By signing or accepting this Agreement, the Client confirms that it holds all rights, consents, and approvals required to offer the Property for short stays and appoint GoldStay, as set out in clause 7.",
      ],
    },
  ];
}
