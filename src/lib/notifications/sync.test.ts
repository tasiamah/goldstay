import { describe, expect, it } from "vitest";
import { Prisma } from "@prisma/client";
import { buildDesiredNotifications, EVENT_KINDS } from "./sync";
import type { SetupChecklist } from "@/lib/client/setup-status";

// buildDesiredNotifications is the pure heart of the bell — given a
// snapshot of state, what notifications *should* exist? The DB diff
// happens elsewhere. The risks worth covering:
//
//   * a missing setup step → exactly one SETUP_INCOMPLETE per missing
//     step, sourceRef = step key
//   * a pending management agreement → AGREEMENT_PENDING with the
//     agreement id as sourceRef
//   * a "stale" payout outside the freshness window → no PAYOUT_PAID
//   * an empty state → empty array, never undefined / null

const completeSetup: SetupChecklist = {
  steps: [
    { key: "details", label: "Your details", description: "", done: true },
    { key: "legal", label: "Legal documents", description: "", done: true },
    { key: "bank", label: "Bank account", description: "", done: true },
  ],
  doneCount: 3,
  totalCount: 3,
  firstIncomplete: null,
};

const incompleteSetup: SetupChecklist = {
  steps: [
    { key: "details", label: "Your details", description: "Need name", done: false },
    { key: "legal", label: "Legal documents", description: "Need ID", done: true },
    { key: "bank", label: "Bank account", description: "Need bank", done: false },
  ],
  doneCount: 1,
  totalCount: 3,
  firstIncomplete: "details",
};

describe("buildDesiredNotifications", () => {
  it("returns nothing when everything is in order", () => {
    expect(
      buildDesiredNotifications({
        setup: completeSetup,
        pendingAgreements: [],
        latestStatement: null,
        latestPayout: null,
      }),
    ).toEqual([]);
  });

  it("emits one SETUP_INCOMPLETE per missing step, with the step key as sourceRef", () => {
    const out = buildDesiredNotifications({
      setup: incompleteSetup,
      pendingAgreements: [],
      latestStatement: null,
      latestPayout: null,
    });
    const setupRows = out.filter((n) => n.kind === "SETUP_INCOMPLETE");
    expect(setupRows.map((n) => n.sourceRef).sort()).toEqual(["bank", "details"]);
    expect(setupRows.every((n) => n.tone === "WARNING")).toBe(true);
    expect(setupRows.every((n) => n.href?.startsWith("/client/"))).toBe(true);
  });

  it("emits AGREEMENT_PENDING with the agreementId as sourceRef", () => {
    const out = buildDesiredNotifications({
      setup: completeSetup,
      pendingAgreements: [
        {
          id: "agr_1",
          property: { id: "p1", name: "Pinetree", unitNumber: "A4" },
        },
      ],
      latestStatement: null,
      latestPayout: null,
    });
    const a = out.find((n) => n.kind === "AGREEMENT_PENDING");
    expect(a?.sourceRef).toBe("agr_1");
    expect(a?.tone).toBe("WARNING");
    expect(a?.href).toBe("/client/agreements/agr_1");
    expect(a?.body).toContain("Pinetree A4");
  });

  it("ignores stale payouts outside the freshness window", () => {
    const stale = {
      id: "tx_old",
      amount: 100_000 as unknown as never, // Prisma Decimal in real life, number-coerced in build
      currency: "KES",
      occurredOn: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    };
    const out = buildDesiredNotifications({
      setup: completeSetup,
      pendingAgreements: [],
      latestStatement: null,
      latestPayout: stale,
      payoutWindowDays: 14,
    });
    expect(out.find((n) => n.kind === "PAYOUT_PAID")).toBeUndefined();
  });

  it("emits PAYOUT_PAID for a fresh payout, with txn id as sourceRef", () => {
    const fresh = {
      id: "tx_fresh",
      amount: 215_000 as unknown as never,
      currency: "KES",
      occurredOn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    };
    const out = buildDesiredNotifications({
      setup: completeSetup,
      pendingAgreements: [],
      latestStatement: null,
      latestPayout: fresh,
    });
    const p = out.find((n) => n.kind === "PAYOUT_PAID");
    expect(p?.sourceRef).toBe("tx_fresh");
    expect(p?.tone).toBe("SUCCESS");
    expect(p?.title).toContain("KES");
    expect(p?.title).toContain("215,000");
  });

  it("emits STATEMENT_AVAILABLE with a YYYY-MM sourceRef", () => {
    const out = buildDesiredNotifications({
      setup: completeSetup,
      pendingAgreements: [],
      latestStatement: {
        periodYear: 2026,
        periodMonth: 4,
        sentAt: new Date("2026-05-05"),
      },
      latestPayout: null,
    });
    const s = out.find((n) => n.kind === "STATEMENT_AVAILABLE");
    expect(s?.sourceRef).toBe("period:2026-04");
    expect(s?.tone).toBe("INFO");
    expect(s?.title).toContain("April 2026");
  });
});

// The sync resolves any unresolved row it does not currently desire.
// An event kind is never desired, because nothing derives it from
// state, so leaving one out of EVENT_KINDS means it is written and
// then resolved by the next dashboard render. The client sees
// nothing and there is no error anywhere to explain why.
describe("EVENT_KINDS", () => {
  it("exempts every kind that is recorded as an event rather than derived", () => {
    const derived = new Set(
      buildDesiredNotifications({
        setup: incompleteSetup,
        pendingAgreements: [
          {
            id: "agr-1",
            property: { id: "p1", name: "Riverside", unitNumber: "A2" },
          },
        ],
        latestStatement: {
          periodYear: 2026,
          periodMonth: 8,
          sentAt: new Date("2026-09-05T07:00:00.000Z"),
        },
        latestPayout: {
          id: "txn-1",
          amount: new Prisma.Decimal(48000),
          currency: "KES",
          occurredOn: new Date("2026-09-05T00:00:00.000Z"),
        },
      }).map((n) => n.kind),
    );
    for (const kind of EVENT_KINDS) {
      expect(derived.has(kind), `${kind} is derived, not an event`).toBe(false);
    }
  });

  it("covers the booking kinds, which no code path derives", () => {
    expect(EVENT_KINDS).toContain("BOOKING_RECEIVED");
    expect(EVENT_KINDS).toContain("BOOKING_CANCELLED");
  });
});
