// GoldStay Long-Term Property Management Agreement (Kenya).
//
// The contract served to Kenyan clients onboarding a LONG_TERM
// property. Kenyan short-lets get ./short-let-ke.ts; Ghana properties
// still get the generic agreement in ./text.ts. The dispatcher lives
// in ./template.ts.
//
// PROVENANCE — read before editing.
//
// Unlike short-let-ke.ts, this is not a transcription of an executed
// legal document. No such document existed. It was assembled from two
// sources:
//
//   1. Goldstay_Long_Term_Management_2025, the published long-term
//      service and pricing sheet. Every commercial promise below is
//      taken from it: the 10% fee charged only on rent actually
//      collected, the one-month tenant-finding fee, no setup fees,
//      the 5th-of-month payout, final landlord approval before a
//      lease is signed, the USD 50 receipt and USD 250 pre-approval
//      thresholds, the 48-hour response commitment, the six-month
//      tenant replacement guarantee, and the 30-day exit with no
//      exit fee and no lock-in. That sheet closes with "Service
//      details are subject to the signed Management Agreement" —
//      this is that agreement, so the two must not disagree.
//
//   2. The structural and protective clauses of the short-let
//      agreement (authority, insurance, liability, data, notices,
//      disputes), adapted from short-stay guests to a placed tenant.
//
// Consequence: the clauses in group 1 restate commitments Goldstay has
// already published, but those in group 2 have not been through a
// lawyer for the long-term context. Kenyan residential letting carries
// statute the short-let contract never had to touch — deposits, notice
// to vacate, distress for rent and the grounds for repossession. Get
// this reviewed, and treat clauses 4, 8 and 10 as the ones most likely
// to need a Kenyan property lawyer's hand.
//
// Two rules when editing, same as the short-let file:
//
//   1. Bump LONG_LET_KE_VERSION for any change to the clause text.
//      Every accepted agreement stores the version it was accepted
//      under and a reprint must reproduce that exact text.
//   2. Never hard-code a commercial term that also lives on the
//      ManagementAgreement row. The fee percentage and the notice
//      period are interpolated from the snapshot so the prose and the
//      database can never disagree.
//
// Thresholds stated only in the service sheet (USD 50, USD 250, the
// 5th-of-month payout, 48 hours, the six-month replacement window, and
// the tenant-finding fee of one month's rent) are hard-coded here,
// because that sheet is their only source of truth.

import type { AgreementScheduleRow, AgreementSection } from "./text";
import type { SigningCapacity } from "@prisma/client";
import { SIGNING_CAPACITY_LONG_LET_SCHEDULE_LABEL } from "@/lib/signing-capacity";
import { MANAGER, MANAGER_SIGNING_NAME } from "./manager";

export const LONG_LET_KE_VERSION = "long-let-ke-v1";

// The tenant-finding fee is one month's rent per the service sheet.
// Expressed as a multiple rather than an amount on purpose: the rent
// isn't known when the agreement is issued, because finding the tenant
// who sets it is the service being bought. Stating the multiple means
// the fee is right whatever rent the tenancy is eventually let at.
const TENANT_FINDING_FEE_MONTHS = 1;

// The six-month replacement guarantee is written out in the clauses
// below rather than interpolated from a constant, because the prose
// spells fixed periods as words the way the short-let agreement does
// — "seven days", "six months", "five business days". Numerals are
// reserved for the terms snapshotted from the agreement row, where the
// figure genuinely varies, and for money and dates.

