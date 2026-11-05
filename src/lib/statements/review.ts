// The month-end review step that sits where the automatic send used
// to be.
//
// Statements used to go straight to landlords on the 5th. The figures
// in them are only as good as what reached the platform that month,
// and when a channel stops delivering booking revenue the statement
// does not look broken, it looks like a quiet month: real stays, no
// money against them. By the time anyone noticed, the owner had
// already read it.
//
// So the cron no longer emails clients. It assembles every statement,
// emails the team one digest of what it found, and stops. Sending is
// a person pressing a button on /admin/statements once the numbers
// have been looked at.
//
// Nothing here writes a StatementSend row. That table means "this
// client has been sent their statement", and a review is not a send.
//
// Env vars (all optional, degrades gracefully):
//   RESEND_API_KEY    → real send; absent means log-only
//   RESEND_FROM_OPS   → from address
//   STATEMENTS_INBOX  → where the digest lands, falling back to
//                       CONTACT_INBOX
//   PUBLIC_SITE_URL   → base for the admin link

import type { PrismaClient } from "@prisma/client";

import { formatClientDisplayName } from "@/lib/format-client";
import { resolveStatementRecipients } from "@/lib/clients/recipients";
import { assembleStatement } from "./assemble";
import { formatPeriod, periodSlug, type Period } from "./period";

const DEFAULT_FROM = "Goldstay <hello@goldstay.co.ke>";
const DEFAULT_INBOX = "hello@goldstay.co.ke";
const DEFAULT_SITE = "https://goldstay.co.ke";

export type StatementReviewRow = {
  clientId: string;
  clientName: string;
  clientEmail: string;
  /** Account holder plus any observers who would be copied. */
  recipientCount: number;
  transactionCount: number;
  totals: Array<{ currency: string; net: number }>;
  isEmpty: boolean;
  /** True once this period has actually gone to the client. */
  alreadySent: boolean;
  sentAt: Date | null;
};

export type StatementReview = {
  period: Period;
  rows: StatementReviewRow[];
  /** Not yet sent and not empty: the ones needing a decision. */
  awaitingReview: number;
  alreadySent: number;
  empty: number;
};

// Who gets a statement at all. Shared with the admin screen so the
// list an operator reviews is exactly the list the digest counted,
// rather than two queries that can drift apart.
export async function eligibleStatementClients(prisma: PrismaClient) {
  return prisma.client.findMany({
    where: {
      archivedAt: null,
      // A client with no live property gets nothing. Just-converted
      // leads and paused accounts would otherwise receive an empty
      // statement every month for a portfolio they do not have.
      properties: { some: { archivedAt: null } },
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      companyName: true,
      preferredCurrency: true,
    },
    orderBy: { fullName: "asc" },
  });
}

export async function buildStatementReview({
  prisma,
  period,
}: {
  prisma: PrismaClient;
  period: Period;
}): Promise<StatementReview> {
  const clients = await eligibleStatementClients(prisma);

  const sends = await prisma.statementSend.findMany({
    where: {
      periodYear: period.year,
      periodMonth: period.month,
      status: { in: ["SENT", "DELIVERED"] },
    },
    select: { clientId: true, sentAt: true },
  });
  const sentByClient = new Map(sends.map((s) => [s.clientId, s.sentAt]));

  const rows: StatementReviewRow[] = [];
  for (const client of clients) {
    const { statement, isEmpty } = await assembleStatement({
      prisma,
      client,
      period,
    });
    const recipients = await resolveStatementRecipients({
      id: client.id,
      email: client.email,
    });

    rows.push({
      clientId: client.id,
      clientName: formatClientDisplayName(client),
      clientEmail: client.email,
      recipientCount: recipients.to.length + recipients.cc.length,
      transactionCount: statement.transactionCount,
      totals: statement.totalsByCurrency.map((t) => ({
        currency: t.currency,
        net: t.net,
      })),
      isEmpty,
      alreadySent: sentByClient.has(client.id),
      sentAt: sentByClient.get(client.id) ?? null,
    });
  }

  return {
    period,
    rows,
    awaitingReview: rows.filter((r) => !r.alreadySent && !r.isEmpty).length,
    alreadySent: rows.filter((r) => r.alreadySent).length,
    empty: rows.filter((r) => r.isEmpty && !r.alreadySent).length,
  };
}

