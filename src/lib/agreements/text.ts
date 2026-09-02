// Plain-text body for the management agreement. Lives next to the
// schema so the same paragraphs render in both the client sign page
// (HTML) and the signed PDF (React-PDF). Keeping it as structured
// data rather than a hand-formatted blob means we can swap in
// translations or a country-specific clause set later without
// rewriting the renderer.
//
// IMPORTANT: do not edit terms here that appear on the form. The
// commercial terms (term length, commission, exit fee, notice) come
// from the snapshotted ManagementAgreement row, not from this file.
// Anything templated in {curly braces} is filled at render time.
//
// The counterparty is the "Client", not the "Owner", because a good
// share of the people who sign this do not own the property: they are
// rent-to-rent operators subletting under a head lease, or attorneys
// and directors signing for the registered owner. Clause 2 is where
// that is pinned down — it renders a different authority warranty per
// ManagementAgreement.signingCapacity, which is snapshotted from the
// property at generation time.

import type { SigningCapacity } from "@prisma/client";

export type AgreementSection = {
  heading: string;
  body: string[]; // paragraphs; rendered with blank line between
};

export type AgreementContext = {
  clientName: string;
  clientCompany: string | null;
  propertyName: string;
  propertyAddress: string;
  propertyCity: string;
  governingLaw: string;
  termMonths: number;
  commissionPct: string; // already formatted, e.g. "20%"
  earlyExitFeeFormatted: string; // e.g. "KES 75,000"
  noticePeriodDays: number;
  isShortTerm: boolean;
  // Capacity the Client signs in. Drives clause 2 (Authority) and the
  // split of standing costs in clause 6.
  signingCapacity: SigningCapacity;
};

// One sentence in clause 1 stating, in plain terms, which side of the
// title the signatory sits on. Deliberately blunt: if the Client is not
// the owner, the contract should say so on its first page rather than
// leave it to be inferred from a warranty three clauses down.
function capacityRecital(capacity: SigningCapacity): string {
  switch (capacity) {
    case "REGISTERED_OWNER":
      return "The Client enters into this Agreement as the registered owner of the Property.";
    case "AUTHORISED_LEASEHOLDER":
      return "The Client enters into this Agreement as the tenant or lessee of the Property and not as its registered owner, and lets the Property out with the registered owner's written permission.";
    case "AUTHORISED_REPRESENTATIVE":
      return "The Client enters into this Agreement on behalf of the registered owner of the Property and not as its registered owner, acting under a written authority given to them by the registered owner.";
  }
}

// Clause 2. The capacity-specific warranty about the right to let the
// Property and to sign this Agreement. The non-owner branches carry the
// extra weight: an express permission-to-sublet warranty, an evidence
// obligation, and an indemnity, because Goldstay's exposure when a
// rent-to-rent client has overstated their authority is the registered
// owner turning up mid-tenancy.
function authorityParagraphs(
  capacity: SigningCapacity,
  isShortTerm: boolean,
): string[] {
  const letting = isShortTerm
    ? "let the Property to guests on a short-stay basis"
    : "let the Property to tenants";

  const common =
    `The Client warrants that they have the full right and authority to ${letting}, to appoint Goldstay as managing agent for the Property, and to enter into this Agreement. The Client further warrants that every consent required for them to do so — including any spousal, co-owner, mortgagee, head-landlord, sectional-title or management-company consent that applies — has been obtained and remains in force.`;

  const evidenceAndIndemnity =
    "The Client will produce evidence of that authority whenever Goldstay asks for it. Goldstay may rely on the warranties in this clause without further enquiry. The Client indemnifies Goldstay against any claim, loss or expense arising from those warranties proving to be untrue, including any claim brought by the registered owner or by a tenant or guest. If the Client's authority to let the Property ends, lapses or is withdrawn, the Client will tell Goldstay in writing immediately, and Goldstay may then terminate this Agreement with immediate effect, with clause 8 applying as though the Client had given notice.";

  switch (capacity) {
    case "REGISTERED_OWNER":
      return [
        common,
        "The Client warrants that they are the registered owner of the Property, or one of its registered co-owners signing with the authority of the others, and that their title carries no restriction that would prevent the Property being let on the terms of this Agreement.",
        "The Client will produce evidence of title whenever Goldstay asks for it, and indemnifies Goldstay against any claim, loss or expense arising from the warranties in this clause proving to be untrue.",
      ];
    case "AUTHORISED_LEASEHOLDER":
      return [
        "The Client is not the registered owner of the Property.",
        common,
        `The Client warrants that they hold a valid and subsisting lease, tenancy or other right of occupation over the Property, and that the registered owner has given them express written permission both to sublet or otherwise ${letting} and to appoint a managing agent such as Goldstay to do so on their behalf. Nothing in that lease or tenancy prohibits or restricts the letting arrangements this Agreement contemplates.`,
        "The Client warrants that their lease or tenancy runs for at least the initial term of this Agreement, and undertakes to tell Goldstay in writing as soon as it is due to expire, is terminated early, or is varied in a way that affects the right to let the Property.",
        evidenceAndIndemnity,
      ];
    case "AUTHORISED_REPRESENTATIVE":
      return [
        "The Client is not the registered owner of the Property.",
        common,
        "The Client warrants that they hold a valid and subsisting written authority from the registered owner — such as a power of attorney, a board resolution, or an appointment as executor or trustee — which permits them to let the Property, to appoint a managing agent, and to sign this Agreement so as to bind the registered owner, and that the authority has not been revoked.",
        evidenceAndIndemnity,
      ];
  }
}

