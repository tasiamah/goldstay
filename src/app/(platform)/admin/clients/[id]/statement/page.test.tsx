import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// Server-rendering a whole admin page in a test. This is the class of
// failure nothing else here catches: `tsc`, `next lint` and
// `next build` all pass on a page that throws the instant a browser
// asks for it, because none of them execute the component. That is
// how `useActionState` — a React 19 hook, on a React 18 runtime —
// reached production in three client components and 500'd every
// short-term property page.
//
// Mocked at the module boundary rather than the database, so the test
// exercises the page's own logic: its date handling, its null guards,
// and every branch of its JSX.

vi.mock("@/lib/auth", () => ({
  requireAdmin: async () => ({ id: "admin1", email: "ops@goldstay.co.ke" }),
}));

const client = {
  id: "client1",
  email: "yar@example.com",
  fullName: "Yar Aguer Gabriel",
  companyName: null,
  preferredCurrency: "USD",
};

const transactions = [
  {
    id: "t1",
    occurredOn: new Date(Date.UTC(2026, 8, 13)),
    type: "RENT",
    direction: "INFLOW",
    amount: { toString: () => "240" },
    currency: "USD",
    description: "Gross from Guest",
    reference: null,
    propertyId: "polaris",
    property: { id: "polaris", name: "Polaris Residency" },
    leaseId: null,
    lease: null,
  },
  {
    id: "t2",
    occurredOn: new Date(Date.UTC(2026, 8, 16)),
    type: "UTILITIES",
    direction: "OUTFLOW",
    amount: { toString: () => "15.41" },
    currency: "USD",
    description: "Electricity top-up — KES 2,000 at 129.748 (XE)",
    reference: null,
    propertyId: "polaris",
    property: { id: "polaris", name: "Polaris Residency" },
    leaseId: null,
    lease: null,
  },
  {
    id: "t3",
    occurredOn: new Date(Date.UTC(2026, 8, 28)),
    type: "REPAIR",
    direction: "OUTFLOW",
    amount: { toString: () => "6000" },
    currency: "KES",
    description: "Electricity token machine repair",
    reference: null,
    propertyId: "polaris",
    property: { id: "polaris", name: "Polaris Residency" },
    leaseId: null,
    lease: null,
  },
];

const bookings = [
  {
    propertyId: "polaris",
    property: { id: "polaris", name: "Polaris Residency" },
    checkIn: new Date(Date.UTC(2026, 8, 13)),
    checkOut: new Date(Date.UTC(2026, 8, 19)),
    nights: 6,
    grossAmount: { toString: () => "240" },
    otaCommission: { toString: () => "57.01" },
    cleaningFee: { toString: () => "7.7" },
    netPayout: { toString: () => "175.29" },
    currency: "USD",
    status: "CONFIRMED",
  },
];

const state = {
  client: client as typeof client | null,
  transactions,
  bookings,
  lastSend: null as unknown,
};

vi.mock("@/lib/db", () => ({
  prisma: {
    client: { findUnique: async () => state.client },
    transaction: { findMany: async () => state.transactions },
    booking: { findMany: async () => state.bookings },
    statementSend: { findFirst: async () => state.lastSend },
  },
}));

const { default: AdminStatementPreviewPage } = await import("./page");

async function render(searchParams: { month?: string } = {}) {
  const el = await AdminStatementPreviewPage({
    params: { id: "client1" },
    searchParams,
  });
  return renderToStaticMarkup(el);
}

describe("admin statement preview page", () => {
  it("renders a month with activity", async () => {
    const html = await render({ month: "2026-09" });
    expect(html).toContain("Polaris Residency");
    expect(html).toContain("September 2026");
  });

  it("renders with no month given, falling back to a default period", async () => {
    // The default is derived from today's date, so this branch only
    // runs in the one case nobody clicks deliberately.
    expect(await render()).toContain("Polaris Residency");
  });

  it("renders a malformed month rather than throwing", async () => {
    // Query strings are user input. "?month=banana" reaching a Date
    // constructor is how a page 500s on a typo.
    for (const month of ["banana", "2026-13", "2026-00", "", "2026", "-1"]) {
      expect(typeof (await render({ month }))).toBe("string");
    }
  });

  it("renders a month with nothing recorded", async () => {
    const saved = [state.transactions, state.bookings] as const;
    state.transactions = [];
    state.bookings = [];
    try {
      expect(typeof (await render({ month: "2026-07" }))).toBe("string");
    } finally {
      [state.transactions, state.bookings] = [saved[0], saved[1]];
    }
  });
});
