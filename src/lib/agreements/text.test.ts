import { describe, expect, it } from "vitest";
import type { SigningCapacity } from "@prisma/client";
import { buildAgreementSections } from "./text";

// Clause 2 of the management agreement is the reason this file exists.
// Not every Goldstay client owns the property they hand us: plenty are
// rent-to-rent operators subletting under a head lease, and some sign
// for the owner under a power of attorney. If the wrong warranty renders
// we have either asked a non-owner to warrant title they don't hold, or
// let a non-owner sign with no authority warranty at all — both of which
// only surface when the registered owner turns up mid-tenancy.

function sections(capacity: SigningCapacity, isShortTerm = false) {
  return buildAgreementSections({
    clientName: "Asha Kimani",
    clientCompany: null,
    propertyName: "Pinetree Plaza A4B",
    propertyAddress: "Ring Road, Westlands",
    propertyCity: "Nairobi",
    governingLaw: "Kenya",
    termMonths: 12,
    commissionPct: "20%",
    earlyExitFeeFormatted: "KES 75,000",
    noticePeriodDays: 60,
    isShortTerm,
    signingCapacity: capacity,
  });
}

function clause(capacity: SigningCapacity, heading: string, isShortTerm = false) {
  const section = sections(capacity, isShortTerm).find((s) =>
    s.heading.startsWith(heading),
  );
  if (!section) throw new Error(`no clause starting "${heading}"`);
  return section.body.join("\n\n");
}

const ALL_CAPACITIES: SigningCapacity[] = [
  "REGISTERED_OWNER",
  "AUTHORISED_LEASEHOLDER",
  "AUTHORISED_REPRESENTATIVE",
];

describe("buildAgreementSections", () => {
  it("names the counterparty Client, never Owner, whatever the capacity", () => {
    for (const capacity of ALL_CAPACITIES) {
      const parties = clause(capacity, "1. Parties");
      expect(parties).toContain('("Client")');
      expect(parties).not.toContain('("Owner")');
    }
  });

  it("warrants authority to let and to sign under every capacity", () => {
    for (const capacity of ALL_CAPACITIES) {
      const authority = clause(capacity, "2. Authority");
      expect(authority).toContain("full right and authority");
      expect(authority).toContain("appoint Goldstay as managing agent");
      expect(authority).toContain("enter into this Agreement");
      // Consents are what actually bite in Kenya: spousal consent and
      // the head landlord's are the two that void a letting.
      expect(authority).toContain("spousal");
      expect(authority).toContain("head-landlord");
    }
  });

  it("keeps the numbering stable so cross-references hold", () => {
    for (const capacity of ALL_CAPACITIES) {
      const headings = sections(capacity).map((s) => s.heading);
      expect(headings[0]).toBe("1. Parties");
      expect(headings[1]).toBe("2. Authority to let the Property and to sign");
      // Clause 2 points at clause 8 by number for the non-owner cases.
      expect(headings[7]).toBe("8. Early termination");
    }
  });

  describe("registered owner", () => {
    it("warrants title and says nothing about a granted authority", () => {
      const authority = clause("REGISTERED_OWNER", "2. Authority");
      expect(authority).toContain("they are the registered owner");
      expect(authority).toContain("evidence of title");
      expect(authority).not.toContain("is not the registered owner");
      expect(authority).not.toContain("power of attorney");
    });

    it("puts taxes, insurance and structural repair on the client", () => {
      const responsibilities = clause("REGISTERED_OWNER", "6. Client's");
      expect(responsibilities).toContain(
        "The Client is responsible for property taxes",
      );
    });
  });

  describe("rent-to-rent leaseholder", () => {
    it("states plainly that the client is not the owner", () => {
      const authority = clause("AUTHORISED_LEASEHOLDER", "2. Authority");
      expect(authority).toContain("The Client is not the registered owner");
    });

    it("requires express written permission to sublet and to appoint an agent", () => {
      const authority = clause("AUTHORISED_LEASEHOLDER", "2. Authority");
      expect(authority).toContain("express written permission");
      expect(authority).toContain("sublet");
      expect(authority).toContain("appoint a managing agent");
      expect(authority).toContain("lease, tenancy or other right of occupation");
    });

    it("carries an evidence obligation, an indemnity and a lapse trigger", () => {
      const authority = clause("AUTHORISED_LEASEHOLDER", "2. Authority");
      expect(authority).toContain("produce evidence of that authority");
      expect(authority).toContain("indemnifies Goldstay");
      expect(authority).toContain("ends, lapses or is withdrawn");
      // Losing authority must not become a free exit from the term.
      expect(authority).toContain("as though the Client had given notice");
    });

    it("ties the warranty to the term and to changes in the head lease", () => {
      const authority = clause("AUTHORISED_LEASEHOLDER", "2. Authority");
      expect(authority).toContain("at least the initial term");
      expect(authority).toContain("terminated early");
    });

    it("keeps standing costs and head rent off Goldstay", () => {
      const responsibilities = clause("AUTHORISED_LEASEHOLDER", "6. Client's");
      expect(responsibilities).toContain("None of them fall to Goldstay");
      expect(responsibilities).toContain(
        "rent or other sum the Client owes the registered owner",
      );
      expect(responsibilities).toContain("is not reduced by it");
      // Commission is on gross income, so the head rent is irrelevant
      // to what Goldstay is owed.
      expect(responsibilities).not.toContain(
        "The Client is responsible for property taxes",
      );
    });
  });

  describe("attorney or representative", () => {
    it("warrants a subsisting written authority that binds the owner", () => {
      const authority = clause("AUTHORISED_REPRESENTATIVE", "2. Authority");
      expect(authority).toContain("The Client is not the registered owner");
      expect(authority).toContain("power of attorney");
      expect(authority).toContain("bind the registered owner");
      expect(authority).toContain("has not been revoked");
    });

    it("does not import the rent-to-rent head-rent clause", () => {
      const responsibilities = clause("AUTHORISED_REPRESENTATIVE", "6. Client's");
      expect(responsibilities).toContain("None of them fall to Goldstay");
      expect(responsibilities).not.toContain("rent or other sum the Client owes");
    });
  });

  it("describes the letting the way the property is actually let", () => {
    expect(clause("AUTHORISED_LEASEHOLDER", "2. Authority", true)).toContain(
      "guests on a short-stay basis",
    );
    expect(clause("AUTHORISED_LEASEHOLDER", "2. Authority", false)).toContain(
      "let the Property to tenants",
    );
  });
});
