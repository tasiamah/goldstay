import { describe, expect, it } from "vitest";
import { renderToBuffer } from "@react-pdf/renderer";

import { StatementDocument } from "./StatementDocument";
import { buildStatement, type StatementTransaction } from "./aggregate";
import { buildShortTermSummary } from "./short-term";

// The statement PDF had no test of any kind, because tsconfig sets
// "jsx": "preserve" for Next and Vite could not then parse a .tsx at
// all. Every template change was therefore shipped on the strength of
// tsc and a build, neither of which executes the component — and
// @react-pdf/renderer throws at render time on things that type-check
// perfectly, such as a bare string outside a <Text>, or a style
// property its subset of CSS does not implement.
//
// vitest.config.ts now overrides the JSX setting, so these actually
// run the renderer.

const september = { year: 2026, month: 9 } as const;
const period = {
  start: new Date(Date.UTC(2026, 8, 1)),
  end: new Date(Date.UTC(2026, 9, 1)),
};

const client = {
  fullName: "Yar Aguer Gabriel",
  companyName: null,
  email: "yar@example.com",
  preferredCurrency: "USD",
};

function tx(
  overrides: Partial<StatementTransaction> = {},
): StatementTransaction {
  return {
    id: "t1",
    occurredOn: new Date(Date.UTC(2026, 8, 13)),
    type: "RENT",
    direction: "INFLOW",
    amount: 240,
    currency: "USD",
    description: "Gross from Guest",
    reference: null,
    propertyId: "polaris",
    propertyName: "Polaris Residency",
    leaseId: null,
    tenantName: null,
    ...overrides,
  };
}

function stay(
  overrides: Partial<Parameters<typeof buildShortTermSummary>[0][number]> = {},
) {
  return {
    propertyId: "polaris",
    propertyName: "Polaris Residency",
    checkIn: new Date(Date.UTC(2026, 8, 13)),
    checkOut: new Date(Date.UTC(2026, 8, 19)),
    nights: 6,
    grossAmount: 240,
    otaCommission: 57.01,
    cleaningFee: 7.7,
    netPayout: 175.29,
    currency: "USD",
    status: "CONFIRMED" as const,
    ...overrides,
  };
}

async function render(
  transactions: StatementTransaction[],
  deductions: Parameters<typeof buildShortTermSummary>[1] = [],
  stays: Parameters<typeof buildShortTermSummary>[0] = [],
) {
  return renderToBuffer(
    StatementDocument({
      period: september,
      client,
      statement: buildStatement(transactions, {
        preferredCurrency: client.preferredCurrency,
      }),
      shortTerm: buildShortTermSummary(stays, deductions, period),
      generatedAt: new Date(Date.UTC(2026, 9, 5)),
    }),
  );
}

// A PDF that renders is not automatically a correct one, but a PDF
// that throws is always wrong, and that is the failure that reaches a
// client as "something went wrong" when they click Download.
const isPdf = (buf: Buffer) =>
  buf.length > 1000 && buf.subarray(0, 5).toString() === "%PDF-";

