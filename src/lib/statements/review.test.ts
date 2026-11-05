import { describe, expect, it } from "vitest";

import {
  renderStatementReviewEmail,
  type StatementReview,
  type StatementReviewRow,
} from "@/lib/statements/review";

const period = { year: 2026, month: 10 };

function row(over: Partial<StatementReviewRow> = {}): StatementReviewRow {
  return {
    clientId: "c1",
    clientName: "Yar Aguer Gabriel",
    clientEmail: "yar@example.com",
    recipientCount: 1,
    transactionCount: 12,
    totals: [{ currency: "USD", net: 1_969 }],
    isEmpty: false,
    alreadySent: false,
    sentAt: null,
    ...over,
  };
}

function review(rows: StatementReviewRow[]): StatementReview {
  return {
    period,
    rows,
    awaitingReview: rows.filter((r) => !r.alreadySent && !r.isEmpty).length,
    alreadySent: rows.filter((r) => r.alreadySent).length,
    empty: rows.filter((r) => r.isEmpty && !r.alreadySent).length,
  };
}

const adminLink = "https://goldstay.co.ke/admin/statements?month=2026-10";

describe("the month-end digest", () => {
  it("says plainly that nothing has gone to a client", () => {
    // The whole reason this email exists. If an operator skims it and
    // assumes the statements already went, the review step has bought
    // nothing.
    const { text } = renderStatementReviewEmail({
      review: review([row(), row({ clientId: "c2", clientName: "Damary" })]),
      adminLink,
    });

    expect(text).toContain("Nothing has been sent to any client");
    expect(text).toContain(adminLink);
    expect(text).toContain("Statements are no longer emailed automatically");
  });

  it("counts what is waiting in the subject", () => {
    const { subject } = renderStatementReviewEmail({
      review: review([row(), row({ clientId: "c2" })]),
      adminLink,
    });
    expect(subject).toBe("2 statements ready to review · October 2026");
  });

  it("stays singular for one statement", () => {
    const { subject, text } = renderStatementReviewEmail({
      review: review([row()]),
      adminLink,
    });
    expect(subject).toBe("1 statement ready to review · October 2026");
    expect(text).toContain("1 statement is ready");
  });

  it("puts the figures next to the name so the digest is checkable", () => {
    const { text } = renderStatementReviewEmail({
      review: review([row()]),
      adminLink,
    });
    expect(text).toContain(
      "Yar Aguer Gabriel — USD 1,969 net (12 transactions)",
    );
  });

  it("flags co-owners, because a statement to two people is worth knowing about", () => {
    const { text } = renderStatementReviewEmail({
      review: review([row({ recipientCount: 3 })]),
      adminLink,
    });
    expect(text).toContain("3 recipients");
  });
});

describe("empty months", () => {
  it("separates them out and says why they are worth a look", () => {
    // An empty month and a channel that stopped reporting revenue
    // produce the same statement. That is the case this whole review
    // step exists to catch.
    const { text } = renderStatementReviewEmail({
      review: review([
        row(),
        row({
          clientId: "c2",
          clientName: "Quiet Landlord",
          isEmpty: true,
          totals: [],
          transactionCount: 0,
        }),
      ]),
      adminLink,
    });

    expect(text).toContain("Empty, worth checking (1)");
    expect(text).toContain("Quiet Landlord");
    // Not counted as ready, so "send all" does not sweep it up.
    expect(text).toContain("1 statement is ready");
  });

  it("does not count an empty month as awaiting review", () => {
    const r = review([row({ isEmpty: true, totals: [], transactionCount: 0 })]);
    expect(r.awaitingReview).toBe(0);
    expect(r.empty).toBe(1);
  });
});

describe("statements already sent", () => {
  it("lists them apart so a re-run does not look like a backlog", () => {
    const { subject, text } = renderStatementReviewEmail({
      review: review([
        row({ alreadySent: true, sentAt: new Date("2026-11-05T07:00:00Z") }),
        row({ clientId: "c2", clientName: "Asha Kimani" }),
      ]),
      adminLink,
    });

    expect(subject).toBe("1 statement ready to review · October 2026");
    expect(text).toContain("Already sent for October 2026 (1)");
    expect(text).toContain("Asha Kimani");
  });
});
