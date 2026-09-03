import { describe, expect, it } from "vitest";
import { buildShortLetKeSections, type ShortLetContext } from "./short-let-ke";
import { MANAGER } from "./manager";

// The short-let agreement is the document a Kenyan short-let client
// actually accepts, so the failure modes here are legal rather than
// cosmetic: an unsubstituted placeholder, a clause quoting a term that
// contradicts the database, or a "to be confirmed" printed as a bogus
// number. These tests pin exactly those.

const base: ShortLetContext = {
  clientLegalName: "Asha Kimani",
  clientIdNumber: "24681012",
  clientKraPin: "A009123456Z",
  clientAddress: "P.O. Box 4412-00100, Nairobi",
  signingCapacity: "REGISTERED_OWNER",
  propertyDescription: "Riverside Court Apt 4B, Riverside Drive, Nairobi",
  bedrooms: 2,
  maxOccupancy: 4,
  startDate: new Date("2026-09-02T09:00:00Z"),
  launchDate: null,
  commissionPct: "20%",
  termMonths: 3,
  noticePeriodDays: 30,
  payoutCurrency: "USD",
  startupCostsBudgetFormatted: "KES 60,000",
  operatingReserveFormatted: "KES 25,000",
  reference: "GS-2026-004",
};

function flatten(ctx: ShortLetContext): string {
  return buildShortLetKeSections(ctx)
    .flatMap((s) => [
      s.heading,
      ...s.body,
      ...(s.rows ?? []).flatMap((r) => [r.label, ...r.value]),
      ...(s.bullets ?? []),
    ])
    .join("\n");
}