// Clause 6. Property taxes, insurance and structural repair sit with
// whoever holds the title. Where the Client is not the owner we can't
// simply assign those to them, but we also won't let them fall to
// Goldstay — so the Client's duty becomes one of procurement rather
// than of payment, and their liability to Goldstay is stated to be
// unaffected by however they and the owner have divided things up.
function standingCostParagraphs(capacity: SigningCapacity): string[] {
  if (capacity === "REGISTERED_OWNER") {
    return [
      "The Client is responsible for property taxes, insurance covering loss of rent and public liability, and any structural maintenance not arising from ordinary wear-and-tear.",
    ];
  }

  const shared = [
    "The Client is responsible for ensuring that property taxes, insurance covering loss of rent and public liability, and structural maintenance not arising from ordinary wear-and-tear are in place and kept current for the Property, whether the Client attends to these directly or the registered owner does so. None of them fall to Goldstay, and the Client's obligations to Goldstay under this Agreement are unaffected by however those responsibilities are divided between the Client and the registered owner.",
  ];

  if (capacity === "AUTHORISED_LEASEHOLDER") {
    shared.push(
      "Any rent or other sum the Client owes the registered owner remains the Client's own obligation. Goldstay's commission is calculated on the gross income the Property generates and is not reduced by it, and Goldstay has no duty to account or pay to the registered owner directly.",
    );
  }

  return shared;
}

export function buildAgreementSections(ctx: AgreementContext): AgreementSection[] {
  const clientLabel = ctx.clientCompany
    ? `${ctx.clientCompany} (acting through ${ctx.clientName})`
    : ctx.clientName;

  const serviceLine = ctx.isShortTerm
    ? "marketing the Property on Airbnb and other approved short-stay channels, vetting guests, coordinating cleaning and turnover, handling guest communication, and remitting net payouts to the Client each calendar month."
    : "sourcing and vetting tenants, drafting tenancy agreements on the Client's behalf, collecting monthly rent, managing routine maintenance requests, and remitting net rent to the Client each calendar month.";

  return [
    {
      heading: "1. Parties",
      body: [
        `This Property Management Agreement ("Agreement") is entered into between Goldstay Limited ("Goldstay") and ${clientLabel} ("Client") in respect of the property at ${ctx.propertyAddress}, ${ctx.propertyCity} ("Property").`,
        `"Client" means the person or entity signing this Agreement, being the person entitled to let the Property and to appoint a managing agent for it. Goldstay contracts with, accounts to, and remits payouts to the Client. ${capacityRecital(ctx.signingCapacity)}`,
      ],
    },
    {
      heading: "2. Authority to let the Property and to sign",
      body: authorityParagraphs(ctx.signingCapacity, ctx.isShortTerm),
    },
    {
      heading: "3. Services",
      body: [
        `Goldstay will act as the Client's exclusive managing agent for the Property. Services include ${serviceLine}`,
        "Goldstay will provide the Client with monthly statements detailing all inflows, outflows, and the resulting net payout, downloadable from the Client's Goldstay portal.",
      ],
    },
    {
      heading: "4. Term and renewal",
      body: [
        `This Agreement is for an initial term of ${ctx.termMonths} months from the Effective Date. At the end of the initial term it renews automatically for successive twelve-month periods unless either party gives written notice of non-renewal at least ${ctx.noticePeriodDays} days before the end of the then-current term.`,
      ],
    },
    {
      heading: "5. Commission",
      body: [
        `In consideration for the Services, the Client agrees to pay Goldstay a management commission of ${ctx.commissionPct} of gross income generated by the Property (rent for long-term lettings; gross booking revenue net of OTA fees for short-term stays). Goldstay deducts its commission from amounts collected before remitting the balance to the Client.`,
        "Out-of-pocket expenses (cleaning, repairs, statutory fees) are passed through at cost and itemised on the monthly statement.",
      ],
    },
    {
      heading: "6. Client's responsibilities",
      body: standingCostParagraphs(ctx.signingCapacity),
    },
    {
      heading: "7. Goldstay's responsibilities",
      body: [
        "Goldstay will hold all rental and booking revenue in a clearly identifiable client trust arrangement until remittance.",
        "Goldstay will exercise reasonable skill and care in the discharge of its duties and will not act outside the scope of this Agreement without the Client's prior written consent.",
      ],
    },
    {
      heading: "8. Early termination",
      body: [
        `Either party may terminate this Agreement before the end of the initial term by giving the other party at least ${ctx.noticePeriodDays} days written notice. If the Client terminates before the end of the initial term other than for Goldstay's material breach, the Client will pay Goldstay an early-exit fee of ${ctx.earlyExitFeeFormatted} to recover the up-front investment in onboarding, photography, listing optimisation and channel setup.`,
        "No early-exit fee is payable where Goldstay terminates without cause, where termination is for Goldstay's material breach, or where the Property becomes legally untenantable through no fault of the Client.",
      ],
    },
    {
      heading: "9. Payouts and reconciliation",
      body: [
        "Goldstay will remit the Client's share by the 10th of the calendar month following the month of collection. Statements are reconciled to the underlying bookings or lease and are auditable through the Goldstay portal for at least 24 months after generation.",
      ],
    },
    {
      heading: "10. Confidentiality and data",
      body: [
        "Each party will keep confidential information disclosed under this Agreement confidential. Personal data of guests and tenants will be handled in accordance with applicable data-protection law in the governing jurisdiction.",
      ],
    },
    {
      heading: "11. Governing law",
      body: [
        `This Agreement is governed by the laws of ${ctx.governingLaw} and the parties submit to the exclusive jurisdiction of the courts of ${ctx.governingLaw}.`,
      ],
    },
    {
      heading: "12. Entire agreement",
      body: [
        "This Agreement constitutes the entire agreement between the parties on its subject matter and supersedes all prior discussions or arrangements. Variations must be in writing and signed by both parties.",
      ],
    },
  ];
}
