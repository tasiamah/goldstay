// GoldStay Tenant Finding Agreement (Kenya).
//
// The contract served to Kenyan clients onboarding a TENANT_FINDING
// property. Kenyan short-lets get ./short-let-ke.ts, Kenyan long-lets
// under full management get ./long-let-ke.ts, and Ghana properties
// still get the generic agreement in ./text.ts. The dispatcher lives
// in ./template.ts.
//
// PROVENANCE — read before editing.
//
// This is the only one of the four that is not a management
// agreement. The engagement ends at handover: GoldStay markets the
// Property, vets applicants, prepares the Tenancy and hands over, and
// then stops. There is no Collected Rent, no Management Fee and no
// monthly Statement after the placement, because GoldStay is not
// holding the Client's money once the deposit has been passed on.
//
// Every commercial term below is taken from the published
// /tenant-finding page rather than invented here. That page is a
// public offer and this agreement is what it turns into, so the two
// must not disagree. Specifically, from that page:
//
//   * "A one-time fee of one month's rent, payable when the lease is
//     signed and the tenant has moved in."
//   * "Nothing is due if we do not place a tenant."
//   * "there is no monthly charge afterwards because we are not
//     managing the property."
//   * "If a tenant we placed vacates or is removed for cause within
//     six months, we find you a replacement at no further fee."
//   * "We share the file with you and you make the final decision,
//     not us."
//   * Vetting is "Identity documents, written confirmation from the
//     employer, evidence of income, two references we genuinely call,
//     and an interview in person."
//   * "There is no re-onboarding fee if you switch" to full
//     management.
//
// The structural and protective clauses (authority, liability, data,
// notices, disputes) are adapted from ./long-let-ke.ts, which carries
// the same caveat: they have not been through a Kenyan property
// lawyer for this context. Clause 4 is the one most worth a lawyer's
// hand, because it is where the deposit passes through GoldStay's
// hands and where the fee is taken out of the Tenant's first payment.
//
// Two rules when editing, same as the other Kenyan files:
//
//   1. Bump TENANT_FINDING_KE_VERSION for any change to the clause
//      text. Every accepted agreement stores the version it was
//      accepted under and a reprint must reproduce that exact text.
//   2. Never hard-code a commercial term that also lives on the
//      ManagementAgreement row. The notice period is interpolated
//      from the snapshot so the prose and the database cannot
//      disagree.
//
// The fee is the exception, and deliberately so: see
// TENANT_FINDING_FEE_MONTHS below.

import type { AgreementScheduleRow, AgreementSection } from "./text";
import type { SigningCapacity } from "@prisma/client";
import { SIGNING_CAPACITY_LONG_LET_SCHEDULE_LABEL } from "@/lib/signing-capacity";
import { MANAGER, MANAGER_SIGNING_NAME } from "./manager";

export const TENANT_FINDING_KE_VERSION = "tenant-finding-ke-v1";

// One month's rent, per the published page. Expressed as a multiple
// rather than an amount for the same reason as in ./long-let-ke.ts:
// the rent is not known when the agreement is issued, because finding
// the tenant who sets it is the service being bought.
//
// Unlike the other contracts, this one does NOT interpolate
// ManagementAgreement.commissionRate into the fee. A percentage of
// collected rent is the wrong shape for a one-off placement fee, and
// storing 1.0000 to mean "one month" would read as 100% everywhere
// that renders a rate. The row carries the multiple's effect, not the
// multiple; see tenantFindingCommissionRate in ../commission.ts.
const TENANT_FINDING_FEE_MONTHS = 1;

// Six months, written as words in the prose below for consistency
// with the other Kenyan agreements, where numerals are reserved for
// snapshotted terms, money and dates.
const REPLACEMENT_GUARANTEE_MONTHS = 6;

