import { describe, expect, it } from "vitest";
import {
  buildTenantFindingKeSections,
  TENANT_FINDING_KE_VERSION,
  type TenantFindingContext,
} from "./tenant-finding-ke";

// The tenant-finding contract is the written form of the published
// /tenant-finding page, which makes specific, quotable promises: one
// month's rent, nothing if we place nobody, no monthly charge, a
// six-month replacement guarantee, and no re-onboarding fee to move
// onto management. A client who was sold those and then accepts a
// contract that says otherwise has a complaint that is entirely our
// fault and entirely in writing.
//
// The second risk this file guards is leakage from the two management
// agreements, which share this file's structure and much of its
// phrasing but not its revenue model. A stray "Collected Rent" or
// "Management Fee" here would turn a placement contract into a
// management one.

const ctx: TenantFindingContext = {
  clientLegalName: "Asha Kimani",
  clientIdNumber: "24681012",
  clientKraPin: "A009123456Z",
  clientAddress: "P.O. Box 4412-00100, Nairobi",
  signingCapacity: "REGISTERED_OWNER",
  propertyDescription: "Riverside Court Apt 4B, Riverside Drive, Nairobi",
  bedrooms: 2,
  noticePeriodDays: 14,
  payoutCurrency: "USD",
  reference: "GS-2026-004",
  startDate: new Date("2026-09-04T09:00:00Z"),
};

function flatten(context: TenantFindingContext = ctx): string {
  return buildTenantFindingKeSections(context)
    .flatMap((s) => [
      s.heading,
      ...s.body,
      ...(s.rows ?? []).flatMap((r) => [r.label, ...r.value]),
      ...(s.bullets ?? []),
    ])
    .join("\n");
}

describe("tenant finding agreement (Kenya)", () => {
  it("charges one month's rent, once", () => {
    const text = flatten();
    expect(text).toContain("one month’s gross rent under the Tenancy placed");
    expect(text).toContain("charged once for that tenancy");
  });

  it("charges nothing if no tenant is placed", () => {
    const text = flatten();
    expect(text).toContain("Nothing is payable if no Tenant is placed");
    expect(text).toContain(
      "Nothing is payable under this Agreement if no Tenant is placed",
    );
  });

  // The whole point of the product. If this assertion ever fails the
  // contract has become a management agreement by accident.
  it("makes no recurring charge and is not a management agreement", () => {
    const text = flatten();
    expect(text).toContain("This is not a management agreement");
    expect(text).toContain("makes no recurring charge");
    expect(text).not.toContain("Collected Rent");
    expect(text).not.toContain("Management Fee”");
  });

  it("carries the six-month replacement guarantee at no further fee", () => {
    const text = flatten();
    expect(text).toContain("within six months of the Tenancy starting");
    expect(text).toContain("will not charge a further Tenant-Finding Fee");
  });

  it("states the guarantee is not an indemnity", () => {
    const text = flatten();
    expect(text).toContain("not an indemnity");
    expect(text).toContain("the period the Property stands empty");
  });

  // Published: "There is no re-onboarding fee if you switch."
  it("promises no fee to move onto full management", () => {
    expect(flatten()).toContain(
      "No re-onboarding, re-listing or transfer fee is charged",
    );
  });

  // Published vetting, item by item. These are the five things the
  // page says we do, and a landlord can hold us to each of them.
  it("describes the published vetting in full", () => {
    const text = flatten();
    for (const item of [
      "identity documents",
      "written confirmation of employment",
      "evidence of income assessed against the rent",
      "two references taken by telephone",
      "an interview in person",
    ]) {
      expect(text.toLowerCase()).toContain(item.toLowerCase());
    }
  });

  it("leaves the final tenant decision with the client", () => {
    const text = flatten();
    expect(text).toContain("The Client has the final decision");
    expect(text).toContain("The Client signs it, not the Manager");
  });

  // The money path the business actually runs: tenant pays us the
  // first month and the deposit, we keep the month, the deposit goes
  // to the landlord.
  it("describes keeping the first month and remitting the deposit", () => {
    const text = flatten();
    expect(text).toContain(
      "retains the first month’s rent in satisfaction of the Tenant-Finding Fee",
    );
    expect(text).toContain("remits the Deposit");
  });

  it("does not deduct from the deposit", () => {
    expect(flatten()).toContain(
      "The Manager does not deduct anything from the Deposit",
    );
  });

  it("issues exactly one statement and says why", () => {
    const text = flatten();
    expect(text).toContain("It is the only statement issued under this Agreement");
    expect(text).toContain("no money for the Property passes through the Manager");
  });

  // A client who thinks we are still withholding their rental tax
  // after we have gone is a KRA problem they will discover late.
  it("is explicit that no tax is withheld after handover", () => {
    expect(flatten()).toContain(
      "it does not withhold, account for or remit any tax on the Client’s rental income",
    );
  });

  it("ends the manager's authority at handover", () => {
    const text = flatten();
    expect(text).toContain("The authority in clause 2.2 ends at Handover");
    expect(text).toContain("does not collect rent");
  });

  it("interpolates the snapshotted notice period rather than hard-coding it", () => {
    expect(flatten()).toContain("14 days’ written notice");
    expect(flatten({ ...ctx, noticePeriodDays: 30 })).toContain(
      "30 days’ written notice",
    );
  });

  it("protects the introduction for sixty days after termination", () => {
    expect(flatten()).toContain(
      "may not within sixty days let the Property to an applicant the Manager introduced",
    );
  });

  it("prints the version it was accepted under", () => {
    expect(flatten()).toContain(TENANT_FINDING_KE_VERSION);
  });

  it("falls back to 'to be confirmed' rather than printing a blank term", () => {
    const text = flatten({
      ...ctx,
      clientIdNumber: null,
      clientKraPin: null,
      clientAddress: null,
      bedrooms: null,
    });
    expect(text).toContain("To be confirmed through GoldStay onboarding");
    expect(text).toContain("Bedrooms: To be confirmed");
  });

  it("says the engagement is exclusive only until handover", () => {
    expect(flatten()).toContain("Exclusive until handover or termination");
  });

  // Everything in Schedule 2 is inside the fee, and the page says so.
  it("charges nothing separately for photography or marketing", () => {
    const text = flatten();
    expect(text).toContain(
      "Photography, the written listing, portal distribution, accompanied viewings, vetting, the Tenancy and the move-in inventory are all within the Tenant-Finding Fee",
    );
    expect(text).toContain("No charge of any kind arises if no Tenant is placed");
  });

  it("lists what the client is on their own for", () => {
    const text = flatten();
    for (const excluded of [
      "Rent collection and arrears chasing after Handover",
      "Maintenance, repairs and vendor coordination",
      "Deposit adjudication",
    ]) {
      expect(text).toContain(excluded);
    }
  });
});
