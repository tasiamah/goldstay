import { describe, expect, it } from "vitest";
import { buildLongLetKeSections, type LongLetContext } from "./long-let-ke";

// The Kenyan long-term contract is the written form of the published
// long-term service sheet, and that sheet says "Service details are
// subject to the signed Management Agreement". So the risk this file
// guards is specific: a promise on the marketing page that the
// contract quietly doesn't make, or contradicts. A client who was sold
// a 30-day exit and then accepts a contract with a lock-in has a
// complaint that is entirely our fault and entirely in writing.
//
// It also guards the leak between the two Kenyan contracts, which
// share a structure and a lot of phrasing but not a revenue model.

const ctx: LongLetContext = {
  clientLegalName: "Asha Kimani",
  clientIdNumber: "24681012",
  clientKraPin: "A009123456Z",
  clientAddress: "P.O. Box 4412-00100, Nairobi",
  signingCapacity: "REGISTERED_OWNER",
  propertyDescription: "Riverside Court Apt 4B, Riverside Drive, Nairobi",
  bedrooms: 2,
  commissionPct: "10%",
  noticePeriodDays: 30,
  payoutCurrency: "USD",
  reference: "GS-2026-004",
  startDate: new Date("2026-09-04T09:00:00Z"),
};

function flatten(context: LongLetContext = ctx): string {
  return buildLongLetKeSections(context)
    .flatMap((s) => [
      s.heading,
      ...s.body,
      ...(s.rows ?? []).flatMap((r) => [r.label, ...r.value]),
      ...(s.bullets ?? []),
    ])
    .join("\n");
}

describe("buildLongLetKeSections", () => {
  it("makes every commercial promise from the service sheet", () => {
    const text = flatten();

    // 10% of collected rent, and only on rent actually collected.
    expect(text).toContain("10% of Collected Rent");
    expect(text).toContain("charged only on rent actually received");

    // Tenant-finding is one month's rent, one-off.
    expect(text).toContain("one month’s gross rent under the Tenancy placed");

    // No setup fees, no hidden deductions.
    expect(text).toContain("No setup, onboarding, marketing, photography");

    // Payout on the 5th, rent collected in KES.
    expect(text).toContain("By the 5th day of each month");
    expect(text).toContain("Rent is collected in KES");

    // Expense controls.
    expect(text).toContain("over USD 50");
    expect(text).toContain("above USD 250");

    // 48-hour acknowledgement.
    expect(text).toContain("within 48 hours");

    // Six-month tenant replacement guarantee, at no further fee.
    expect(text).toContain("within six months of the Tenancy starting");
    expect(text).toContain("will not charge a further Tenant-Finding Fee");

    // Landlord has the final say before a lease is signed.
    expect(text).toContain("final decision on which Tenant is accepted");
    expect(text).toContain(
      "No Tenancy will be signed without the Client’s approval",
    );
  });

  it("promises no lock-in and quotes no minimum term", () => {
    const text = flatten();

    expect(text).toContain("There is no minimum term and no lock-in period");
    expect(text).toContain("No exit fee is payable");
    expect(text).toContain("Minimum term: none");

    // The single most damaging contradiction available: the row's
    // termMonths is 1 to mean "rolling", and if it ever reached this
    // prose it would read as a one-month commitment. The context type
    // has no termMonths at all, so this asserts the shape holds.
    expect(text).not.toMatch(/\b1 (full calendar )?months?\b/);
    expect(text).not.toContain("Initial Commitment Period");
  });

  it("hands the property back clean on exit", () => {
    // "No lock-in of deposits, tenant relationships or property
    // records" is a specific promise, and the tempting thing for an
    // agent to do on the way out is hold the deposit against a
    // disputed invoice. The contract has to rule that out.
    const text = flatten();
    expect(text).toContain("without withholding them as security");
    expect(text).toContain("charges no further Management Fee");
  });

  it("charges no fee on arrears, deposits or empty months", () => {
    const text = flatten();
    expect(text).toContain(
      "Rent that falls due but is not paid carries no Management Fee",
    );
    expect(text).toContain("does not charge the Client for the period the");
    expect(text).toContain("is not Collected Rent, and carries no Management");
  });

  it("interpolates the fee and notice period rather than hard-coding them", () => {
    // The row is the source of truth for both. A contract that says
    // 10% while the row bills 12% is the one bug in here that costs
    // real money, in whichever direction.
    const text = flatten({
      ...ctx,
      commissionPct: "12%",
      noticePeriodDays: 45,
    });

    expect(text).toContain("12% of Collected Rent");
    expect(text).toContain("45 days’ written notice");
    expect(text).toContain("Notice to terminate: 45 days");
    expect(text).not.toContain("10%");
    expect(text).not.toContain("30 days’ written notice");
  });

  it("spells fixed periods as words, like the short-let contract", () => {
    // Mixing "6 months" into prose that says "seven days" and "five
    // business days" elsewhere reads as machine-assembled. Numerals
    // are for the snapshotted terms, money and dates only.
    const text = flatten();
    expect(text).toContain("six-month guarantee");
    expect(text).not.toMatch(/\b6[- ]month/);
    expect(text).not.toMatch(/\b(7 days|3 business|5 business)\b/);
  });

  it("describes a tenancy, not a short stay", () => {
    // Both Kenyan contracts are built from the same skeleton, so the
    // short-let vocabulary is one careless copy-paste away.
    const text = flatten();
    expect(text).not.toContain("Gross Booking Revenue");
    expect(text).not.toContain("Booking Channel");
    expect(text).not.toContain("Startup Costs");
    expect(text).not.toContain("guest");
    expect(text).not.toContain("Airbnb");
    expect(text).not.toContain("nightly");
  });

  it("states a non-owner's authority in subletting terms", () => {
    const text = flatten({
      ...ctx,
      signingCapacity: "AUTHORISED_LEASEHOLDER",
    });
    expect(text).toContain(
      "Capacity: Tenant or lessee with written subletting rights",
    );
    // The short-let schedule label would say "short-let rights" here,
    // which is the wrong permission for a long tenancy.
    expect(text).not.toContain("short-let rights");
    expect(text).toContain("consent to sublet");
  });

  it("falls back to onboarding for identity details we don't hold yet", () => {
    // An agreement is now issued the moment a property is created, so
    // a KRA PIN or postal address often isn't on file. Schedule 1 has
    // to say so rather than print an empty row.
    const text = flatten({
      ...ctx,
      clientIdNumber: null,
      clientKraPin: null,
      clientAddress: "   ",
    });
    const tbcs = text.match(/To be confirmed through GoldStay onboarding/g);
    expect(tbcs).toHaveLength(3);
  });

  it("carries the reference, and says so when there isn't one yet", () => {
    expect(flatten()).toContain("GS-2026-004");
    expect(flatten({ ...ctx, reference: null })).toContain(
      "Issued on acceptance",
    );
  });
});