export async function sendStatementReviewEmail(
  review: StatementReview,
): Promise<{ ok: boolean; delivered: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_OPS || DEFAULT_FROM;
  const inbox =
    process.env.STATEMENTS_INBOX || process.env.CONTACT_INBOX || DEFAULT_INBOX;
  const siteUrl = process.env.PUBLIC_SITE_URL || DEFAULT_SITE;

  const { subject, text } = renderStatementReviewEmail({
    review,
    adminLink: `${siteUrl}/admin/statements?month=${periodSlug(review.period)}`,
  });

  if (!apiKey) {
    console.log(`[statement-review] would notify ${inbox}\n${text}`);
    return { ok: true, delivered: false, reason: "logged-only" };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    await resend.emails.send({ from, to: [inbox], subject, text });
    return { ok: true, delivered: true };
  } catch (err) {
    console.error("[statement-review] send failed", err);
    return { ok: false, delivered: false, reason: "send-failed" };
  }
}

// Pure, so the body can be asserted on without Resend or a database.
// Text-only: it goes to our own inbox, and every client name in it is
// operator free text that would otherwise need escaping.
export function renderStatementReviewEmail({
  review,
  adminLink,
}: {
  review: StatementReview;
  adminLink: string;
}): { subject: string; text: string } {
  const month = formatPeriod(review.period);
  const lines: string[] = [];

  lines.push(
    `${review.awaitingReview} ${
      review.awaitingReview === 1 ? "statement is" : "statements are"
    } ready for ${month}. Nothing has been sent to any client.`,
    "",
    "Check the figures, then send from:",
    adminLink,
    "",
  );

  const pending = review.rows.filter((r) => !r.alreadySent && !r.isEmpty);
  if (pending.length > 0) {
    lines.push("Ready to send");
    for (const row of pending) {
      lines.push(`  ${row.clientName} — ${describeRow(row)}`);
    }
    lines.push("");
  }

  // Called out rather than hidden, because an empty month is the
  // shape a broken integration makes: the stays happened, the money
  // never arrived, and the statement reads as a quiet month. Worth a
  // look before it goes anywhere.
  const empty = review.rows.filter((r) => r.isEmpty && !r.alreadySent);
  if (empty.length > 0) {
    lines.push(
      `Empty, worth checking (${empty.length})`,
      "  No transactions or bookings landed for these in the period.",
    );
    for (const row of empty) lines.push(`  ${row.clientName}`);
    lines.push("");
  }

  const sent = review.rows.filter((r) => r.alreadySent);
  if (sent.length > 0) {
    lines.push(`Already sent for ${month} (${sent.length})`);
    for (const row of sent) lines.push(`  ${row.clientName}`);
    lines.push("");
  }

  lines.push(
    "Statements are no longer emailed automatically. They go out when",
    "somebody presses send.",
  );

  return {
    subject: `${review.awaitingReview} statement${
      review.awaitingReview === 1 ? "" : "s"
    } ready to review · ${month}`,
    text: lines.join("\n"),
  };
}

function describeRow(row: StatementReviewRow): string {
  const totals = row.totals
    .map((t) => `${t.currency} ${formatAmount(t.net)}`)
    .join(", ");
  const count = `${row.transactionCount} ${
    row.transactionCount === 1 ? "transaction" : "transactions"
  }`;
  const copies =
    row.recipientCount > 1 ? `, ${row.recipientCount} recipients` : "";
  return totals ? `${totals} net (${count}${copies})` : `${count}${copies}`;
}

function formatAmount(n: number): string {
  return n.toLocaleString("en-GB", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