export type LongLetContext = {
  // Header block and Schedule 1 "Client" row.
  clientLegalName: string;
  clientIdNumber: string | null;
  clientKraPin: string | null;
  clientAddress: string | null;
  // Schedule 1 "Client capacity and Property" row.
  signingCapacity: SigningCapacity;
  propertyDescription: string;
  bedrooms: number | null;
  // Commercial terms snapshotted from the ManagementAgreement row and
  // pre-formatted by the caller. There is deliberately no termMonths:
  // this contract has no minimum term, so quoting one would contradict
  // the "no lock-in" promise the client was sold on.
  commissionPct: string;
  noticePeriodDays: number;
  payoutCurrency: string;
  // Reference printed at the head of the contract, e.g. GS-2026-004.
  reference: string | null;
  startDate: Date;
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

function tenantFindingFeeText(): string {
  return TENANT_FINDING_FEE_MONTHS === 1
    ? "one month’s gross rent under the Tenancy placed"
    : `${TENANT_FINDING_FEE_MONTHS} months’ gross rent under the Tenancy placed`;
}

// Schedule 1 rows. Kept separate from the clause list because the
// renderers lay tables out differently from prose, and because this is
// the only part of the contract that changes per client.
function scheduleOne(ctx: LongLetContext): AgreementScheduleRow[] {
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
        `Capacity: ${SIGNING_CAPACITY_LONG_LET_SCHEDULE_LABEL[ctx.signingCapacity]}`,
        `Property: ${ctx.propertyDescription}`,
        `Bedrooms: ${ctx.bedrooms ?? "To be confirmed"}`,
      ],
    },
    {
      label: "Dates and term",
      value: [
        `Start Date: ${formatDate(ctx.startDate)}`,
        "Minimum term: none. This Agreement runs until either party ends it.",
        `Notice to terminate: ${ctx.noticePeriodDays} days, either party, no exit fee`,
      ],
    },
    {
      label: "Appointment and marketing",
      value: [
        "Exclusive",
        "Channels: property portals, the GoldStay agent network, GoldStay direct listings, and any further channel approved for the Property",
      ],
    },
    {
      label: "Management Fee",
      value: [
        `${ctx.commissionPct} of Collected Rent, charged only on rent actually received, exclusive of applicable VAT or similar tax`,
      ],
    },
    {
      label: "Tenant-Finding Fee",
      value: [
        `One-off, equal to ${tenantFindingFeeText()}`,
        "Charged once per tenancy placed, on the Tenancy being signed",
        "Not charged again where a Tenant is replaced under the six-month guarantee in clause 4.6",
      ],
    },
    {
      label: "Setup costs",
      value: [
        "None. No setup fee is charged and no deduction is made from rent other than those itemised on the monthly Statement.",
      ],
    },
    {
      label: "Target monthly rent",
      value: [
        // Genuinely unknown at issue rather than merely uncollected:
        // the tenant who sets the rent has not been found yet.
        "To be agreed with the Client before the Property is marketed",
      ],
    },
    {
      label: "Rent collection and payouts",
      value: [
        "Rent collected in KES",
        "Client payout by the 5th monthly for available preceding-month funds",
        `Payout currency: ${ctx.payoutCurrency}`,
        "Deposit handling: as agreed through GoldStay onboarding",
      ],
    },
    {
      label: "Expense controls",
      value: [
        "Receipt or other reasonable evidence above USD 50 equivalent",
        "Written approval above USD 250 equivalent for a single non-emergency expense",
      ],
    },
    {
      label: "Other terms",
      value: [
        "Existing tenancy in place at the Start Date: none unless details are attached",
        "Other agreed terms: none",
      ],
    },
  ];
}