export type TenantFindingContext = {
  // Header block and Schedule 1 "Client" row.
  clientLegalName: string;
  clientIdNumber: string | null;
  clientKraPin: string | null;
  clientAddress: string | null;
  // Schedule 1 "Client capacity and Property" row.
  signingCapacity: SigningCapacity;
  propertyDescription: string;
  bedrooms: number | null;
  // Snapshotted from the ManagementAgreement row. There is no
  // commissionPct and no termMonths: this engagement has neither a
  // recurring fee nor a term, it has an outcome.
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

export function tenantFindingFeeText(): string {
  return TENANT_FINDING_FEE_MONTHS === 1
    ? "one month’s gross rent under the Tenancy placed"
    : `${TENANT_FINDING_FEE_MONTHS} months’ gross rent under the Tenancy placed`;
}

function guaranteeText(): string {
  return REPLACEMENT_GUARANTEE_MONTHS === 6
    ? "six months"
    : `${REPLACEMENT_GUARANTEE_MONTHS} months`;
}

// Schedule 1 rows. Kept separate from the clause list because the
// renderers lay tables out differently from prose, and because this is
// the only part of the contract that changes per client.
function scheduleOne(ctx: TenantFindingContext): AgreementScheduleRow[] {
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
        "Minimum term: none. This Agreement ends when the Property is handed over to a Tenant, or when either party ends it.",
        `Notice to terminate before a Tenant is placed: ${ctx.noticePeriodDays} days, either party, no fee`,
      ],
    },
    {
      label: "Appointment and marketing",
      value: [
        "Exclusive until handover or termination",
        "Channels: property portals, the GoldStay agent network, GoldStay direct listings, the GoldStay tenant waitlist, and corporate and relocation contacts",
      ],
    },
    {
      label: "Tenant-Finding Fee",
      value: [
        `One-off, equal to ${tenantFindingFeeText()}`,
        "Earned on the Tenancy being signed and the Tenant taking occupation",
        "Nothing is payable if no Tenant is placed",
        `Not charged again where a Tenant is replaced under the ${guaranteeText()} guarantee in clause 5.1`,
      ],
    },
    {
      label: "Management Fee",
      value: [
        "None. This is not a management agreement. GoldStay does not collect rent after handover and makes no recurring charge.",
      ],
    },
    {
      label: "Setup costs",
      value: [
        "None. Photography, the written listing, portal distribution, accompanied viewings, vetting, the Tenancy and the move-in inventory are all within the Tenant-Finding Fee.",
        "No charge of any kind arises if no Tenant is placed.",
      ],
    },
    {
      label: "Target monthly rent",
      value: [
        // Genuinely unknown at issue: the tenant who sets the rent has
        // not been found yet, and finding them is the service.
        "To be agreed with the Client before the Property is marketed",
      ],
    },
    {
      label: "Client payout",
      value: [
        `Deposit and any rent collected beyond the Tenant-Finding Fee, remitted in ${ctx.payoutCurrency} within five business days of cleared receipt`,
      ],
    },
    {
      label: "Agreement reference",
      value: [ctx.reference ?? "Issued on acceptance"],
    },
  ];
}