describe("StatementDocument", () => {
  it("renders a month with nothing in it", async () => {
    // The emptiest possible input. Every optional branch in the
    // template is skipped, which is exactly when a missing null guard
    // shows up.
    expect(isPdf(await render([]))).toBe(true);
  });

  it("renders a month with no short-term section at all", async () => {
    // A long-let client never gets a shortTerm array.
    const buf = await renderToBuffer(
      StatementDocument({
        period: september,
        client,
        statement: buildStatement([tx()]),
        shortTerm: undefined,
        generatedAt: new Date(Date.UTC(2026, 9, 5)),
      }),
    );
    expect(isPdf(buf)).toBe(true);
  });

  it("renders the full short-stay month a managed owner receives", async () => {
    const buf = await render(
      [
        tx(),
        tx({ id: "t2", type: "OTA_COMMISSION", direction: "OUTFLOW", amount: 57.01 }),
        tx({ id: "t3", type: "CLEANING_FEE", direction: "OUTFLOW", amount: 7.7 }),
        tx({
          id: "t4",
          type: "GOLDSTAY_COMMISSION",
          direction: "OUTFLOW",
          amount: 48,
        }),
        tx({
          id: "t5",
          type: "UTILITIES",
          direction: "OUTFLOW",
          amount: 15.41,
          description: "Electricity top-up — KES 2,000 at 129.748 (XE)",
        }),
      ],
      [
        {
          propertyId: "polaris",
          type: "GOLDSTAY_COMMISSION",
          amount: 48,
          currency: "USD",
        },
        {
          propertyId: "polaris",
          type: "UTILITIES",
          amount: 15.41,
          currency: "USD",
          description: "Electricity top-up — KES 2,000 at 129.748 (XE)",
        },
      ],
      [stay()],
    );
    expect(isPdf(buf)).toBe(true);
  });

  // The case that produced "Your payout — KES -6,000.00": a cost paid
  // in shillings on a unit that bills guests in dollars.
  it("renders a month where one currency nets negative", async () => {
    const buf = await render(
      [
        tx(),
        tx({
          id: "t2",
          type: "REPAIR",
          direction: "OUTFLOW",
          amount: 6000,
          currency: "KES",
          description: "Electricity token machine repair",
        }),
      ],
      [],
      [stay()],
    );
    expect(isPdf(buf)).toBe(true);
  });

  it("renders when every currency nets negative", async () => {
    // No payout line at all, so the hero has nothing to lead with.
    const buf = await render([
      tx({ type: "REPAIR", direction: "OUTFLOW", amount: 6000, currency: "KES" }),
    ]);
    expect(isPdf(buf)).toBe(true);
  });

  it("renders a cost with no description, which falls back to the type", async () => {
    const buf = await render(
      [tx()],
      [
        {
          propertyId: "polaris",
          type: "REPAIR",
          amount: 40,
          currency: "USD",
          description: null,
        },
      ],
      [stay()],
    );
    expect(isPdf(buf)).toBe(true);
  });

  it("renders a stay carrying no OTA fee and no cleaning", async () => {
    // A direct booking. Both grouped blocks are skipped, leaving the
    // guest payment and the payout adjacent.
    const buf = await render(
      [tx()],
      [],
      [stay({ otaCommission: null, cleaningFee: null, netPayout: 240 })],
    );
    expect(isPdf(buf)).toBe(true);
  });

  it("renders a single-night stay, so the turnover label is singular", async () => {
    const buf = await render(
      [tx()],
      [],
      [
        stay({
          checkIn: new Date(Date.UTC(2026, 8, 20)),
          checkOut: new Date(Date.UTC(2026, 8, 21)),
          nights: 1,
          grossAmount: 40,
          netPayout: 22.8,
        }),
      ],
    );
    expect(isPdf(buf)).toBe(true);
  });

  it("renders several properties in several currencies", async () => {
    const buf = await render(
      [
        tx(),
        tx({
          id: "t2",
          propertyId: "kindaruma",
          propertyName: "Kindaruma Homes Apartments",
          amount: 85000,
          currency: "KES",
        }),
      ],
      [],
      [
        stay(),
        stay({
          propertyId: "kindaruma",
          propertyName: "Kindaruma Homes Apartments",
          currency: "KES",
          grossAmount: 85000,
          otaCommission: 2000,
          cleaningFee: 1000,
          netPayout: 82000,
        }),
      ],
    );
    expect(isPdf(buf)).toBe(true);
  });

  it("renders a long ledger that spills onto a second page", async () => {
    // Pagination is where fixed heights and absolute positioning go
    // wrong, and no shorter fixture exercises it.
    const many = Array.from({ length: 60 }, (_, i) =>
      tx({
        id: `t${i}`,
        occurredOn: new Date(Date.UTC(2026, 8, (i % 28) + 1)),
        description: `Line item number ${i} with a reasonably long description`,
      }),
    );
    expect(isPdf(await render(many))).toBe(true);
  });

  it("renders a client with a company name and an awkward amount", async () => {
    const buf = await renderToBuffer(
      StatementDocument({
        period: september,
        client: { ...client, companyName: "Aguer Holdings Ltd" },
        statement: buildStatement([tx({ amount: "1234567.891" })]),
        shortTerm: [],
        generatedAt: new Date(Date.UTC(2026, 9, 5)),
      }),
    );
    expect(isPdf(buf)).toBe(true);
  });
});
