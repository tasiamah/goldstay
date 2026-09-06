import { describe, expect, it } from "vitest";
import { buildShortLetKeSections } from "./short-let-ke";
import { buildLongLetKeSections } from "./long-let-ke";
import {
  PHOTOGRAPHY_FEE_TWO_PLUS_BEDS_USD,
  PHOTOGRAPHY_FEE_UP_TO_ONE_BED_USD,
  PHOTOGRAPHY_RATE_TEXT,
} from "./photography";

// The point of a shared rate card is that the two Kenyan contracts
// cannot quote different prices for the same service. A landlord with
// one of each — or one moving a property between them — reading USD
// 100 in one document and USD 120 in the other is an argument we lose,
// so this asserts the identical string reaches both.

function flattenShortLet(): string {
  return buildShortLetKeSections({
    clientLegalName: "Asha Kimani",
    clientIdNumber: "24681012",
    clientKraPin: "A009123456Z",
    clientAddress: "P.O. Box 4412-00100, Nairobi",
    signingCapacity: "REGISTERED_OWNER",
    propertyDescription: "Riverside Court Apt 4B, Riverside Drive, Nairobi",
    bedrooms: 2,
    maxOccupancy: 4,
    startDate: new Date("2026-09-06T09:00:00Z"),
    launchDate: null,
    commissionPct: "20%",
    termMonths: 3,
    noticePeriodDays: 30,
    payoutCurrency: "USD",
    startupCostsBudgetFormatted: null,
    operatingReserveFormatted: null,
    reference: "GS-2026-004",
  })
    .flatMap((s) => [
      ...s.body,
      ...(s.rows ?? []).flatMap((r) => r.value),
      ...(s.bullets ?? []),
    ])
    .join("\n");
}

function flattenLongLet(): string {
  return buildLongLetKeSections({
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
    startDate: new Date("2026-09-06T09:00:00Z"),
  })
    .flatMap((s) => [
      ...s.body,
      ...(s.rows ?? []).flatMap((r) => r.value),
      ...(s.bullets ?? []),
    ])
    .join("\n");
}

describe("photography rate card", () => {
  it("reaches both Kenyan contracts as the same words", () => {
    expect(flattenShortLet()).toContain(PHOTOGRAPHY_RATE_TEXT);
    expect(flattenLongLet()).toContain(PHOTOGRAPHY_RATE_TEXT);
  });

  it("charges more for two bedrooms than for one", () => {
    // Guards a transposed edit, which would read plausibly in both
    // documents and undercharge every larger property.
    expect(PHOTOGRAPHY_FEE_TWO_PLUS_BEDS_USD).toBeGreaterThan(
      PHOTOGRAPHY_FEE_UP_TO_ONE_BED_USD,
    );
  });

  it("states both tiers rather than resolving one against bedrooms", () => {
    // Bedrooms are nullable and a studio is sometimes recorded as one
    // bed, so a single computed figure would sometimes be the wrong
    // one. Naming both tiers is correct whatever the property is.
    for (const text of [flattenShortLet(), flattenLongLet()]) {
      expect(text).toContain(`USD ${PHOTOGRAPHY_FEE_UP_TO_ONE_BED_USD}`);
      expect(text).toContain(`USD ${PHOTOGRAPHY_FEE_TWO_PLUS_BEDS_USD}`);
    }
  });
});