export function buildTenantFindingKeSections(
  ctx: TenantFindingContext,
): AgreementSection[] {
  const managerParty = `${MANAGER.legalName}, a private limited company registered in Kenya under company number ${MANAGER.companyNumber}, with its registered office at ${MANAGER.registeredOffice}, trading as “${MANAGER.tradingName}” (the “Manager”); and`;

  return [
    {
      heading: "Key commercial terms",
      body: [
        "A practical agreement between GoldStay and the person authorised to let the Property, for finding and placing a tenant only. GoldStay does not manage the Property afterwards.",
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
          label: "Tenant-finding fee",
          value: [`One-off, ${tenantFindingFeeText()}`],
        },
        {
          label: "If no tenant is placed",
          value: ["Nothing is payable"],
        },
        { label: "Management fee", value: ["None"] },
        {
          label: "Replacement guarantee",
          value: [`${guaranteeText()}, at no further fee`],
        },
        { label: "Payout currency", value: [ctx.payoutCurrency] },
        {
          label: "Engagement ends",
          value: ["On handover of the Property to the Tenant"],
        },
      ],
    },
    {
      heading: "Parties and agreement",
      body: [
        "This Tenant Finding Agreement (the “Agreement”) is entered into on the Start Date stated in Schedule 1 between:",
        `(a) ${managerParty}`,
        "(b) the person or entity identified in Schedule 1 (the “Client”).",
        "The Client appoints the Manager to market the Property and to find and place a residential Tenant. The Client may be the registered owner, a tenant or lessee with written subletting rights, or another authorised representative of the owner. The Schedules form part of this Agreement.",
        "This is not a management agreement. The Manager does not manage the Property, does not collect rent after the placement dealt with in clause 4, and makes no recurring charge. The Client manages the Property and the Tenancy from handover onwards.",
      ],
    },
    {
      heading: "1. Definitions and interpretation",
      body: [
        "1.1 “Tenancy” means a lease, tenancy or other agreement for occupation of the Property entered into between the Client and a Tenant, whether prepared by the Manager or by the Client.",
        "1.2 “Tenant” means a person or entity in occupation of the Property, or contracted to occupy it, under a Tenancy.",
        `1.3 “Tenant-Finding Fee” means a one-off fee equal to ${tenantFindingFeeText()}, plus any tax required by law to be charged on the fee.`,
        "1.4 “Deposit” means the refundable security deposit payable by the Tenant under the Tenancy.",
        "1.5 “Handover” means the point at which the Tenant takes occupation of the Property and the keys, the move-in inventory has been recorded, and the Manager has accounted to the Client under clause 4.",
        "1.6 “Placement Statement” means the single account, made available to the Client on the GoldStay platform, of what the Manager received from the Tenant, the Tenant-Finding Fee deducted, and the balance remitted to the Client.",
      ],
    },
    {
      heading: "2. Appointment and authority",
      body: [
        "2.1 The Client appoints GoldStay as the exclusive agent to find a Tenant for the Property until Handover or until this Agreement ends, unless Schedule 1 states otherwise.",
        "2.2 The Client authorises the Manager, as agent for this purpose only, to market the Property, conduct accompanied viewings, vet prospective tenants, prepare the Tenancy and onboarding documents, receive the first month’s rent and the Deposit from the Tenant, record the move-in inventory and arrange handover of keys.",
        "2.3 The authority in clause 2.2 ends at Handover. After Handover the Manager has no authority to act for the Client, does not collect rent, does not hold funds for the Property, does not instruct maintenance and does not correspond with the Tenant on the Client’s behalf, except as required by the guarantee in clause 5.",
        "2.4 The Manager may use employees and independent service providers but may not sign a Tenancy in its own name, sell, mortgage, grant a long-term lease over, or otherwise encumber the Property.",
      ],
    },
    {
      heading: "3. Marketing, vetting and tenant selection",
      body: [
        "3.1 The Manager will market the Property at the rent agreed with the Client, through the channels stated in Schedule 1, and will conduct accompanied viewings.",
        "3.2 Vetting of each applicant the Manager puts forward comprises identity documents, written confirmation of employment, evidence of income assessed against the rent, two references taken by telephone rather than by written form alone, and an interview in person.",
        "3.3 The Manager will share the completed applicant file with the Client. The Client has the final decision on which Tenant is accepted. No Tenancy will be signed without the Client’s approval, which may be given through the GoldStay platform or another agreed written channel.",
        "3.4 The Tenancy is between the Client and the Tenant. The Manager prepares it as agent and is not a party to it, does not guarantee the Tenant’s obligations under it, and does not become liable as landlord. The Client signs it, not the Manager.",
        "3.5 Rent levels, time to let, tenant conduct and length of occupation are not guaranteed. Rental appraisals are estimates. The Manager will tell the Client where it considers the asking rent is the reason the Property is not letting.",
        "3.6 Where the Client instructs the Manager to place a Tenant the Manager has advised against, the Tenant-Finding Fee is still earned on that Tenancy and the guarantee in clause 5 does not apply to it.",
      ],
    },
    {
      heading: "4. The fee, what GoldStay collects, and accounting to the Client",
      body: [
        "4.1 The Tenant-Finding Fee is earned when the Tenancy is signed and the Tenant takes occupation. It is charged once for that tenancy. Nothing is payable under this Agreement if no Tenant is placed, whatever work the Manager has done.",
        "4.2 The Manager will collect the first month’s rent and the Deposit from the Tenant before the Tenant takes occupation. The Manager retains the first month’s rent in satisfaction of the Tenant-Finding Fee and remits the Deposit, together with any amount collected over and above the Tenant-Finding Fee, to the Client.",
        "4.3 Where the first month’s rent collected is less than the Tenant-Finding Fee, because the Tenancy begins part way through a month or for any other reason, the shortfall is payable by the Client within five business days of the Placement Statement being made available.",
        "4.4 The Deposit is the Tenant’s money held on trust until the Tenancy ends. The Manager does not deduct anything from the Deposit, does not hold it after remittance, and takes no responsibility for its treatment at the end of the Tenancy. Accounting to the Tenant for the Deposit is the Client’s obligation as landlord.",
        "4.5 Remittance under clause 4.2 will be made within five business days of cleared receipt, in the currency stated in Schedule 1, less applicable conversion or transfer costs. Bank-detail changes must pass GoldStay’s verification process.",
        "4.6 The Manager will make the Placement Statement available on the GoldStay platform. It shows what was received from the Tenant, the Tenant-Finding Fee retained, and the balance remitted. It is the only statement issued under this Agreement, because after Handover no money for the Property passes through the Manager.",
        "4.7 The Tenant-Finding Fee is exclusive of VAT and any similar tax applicable to the Manager’s services. GoldStay may add and collect such tax from the date it becomes legally applicable without requiring an amendment to this Agreement.",
        "4.8 The Client is responsible for income, rental, property and other taxes or statutory charges attributable to the Property or its rental income, including any land rates, land rent or service charge. GoldStay is responsible for taxes on its own income and fees. Because GoldStay does not collect rent after Handover, it does not withhold, account for or remit any tax on the Client’s rental income, and the Client should not assume otherwise.",
      ],
    },
    {
      heading: `5. The ${guaranteeText()} replacement guarantee`,
      body: [
        `5.1 If a Tenant placed by the Manager vacates the Property, or is removed for cause, within ${guaranteeText()} of the Tenancy starting, the Manager will find a replacement Tenant and will not charge a further Tenant-Finding Fee for doing so.`,
        "5.2 The guarantee is a promise to repeat the service, not an indemnity. It does not make the Manager liable for rent the departing Tenant failed to pay, for the cost of recovering possession, for damage to the Property, or for the period the Property stands empty.",
        "5.3 The guarantee applies once per original placement, and does not apply where the Tenant was placed against the Manager’s advice under clause 3.6, where the Client ended the Tenancy other than for cause, or where the Property was not available for the Manager to re-market within a reasonable period.",
        "5.4 The Client must notify the Manager within thirty days of the Tenant vacating or being removed for the guarantee to apply, so that the Manager can begin re-marketing while the file on the original applicant pool is still current.",
      ],
    },
    {
      heading: "6. What is not included",
      body: [
        "6.1 This Agreement covers finding and placing a Tenant. It does not include rent collection, arrears chasing, maintenance, repairs, inspections, utility or service-charge administration, tax filing, deposit adjudication, service of notices, or any dealing with the Tenant after Handover.",
        "6.2 Recovery of arrears, notices to vacate and proceedings for possession are the Client’s responsibility and are conducted in the Client’s name. The Manager has no role in them under this Agreement.",
        "6.3 The Client may appoint the Manager to manage the Property under a separate management agreement at any time, during the Tenancy or afterwards. No re-onboarding, re-listing or transfer fee is charged for doing so, and the guarantee in clause 5 continues to run for the balance of its period.",
      ],
    },
    {
      heading: "7. Client authority and responsibilities",
      body: [
        "7.1 The Client warrants throughout this Agreement that it has the legal right to let the Property to tenants, to receive the rental income, and to appoint the Manager.",
        "7.2 A Client who is not the registered owner warrants that it has the owner’s or head-landlord’s prior written consent to sublet or otherwise let the Property and to appoint an agent. The Client confirms this authority by accepting this Agreement. GoldStay will ordinarily rely on that confirmation without requiring the underlying documents before marketing, but may request them if a question about authority arises or if required by law. The Client must provide them within five business days.",
        "7.3 The Client warrants that letting the Property complies with the title, any head lease, any mortgage, building or association rules, applicable licences, and law. GoldStay is entitled to rely on the Client’s warranties in this section and is not required to investigate or independently verify them.",
        "7.4 The Client must keep the Property safe, habitable and lawfully lettable, with utilities, access and any required certification in place, and must disclose material defects, hazards, disputes, restrictions, infestations or security concerns before the Property is marketed.",
        "7.5 The Client must give the Manager the access needed to conduct viewings, and must respond to an applicant file within a reasonable period. An applicant who is kept waiting will take another property, and the Manager is not responsible for a placement lost that way.",
      ],
    },
    {
      heading: "8. Liability",
      body: [
        "8.1 The Manager is liable for failing to carry out the services in this Agreement with reasonable care and skill. It is not liable for the acts, omissions or solvency of the Tenant, for the condition of the Property, or for the Client’s own management of the Tenancy after Handover.",
        "8.2 Vetting reduces risk and does not remove it. The Manager does not warrant that a Tenant who passed vetting will pay the rent, keep to the Tenancy or look after the Property. The guarantee in clause 5 is the Client’s remedy where a placement fails early, and is the limit of what the Manager offers for that eventuality.",
        "8.3 Neither party is liable for indirect or consequential loss. The Manager’s total liability under this Agreement is limited to the Tenant-Finding Fee actually paid under it, except where liability cannot lawfully be limited.",
        "8.4 Neither party is liable for failure caused by events beyond its reasonable control.",
      ],
    },
    {
      heading: "9. Information, confidentiality and data",
      body: [
        "9.1 Each party will keep the other’s non-public information confidential and use it only for this Agreement.",
        "9.2 The Manager processes personal data of the Client, of applicants and of the Tenant in accordance with the Data Protection Act, 2019 and its privacy notice. Applicant files are shared with the Client for the purpose of the Client’s decision under clause 3.3 and for no other purpose.",
        "9.3 The Client must handle applicant and Tenant personal data lawfully, and becomes the controller of the Tenant’s data in its own right from Handover.",
        "9.4 The GoldStay platform is provided as a convenience for viewing the applicant file, the Tenancy and the Placement Statement. Access may be suspended for maintenance or misuse.",
      ],
    },
    {
      heading: "10. Term, termination and notices",
      body: [
        "10.1 This Agreement starts on the Start Date and ends automatically at Handover, except for clause 5, which survives for its stated period, and clauses 8, 9 and 11, which survive termination.",
        `10.2 Before a Tenant is placed, either party may end this Agreement on ${ctx.noticePeriodDays} days’ written notice. No fee is payable on termination, and the Manager will account for anything it holds for the Property.`,
        "10.3 Either party may end this Agreement immediately for material breach not remedied within fourteen days of written notice, or where required by law.",
        "10.4 Where this Agreement ends before a Tenant is placed, the Client may not within sixty days let the Property to an applicant the Manager introduced without paying the Tenant-Finding Fee. The Manager will on request provide the list of applicants it introduced.",
        "10.5 Notices are given in writing to the addresses in Schedule 1 or through the GoldStay platform.",
      ],
    },
    {
      heading: "11. General and disputes",
      body: [
        "11.1 This Agreement is the entire agreement between the parties for finding a Tenant for the Property and replaces prior discussions.",
        "11.2 Neither party may assign this Agreement without the other’s written consent, which is not to be unreasonably withheld.",
        "11.3 If a provision is unenforceable, the rest stands.",
        "11.4 This Agreement is governed by the laws of Kenya. The parties will attempt to resolve a dispute in good faith, and failing that will refer it to the courts of Kenya.",
      ],
    },
    {
      heading: "12. Communications and acceptance",
      body: [
        "12.1 The Client may accept this Agreement by signing it or by clicking to accept it on the GoldStay platform. Acceptance by either route forms a binding agreement.",
        "12.2 The Manager records the date, time, IP address and user agent of a click-to-accept, together with the version of this Agreement accepted, and makes that acceptance record available to the Client.",
        `12.3 The version of this Agreement is ${TENANT_FINDING_KE_VERSION}. A reprint of an accepted agreement reproduces the version accepted, not the current one.`,
      ],
    },
    {
      heading: "Schedule 1 — Property and commercial terms",
      body: [],
      rows: scheduleOne(ctx),
    },
    {
      heading: "Schedule 2 — What GoldStay does",
      body: [
        "All of the following is within the Tenant-Finding Fee, and none of it is charged for if no Tenant is placed.",
      ],
      bullets: [
        "A rental appraisal, and an honest view on whether the asking rent will let the Property",
        "Professional photographs and a written listing",
        "Distribution to the GoldStay tenant waitlist, the property portals, the GoldStay agent network, and corporate and relocation contacts",
        "Accompanied viewings",
        "Vetting: identity documents, written employer confirmation, evidence of income assessed against the rent, two references taken by telephone, and an interview in person",
        "The completed applicant file, shared with the Client, who makes the final decision",
        "A Tenancy prepared in the Client’s name, with deposit, escalation, notice and repair obligations drafted properly",
        "Collection of the first month’s rent and the Deposit from the Tenant",
        "A photographed move-in inventory, meter readings, keys and utility transfers",
        "The Placement Statement, and remittance of the Deposit and any balance",
      ],
    },
    {
      heading: "Not included under this Agreement",
      body: [
        "The following are outside this Agreement entirely. They are available under a separate management agreement, with no re-onboarding fee.",
      ],
      bullets: [
        "Rent collection and arrears chasing after Handover",
        "Maintenance, repairs and vendor coordination",
        "Periodic inspections",
        "Utility, land rate and service-charge administration",
        "Withholding, filing or remitting tax on the rental income",
        "Deposit adjudication and end-of-tenancy accounting with the Tenant",
        "Service of notices, distress for rent and possession proceedings",
      ],
    },
    {
      heading: "Execution",
      body: [
        `Signed for and on behalf of ${MANAGER_SIGNING_NAME}:`,
        "Name: ____________________    Position: ____________________",
        "Signature: ____________________    Date: ____________________",
        `Signed by the Client, ${ctx.clientLegalName}:`,
        "Name: ____________________    Position: ____________________",
        "Signature: ____________________    Date: ____________________",
      ],
    },
  ];
}