describe("buildShortLetKeSections", () => {
  it("leaves no unsubstituted placeholder from the source document", () => {
    const text = flatten(base);
    // The Word original marks fills as [FULL LEGAL NAME], [KES ●],
    // [SYSTEM GENERATED] and so on. Any bracketed run of caps, or a
    // stray ●, means a placeholder reached the client unfilled.
    expect(text).not.toMatch(/\[[^\]]*\]/);
    expect(text).not.toContain("●");
    expect(text).not.toContain("SYSTEM GENERATED");
    expect(text).not.toContain("DD MONTH YYYY");
  });

  it("substitutes the client, property and reference into the contract", () => {
    const text = flatten(base);
    expect(text).toContain("Asha Kimani");
    expect(text).toContain("A009123456Z");
    expect(text).toContain("P.O. Box 4412-00100, Nairobi");
    expect(text).toContain("Riverside Court Apt 4B, Riverside Drive, Nairobi");
    expect(text).toContain("GS-2026-004");
    expect(text).toContain("02 September 2026");
    expect(text).toContain("Bedrooms: 2  |  Maximum occupancy: 4");
    expect(text).toContain("Currency: USD");
  });

  it("names EAR TADCO LIMITED as the contracting party", () => {
    // GoldStay is a trading name. If the contract named only the
    // trading name it would have no legal counterparty.
    const text = flatten(base);
    expect(text).toContain(MANAGER.legalName);
    expect(text).toContain(MANAGER.companyNumber);
    expect(text).not.toContain("Goldstay Limited");
  });

  it("quotes the snapshotted terms rather than hard-coded ones", () => {
    // The whole point of interpolating: if someone issues an agreement
    // on non-default terms, the prose has to follow the row. A clause
    // reading "three months" over a row saying six is unenforceable
    // at best and misleading at worst.
    const text = flatten({
      ...base,
      commissionPct: "18%",
      termMonths: 6,
      noticePeriodDays: 45,
    });
    expect(text).toContain("“Management Fee” means 18% of Gross Booking Revenue");
    expect(text).toContain("6 full calendar months from the Launch Date");
    expect(text).toContain("A 45-day notice may be given");
    expect(text).not.toContain("three full calendar months");
    expect(text).not.toContain("20% of Gross Booking Revenue");
  });

  it("prints the capacity in the contract's own words", () => {
    const owner = flatten(base);
    expect(owner).toContain("Capacity: Registered owner");

    // A rent-to-rent client. Clause 7.2 is what carries their
    // authority warranty, and Schedule 1 has to name the capacity
    // they're actually contracting in.
    const tenant = flatten({
      ...base,
      signingCapacity: "AUTHORISED_LEASEHOLDER",
    });
    expect(tenant).toContain(
      "Capacity: Tenant or lessee with written short-let rights",
    );
    expect(tenant).toContain(
      "The Client confirms this authority by accepting this Agreement.",
    );

    const operator = flatten({
      ...base,
      signingCapacity: "AUTHORISED_REPRESENTATIVE",
    });
    expect(operator).toContain("Capacity: Authorised operator");
  });

  it("defers unknown Schedule 1 figures instead of inventing them", () => {
    const sparse = flatten({
      ...base,
      clientIdNumber: null,
      clientKraPin: null,
      clientAddress: "   ",
      bedrooms: null,
      maxOccupancy: null,
      startupCostsBudgetFormatted: null,
      operatingReserveFormatted: null,
      reference: null,
    });
    expect(sparse).toContain(
      "KRA PIN: To be confirmed through GoldStay onboarding",
    );
    // Whitespace-only is as absent as null.
    expect(sparse).toContain(
      "Address: To be confirmed through GoldStay onboarding",
    );
    expect(sparse).toContain(
      "Bedrooms: To be confirmed  |  Maximum occupancy: To be confirmed",
    );
    // Still no placeholder syntax, and no "KES undefined" or "null".
    expect(sparse).not.toMatch(/\[[^\]]*\]/);
    expect(sparse).not.toMatch(/undefined|null|NaN/);
  });

  it("describes an unpublished listing's Launch Date as system-recorded", () => {
    // Clause 1.4 makes the Launch Date the start of the Initial
    // Commitment Period, so quoting the Start Date here would shorten
    // the client's commitment by however long onboarding takes.
    expect(flatten(base)).toContain(
      "Launch Date: Recorded by GoldStay when the Property is first published for booking",
    );
    expect(
      flatten({ ...base, launchDate: new Date("2026-10-15T00:00:00Z") }),
    ).toContain("Launch Date: 15 October 2026");
  });

  it("no longer mentions a Forecast Monthly Management Fee", () => {
    // v2 dropped it: the Schedule 1 line, its definition, and limb (b)
    // of clause 10.3. It was never populated on a single property, so
    // every v1 contract already printed it as "to be confirmed" with
    // limb (b) yielding nothing. Pinned because the field is gone
    // from the database — prose referring to it could no longer be
    // filled in, and would quote a fee we cannot compute.
    const text = flatten(base);
    expect(text).not.toMatch(/Forecast Monthly Management Fee/i);
  });

  it("sets the early-exit amount at unrecovered startup costs alone", () => {
    const text = flatten(base);
    expect(text).toContain(
      "an Early Termination Amount equal to unrecovered Startup Costs",
    );
    // The two-limb "greater of (a) ... or (b) ..." wording must not
    // survive: limb (b) was the only thing the forecast fee drove.
    expect(text).not.toContain("the greater of");
  });

  it("keeps the schedules and the acceptance clause", () => {
    const sections = buildShortLetKeSections(base);
    const headings = sections.map((s) => s.heading);
    expect(headings).toContain("Schedule 1 — Property and commercial terms");
    expect(headings).toContain("Schedule 2 — Core services");
    expect(headings).toContain("Execution");

    // Schedule 1 must render as a table and Schedule 2 as bullets,
    // otherwise the renderers silently drop them.
    const schedule1 = sections.find((s) => s.heading.startsWith("Schedule 1"));
    expect(schedule1?.rows?.length).toBeGreaterThan(5);
    const schedule2 = sections.find((s) => s.heading.startsWith("Schedule 2"));
    expect(schedule2?.bullets?.length).toBeGreaterThan(0);

    // Clause 12.3 is the basis for one-click acceptance, so it has to
    // survive any future edit of this file.
    expect(flatten(base)).toContain(
      "This Agreement may be accepted through the GoldStay platform",
    );
  });
});