export function buildLongLetKeSections(
  ctx: LongLetContext,
): AgreementSection[] {
  const managerParty = `${MANAGER.legalName}, a private limited company registered in Kenya under company number ${MANAGER.companyNumber}, with its registered office at ${MANAGER.registeredOffice}, trading as “${MANAGER.tradingName}” (the “Manager”); and`;

  return [
    {
      heading: "Key commercial terms",
      body: [
        "A practical agreement between GoldStay and the person authorised to let the Property to tenants.",
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
          value: [`${ctx.commissionPct} of Collected Rent`],
        },
        {
          label: "Tenant-finding fee",
          value: [`One-off, ${tenantFindingFeeText()}`],
        },
        { label: "Client payout", value: ["5th monthly"] },
        { label: "Payout currency", value: [ctx.payoutCurrency] },
        { label: "Client visibility", value: ["Live dashboard"] },
        {
          label: "Term",
          value: [
            `No minimum term. ${ctx.noticePeriodDays} days’ notice, either party, no exit fee.`,
          ],
        },
      ],
    },
    {
      heading: "Parties and agreement",
      body: [
        "This Long-Term Property Management Agreement (the “Agreement”) is entered into on the Start Date stated in Schedule 1 between:",
        `(a) ${managerParty}`,
        "(b) the person or entity identified in Schedule 1 (the “Client”).",
        "The Client appoints the Manager to market and manage the Property for residential letting. The Client may be the registered owner, a tenant or lessee with written subletting rights, or another authorised representative of the owner. The Schedules form part of this Agreement.",
      ],
    },
    {
      heading: "1. Definitions and interpretation",
      body: [
        "1.1 “Tenancy” means a lease, tenancy or other agreement for occupation of the Property entered into between the Client and a Tenant, whether prepared by the Manager or by the Client.",
        "1.2 “Tenant” means a person or entity in occupation of the Property, or contracted to occupy it, under a Tenancy.",
        "1.3 “Collected Rent” means rent actually received for the Property in the relevant period. It excludes rent that has fallen due but not been paid, refundable deposits, taxes collected for remittance, refunds, and compensation for damage.",
        `1.4 “Management Fee” means ${ctx.commissionPct} of Collected Rent, plus any tax required by law to be charged on the fee. It is charged only on rent actually received.`,
        `1.5 “Tenant-Finding Fee” means a one-off fee equal to ${tenantFindingFeeText()}, plus any tax required by law to be charged on the fee.`,
        "1.6 “Property Expenses” means reasonable third-party costs of keeping the Property let, occupied and maintained, including routine and emergency maintenance, repairs, replacements, vendor call-outs, consumables, utilities where the Client is liable for them, licences, and approved professional services.",
        "1.7 “Net Client Proceeds” means Collected Rent less the Management Fee, any Tenant-Finding Fee then due, Property Expenses, amounts the Manager is required by law to withhold or remit, and other authorised deductions.",
        "1.8 “Statement” means the monthly account of Collected Rent, Property Expenses, fees, statutory charges and Net Client Proceeds made available to the Client on the GoldStay platform.",
      ],
    },
    {
      heading: "2. Appointment and authority",
      body: [
        "2.1 The Client appoints GoldStay as the exclusive manager of the Property for residential letting during this Agreement, unless Schedule 1 states otherwise.",
        "2.2 The Client authorises the Manager, as operational agent, to market the Property, conduct viewings, vet prospective tenants, prepare Tenancy and onboarding documents, collect rent and deposits, arrange access and service providers, instruct routine and emergency maintenance within the limits in clause 6, and correspond with Tenants on the Client’s behalf.",
        "2.3 The Manager may use employees and independent service providers but may not sign a Tenancy in its own name, sell, mortgage, grant a long-term lease over, or otherwise encumber the Property.",
        "2.4 The Manager does not commit its own funds to the Property. Where Property Expenses exceed the funds held for the Property, clause 5.7 applies.",
      ],
    },
    {
      heading: "3. Services",
      body: [
        "3.1 The Manager will provide the services listed in Schedule 2 with reasonable care and skill.",
        "3.2 The Manager will acknowledge every Tenant issue, Client question and maintenance request within 48 hours.",
        "3.3 Rent levels, time to let, tenant conduct, length of occupation and investment returns are not guaranteed. Forecasts and rental appraisals are estimates.",
      ],
    },
    {
      heading: "4. Tenant selection and the Tenancy",
      body: [
        "4.1 The Manager will market the Property at the rent agreed with the Client, conduct viewings, and vet prospective tenants. Vetting includes identity verification, employment or income verification, and previous-landlord or character references.",
        "4.2 The Client has the final decision on which Tenant is accepted. No Tenancy will be signed without the Client’s approval, which may be given through the GoldStay platform or another agreed written channel.",
        "4.3 The Tenancy is between the Client and the Tenant. The Manager prepares and administers it as agent and is not a party to it, does not guarantee the Tenant’s obligations under it, and does not become liable as landlord.",
        "4.4 The Tenant-Finding Fee is earned when the Tenancy is signed and is charged once for that tenancy. It is deducted from the first collections for the Property, and any shortfall may be carried forward or must be paid within five business days after request.",
        "4.5 Where the Client instructs the Manager to place a Tenant the Manager has advised against, the Tenant-Finding Fee is still earned on that Tenancy and the guarantee in clause 4.6 does not apply to it.",
        "4.6 If a Tenant placed by the Manager defaults on the Tenancy within six months of the Tenancy starting, the Manager will find a replacement Tenant and will not charge a further Tenant-Finding Fee for doing so. This guarantee applies while the Manager continues to manage the Property under this Agreement, and does not make the Manager liable for the rent the defaulting Tenant failed to pay, for the cost of recovering possession, or for the period the Property stands empty.",
        "4.7 Recovery of arrears, notices to vacate, and any proceedings for possession are conducted in the Client’s name. The Manager will issue routine reminders and standard notices and will coordinate instructed advisers, but legal proceedings, distress for rent and debt collection are outside the Management Fee and require a separate scope and fee.",
      ],
    },
    {
      heading: "5. Fees, taxes, statements and Client payouts",
      body: [
        "5.1 The Management Fee is charged on Collected Rent only. Rent that falls due but is not paid carries no Management Fee, and the Manager does not charge the Client for the period the Property stands empty.",
        "5.2 No setup, onboarding, marketing, photography or listing fee is charged. Other than the Management Fee, any Tenant-Finding Fee, Property Expenses and statutory amounts, each itemised on the Statement, no deduction is made from rent.",
        "5.3 By the 5th day of each month, the Manager will make the preceding month’s Statement available and settle the Net Client Proceeds then available. Later-clearing rent will be included in the next cycle.",
        "5.4 The Statement shows gross rent collected, Property Expenses, the Management Fee, any Tenant-Finding Fee, and KRA or other recurring statutory charges separately, followed by the Net Client Proceeds payable to the Client.",
        "5.5 The Client can view collections, arrears, expenses, fees, payouts and monthly Statements on the GoldStay platform. Live figures may be adjusted when transactions clear.",
        "5.6 Rent is collected in KES. Payouts will be made in the currency stated in Schedule 1, less applicable conversion or transfer costs. Bank-detail changes must pass GoldStay’s verification process.",
        "5.7 Where Property Expenses properly incurred exceed the funds held for the Property, the Manager may carry the shortfall forward against future collections or require the Client to fund it within three business days of request. The Manager is not obliged to incur an expense it has no funds for, except as permitted by clause 6.2.",
        "5.8 The Management Fee and the Tenant-Finding Fee are exclusive of VAT and any similar tax applicable to the Manager’s services. GoldStay may add and collect such tax from the date it becomes legally applicable without requiring an amendment to this Agreement.",
        "5.9 The Client is responsible for income, rental, property and other taxes or statutory charges attributable to the Property or its rental income, including any land rates, land rent or service charge. GoldStay is responsible for taxes on its own income and fees.",
        "5.10 If GoldStay is required or appointed by law to withhold, collect or remit an amount attributable to the Client, the Property or the rental income, it may deduct that amount from collections and remit it to the relevant authority. The deduction is treated as paid to the Client, and GoldStay will show it on the Statement and provide available evidence. The Client must provide a valid KRA PIN and accurate tax and residency information during onboarding and notify GoldStay of changes.",
      ],
    },
    {
      heading: "6. Property expenses and maintenance",
      body: [
        "6.1 The Manager may incur reasonable Property Expenses to keep the Property let, safe and maintained. Expenses over USD 50, or the KES equivalent, will have a receipt or other reasonable evidence where ordinarily available.",
        "6.2 A single non-emergency expense above USD 250, or the KES equivalent, requires the Client’s written pre-approval. The Manager may exceed this limit to protect a person or the Property, restore an essential service to an occupied Property, or comply with law, and will notify the Client promptly.",
        "6.3 Third-party costs are not marked up unless agreed in writing. Capital works, major replacements, refurbishment, legal work, insurance claims and project management require a separate scope and fee.",
        "6.4 Repairs that are the Client’s responsibility as landlord remain so. The Manager coordinates and supervises them and tracks receipts, but does not assume the Client’s repairing obligations under the Tenancy or under law.",
      ],
    },
    {
      heading: "7. Client authority and responsibilities",
      body: [
        "7.1 The Client warrants throughout this Agreement that it has the legal right to let the Property to tenants, to receive the rental income, and to appoint the Manager.",
        "7.2 A Client who is not the registered owner warrants that it has the owner’s or head-landlord’s prior written consent to sublet or otherwise let the Property and to appoint a property manager. The Client confirms this authority by accepting this Agreement. GoldStay will ordinarily rely on that confirmation without requiring the underlying documents before marketing, but may request them if a question about authority arises or if required by law. The Client must provide them within five business days.",
        "7.3 The Client warrants that letting the Property complies with the title, any head lease, any mortgage, building or association rules, applicable licences, and law. GoldStay is entitled to rely on the Client’s warranties in this section and is not required to investigate or independently verify them. GoldStay is not responsible for loss caused by their inaccuracy unless GoldStay knew they were inaccurate and continued the affected Services without taking reasonable action.",
        "7.4 The Client must keep the Property safe, habitable and lawfully lettable, with utilities, access and any required certification in place, and must disclose material defects, hazards, disputes, restrictions, infestations or security concerns. The Client remains responsible for relevant taxes, rates, service charges, permits and approvals.",
        "7.5 The Client must not accept rent directly from a Tenant, agree a variation of the Tenancy, or give a Tenant notice, without telling the Manager. Rent received directly by the Client still counts as Collected Rent for the purposes of the Management Fee.",
        "7.6 If the Client’s authority to let the Property is missing, withdrawn, expired or disputed, including by an owner, head landlord, building management or authority, GoldStay may suspend marketing, the Services or payouts, and may terminate under clause 10.4.",
      ],
    },
    {
      heading: "8. Insurance, deposits and security",
      body: [
        "8.1 The Client must ensure suitable building, contents, public-liability and loss-of-rent insurance is maintained for the Property. The Manager’s vetting of a Tenant is not insurance and is not a guarantee against default or damage.",
        "8.2 Any deposit taken from a Tenant is held and applied as stated in Schedule 1 and in the Tenancy. A deposit is the Tenant’s money until it is properly applied, is not Collected Rent, and carries no Management Fee.",
        "8.3 The Manager will document the condition of the Property at the start and end of each Tenancy, will reasonably document reported damage, and will pursue available deposit deductions, but does not guarantee recovery.",
        "8.4 The Manager may hold and share keys or access credentials with verified persons who need access. The Client must replace compromised locks or credentials when advised.",
      ],
    },
    {
      heading: "9. Information, confidentiality and platform",
      body: [
        "9.1 Each party must comply with the Data Protection Act, 2019 and other applicable Kenyan law. Except where a different role applies by law or is agreed for a specific activity, each party acts as an independent data controller for its own purposes. GoldStay may process Client, Tenant, applicant and vendor information to provide the Services, operate the platform, vet applicants, process payments, prevent fraud, keep records, and comply with law, including through suitable service providers. Each party will notify the other without undue delay of a personal data breach affecting the other party’s information.",
        "9.2 Each party must protect the other’s non-public commercial, financial, tenant, security and personal information, except where lawful disclosure is required or made to advisers or service providers under confidentiality duties.",
        "9.3 The Client licenses the Manager during this Agreement to use supplied Property materials for marketing. GoldStay retains its platform, branding, workflows, analytics and independently created materials.",
        "9.4 Platform access is personal to the Client. The Client must protect login credentials, report suspected unauthorised access, and retain independent copies of Statements needed for tax or audit purposes.",
      ],
    },
    {
      heading: "10. Term and termination",
      body: [
        "10.1 This Agreement starts on the Start Date and continues until it is terminated. There is no minimum term and no lock-in period.",
        `10.2 Either party may terminate this Agreement at any time on at least ${ctx.noticePeriodDays} days’ written notice. No exit fee is payable, and the Manager makes no charge for ending the Agreement.`,
        "10.3 On termination the Manager will hand over to the Client, without charge and without withholding them as security for sums claimed, any deposit held for the Property, the Tenancy and Tenant contact details, the condition and inventory records, the rent and expense history, and the Property records held on the Client’s behalf.",
        "10.4 Either party may terminate for a material breach not remedied within seven days after notice, or immediately if it cannot be remedied. The Manager may suspend the Services or payouts for safety, fraud, unlawful use, insufficient funds, serious defects or material risk.",
        "10.5 Termination does not affect the Management Fee on rent collected up to termination, or a Tenant-Finding Fee already earned under clause 4.4 on a Tenancy signed before termination. After termination the Manager charges no further Management Fee, including on rent the Client or a replacement manager subsequently collects.",
        "10.6 The Manager may deduct amounts properly due, retain a reasonable reserve for expenses already committed, issue a final reconciliation, and pay the balance. Any reserve not required will be released to the Client.",
      ],
    },
    {
      heading: "11. Liability",
      body: [
        "11.1 The Manager is responsible for direct loss caused by its fraud, wilful misconduct, gross negligence, or material breach. To the extent permitted by law, it is not liable for indirect loss, anticipated profit, reputational loss, or events outside its reasonable control.",
        "11.2 Except for liability that cannot lawfully be limited, the Manager’s total liability will not exceed the Management Fees paid or payable for the Property during the six months before the event giving rise to the claim.",
        "11.3 The Manager is not liable for the acts or omissions of Tenants, neighbours, building management, utilities, banks, authorities or independent vendors, except where it failed to use reasonable care in selection or coordination. In particular the Manager is not liable for unpaid rent, for damage caused by a Tenant beyond the deposit recovered, or for the time taken to recover possession.",
        "11.4 The Client indemnifies the Manager against third-party claims, penalties, losses and reasonable expenses arising from the Client’s breach, unsafe or unlawfully let conditions, lack or loss of authority, inaccurate instructions, unpaid property obligations, or the Client’s own dealings with a Tenant, except to the extent caused by the Manager’s fraud, wilful misconduct or gross negligence.",
      ],
    },
    {
      heading: "12. Communications and acceptance",
      body: [
        "12.1 Formal notices must be sent through the GoldStay platform or another agreed written channel. WhatsApp may be used for operations but is not the sole method for termination, bank-detail changes, Tenant approval, or amendments unless receipt and authenticity are confirmed.",
        "12.2 Operational approvals, including approval of a Tenant under clause 4.2 and of an expense under clause 6.2, may be recorded through the platform or acknowledged WhatsApp. The Manager may retain these records as evidence of instructions.",
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
        "Subject to the Agreement, the Management Fee includes coordination of the following core services. The Tenant-Finding Fee covers the tenant placement work in the first item.",
      ],
      bullets: [
        "Tenant placement: marketing and viewings, and vetting by identity, employment or income, and reference checks, with the Client’s final approval before any Tenancy is signed.",
        "Lease and compliance: preparation of the Tenancy and onboarding documents, and coordination of the rental setup from start to finish.",
        "Rent collection: rent collected in KES, reconciled, and reported in the monthly Statement.",
        "Maintenance: routine and emergency maintenance, with vendor coordination, supervision and receipt tracking.",
        "Client reporting: GoldStay platform access with a live dashboard and downloadable monthly Statements showing collections, expenses, fees and the Client payout.",
        "Client support: 24/7 WhatsApp access for the Client, with every request acknowledged within 48 hours.",
      ],
    },
    {
      heading: "Not included unless separately agreed",
      body: [],
      bullets: [
        "Furniture procurement, interior design, major refurbishment, capital projects, or contractor project management.",
        "Legal proceedings, distress for rent, debt collection, eviction, tax, licensing, valuation or insurance-broking services.",
        "Payment of Property obligations from GoldStay’s funds, or guarantees of rent, time to let, Tenant conduct, recovery of arrears or damage, or returns.",
      ],
    },
    {
      heading: "Execution",
      body: [
        "The parties confirm that they have read, understood, and agreed to this Agreement, including its Schedules. A person signing for an entity warrants that they are authorised to bind it. By signing or accepting this Agreement, the Client confirms that it holds all rights, consents, and approvals required to let the Property to tenants and appoint GoldStay, as set out in clause 7.",
      ],
    },
  ];
}
