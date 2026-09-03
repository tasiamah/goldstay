import { describe, expect, it } from "vitest";
import {
  AGREEMENT_TEMPLATE_VERSION,
  renderAgreement,
  templateFor,
  type AgreementRenderInput,
} from "./template";
import { SHORT_LET_KE_VERSION } from "./short-let-ke";

// Template selection decides which contract a client is asked to
// accept. Getting it wrong doesn't fail loudly — it serves a Ghanaian
// long-term landlord a Kenyan short-let agreement that talks about
// Booking Channels and a KRA PIN, which they would then accept.
describe("templateFor", () => {
  it("serves the short-let agreement only to Kenyan short-lets", () => {
    expect(templateFor({ country: "KE", propertyType: "SHORT_TERM" })).toBe(
      "SHORT_LET_KE_V1",
    );
  });

  it("falls back to the generic agreement for long-term and for Ghana", () => {
    expect(templateFor({ country: "KE", propertyType: "LONG_TERM" })).toBe(
      "GENERIC_MANAGEMENT_V1",
    );
    expect(templateFor({ country: "GH", propertyType: "SHORT_TERM" })).toBe(
      "GENERIC_MANAGEMENT_V1",
    );
    expect(templateFor({ country: "GH", propertyType: "LONG_TERM" })).toBe(
      "GENERIC_MANAGEMENT_V1",
    );
  });

  it("has a version string per template", () => {
    // Stored on the row and printed on the acceptance record, so a
    // missing entry would leave a signed contract unable to say which
    // words the client agreed to.
    expect(AGREEMENT_TEMPLATE_VERSION.SHORT_LET_KE_V1).toBe(
      SHORT_LET_KE_VERSION,
    );
    expect(AGREEMENT_TEMPLATE_VERSION.GENERIC_MANAGEMENT_V1).toBeTruthy();
  });
});

const input: AgreementRenderInput = {
  template: "SHORT_LET_KE_V1",
  clientName: "Asha Kimani",
  clientCompany: null,
  clientIdNumber: "24681012",
  clientKraPin: "A009123456Z",
  clientAddress: "P.O. Box 4412-00100, Nairobi",
  propertyName: "Riverside Court Apt 4B",
  propertyAddress: "Riverside Drive",
  propertyCity: "Nairobi",
  bedrooms: 2,
  maxOccupancy: 4,
  isShortTerm: true,
  signingCapacity: "REGISTERED_OWNER",
  governingLaw: "Kenya",
  termMonths: 3,
  commissionPct: "20%",
  earlyExitFeeFormatted: "KES 90,000",
  noticePeriodDays: 30,
  payoutCurrency: "USD",
  startupCostsBudgetFormatted: null,
  operatingReserveFormatted: null,
  reference: "GS-2026-004",
  startDate: new Date("2026-09-02T09:00:00Z"),
  launchDate: null,
};

function flatten(sections: ReturnType<typeof renderAgreement>): string {
  return sections
    .flatMap((s) => [
      s.heading,
      ...s.body,
      ...(s.rows ?? []).flatMap((r) => [r.label, ...r.value]),
      ...(s.bullets ?? []),
    ])
    .join("\n");
}

describe("renderAgreement", () => {
  it("renders whichever contract the row records, not the property's shape", () => {
    // A row stores its template, so reprinting a signed agreement has
    // to honour that even where the property would now select the
    // other contract. Same property data, both templates.
    const shortLet = flatten(renderAgreement(input));
    expect(shortLet).toContain("Short-Let Property Management Agreement");
    expect(shortLet).toContain("Gross Booking Revenue");

    const generic = flatten(
      renderAgreement({ ...input, template: "GENERIC_MANAGEMENT_V1" }),
    );
    expect(generic).toContain("Property Management Agreement");
    expect(generic).not.toContain("Gross Booking Revenue");
    expect(generic).toContain("1. Parties");
  });

  it("uses the company as the contracting party where there is one", () => {
    const text = flatten(
      renderAgreement({ ...input, clientCompany: "Pinetree Holdings Ltd" }),
    );
    expect(text).toContain("Pinetree Holdings Ltd (acting through Asha Kimani)");
  });
});
