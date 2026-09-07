// Monthly statement push.
//
// Called from /api/cron/send-statements on the 5th of every month
// (Vercel cron). For each client with at least one ACTIVE property:
//
//   1. Skip if a StatementSend row already exists for the period.
//      Idempotency is the entire point of this layer — the cron
//      can fire twice (Vercel retry, manual run) and never double-
//      send.
//   2. Render the same PDF the client can download from
//      /client/statements/<year>/<month>.
//   3. Send via Resend with the PDF attached.
//   4. Record a CommunicationLog row + write the StatementSend row
//      with status, providerId, and a one-line summary.
//
// Failures are recorded (status=FAILED, error captured) but never
// thrown to the caller — one bad client shouldn't kill the run.
//
// This is also the only client email that copies anybody other than
// the account holder. Co-ownership is common — two sisters running
// one unit, a couple where only one signed — and until observers
// existed only the one who held the account ever saw the numbers.
// The statement can carry them precisely because it has no minted
// sign-in link in it: a PDF attachment and a portal URL that bounces
// a stranger to /login. The three emails that do carry a link must
// never resolve recipients through lib/clients/recipients.ts, and
// src/lib/clients/observers.test.ts fails the build if one starts to.

import { renderToBuffer } from "@react-pdf/renderer";
import type { Client } from "@prisma/client";
import { prisma } from "@/lib/db";
import { logCommunication, updateCommunicationStatus } from "@/lib/comms";
import { recordObserverSend } from "@/lib/clients/observers";
import { resolveStatementRecipients } from "@/lib/clients/recipients";
import { StatementDocument } from "./StatementDocument";
import { renderEmailBody, renderEmailHtml } from "./email";
import { buildStatement } from "./aggregate";
import { buildShortTermSummary } from "./short-term";
import {
  formatPeriod,
  periodRange,
  periodSlug,
  type Period,
} from "./period";

const DEFAULT_FROM = "Goldstay Statements <statements@goldstay.co.ke>";
const DEFAULT_SITE = "https://goldstay.co.ke";

export type SendStatementResult =
  | { ok: true; status: "sent" | "skipped"; sendId: string | null }
  | { ok: false; status: "failed"; sendId: string | null; error: string };

export async function sendStatementForClient(
  client: Pick<
    Client,
    "id" | "email" | "fullName" | "companyName" | "preferredCurrency"
  >,
  period: Period,
): Promise<SendStatementResult> {
  // Idempotency check first; cheap and avoids any work if already
  // delivered for this period.
  const existing = await prisma.statementSend.findUnique({
    where: {
      clientId_periodYear_periodMonth: {
        clientId: client.id,
        periodYear: period.year,
        periodMonth: period.month,
      },
    },
  });
  if (existing && (existing.status === "SENT" || existing.status === "DELIVERED")) {
    return { ok: true, status: "skipped", sendId: existing.id };
  }

  const { start, end } = periodRange(period);

  const [transactions, shortTermBookings] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        occurredOn: { gte: start, lt: end },
        property: { clientId: client.id },
      },
      include: {
        property: { select: { id: true, name: true } },
        lease: { select: { id: true, tenantName: true } },
      },
      orderBy: { occurredOn: "asc" },
    }),
    prisma.booking.findMany({
      where: {
        property: { clientId: client.id, propertyType: "SHORT_TERM" },
        checkIn: { lt: end },
        checkOut: { gt: start },
      },
      include: {
        property: { select: { id: true, name: true } },
      },
    }),
  ]);

  // Goldstay's brand promise on the marketing site is "monthly
  // statements" — we still send the cover for an empty month so
  // landlords see a heartbeat, but with a different note in the
  // email body. This also avoids the "did the cron run?" panic.
  const isEmpty = transactions.length === 0 && shortTermBookings.length === 0;

  const statement = buildStatement(
    transactions.map((t) => ({
      id: t.id,
      occurredOn: t.occurredOn,
      type: t.type,
      direction: t.direction,
      amount: t.amount.toString(),
      currency: t.currency,
      description: t.description,
      reference: t.reference,
      propertyId: t.propertyId,
      propertyName: t.property.name,
      leaseId: t.leaseId,
      tenantName: t.lease?.tenantName ?? null,
    })),
    { preferredCurrency: client.preferredCurrency },
  );

  const shortTerm = buildShortTermSummary(
    shortTermBookings.map((b) => ({
      propertyId: b.propertyId,
      propertyName: b.property.name,
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      nights: b.nights,
      grossAmount: Number(b.grossAmount),
      otaCommission: b.otaCommission ? Number(b.otaCommission) : null,
      cleaningFee: b.cleaningFee ? Number(b.cleaningFee) : null,
      netPayout: Number(b.netPayout),
      currency: b.currency,
      status: b.status,
    })),
    transactions
      .filter((t) => t.type === "GOLDSTAY_COMMISSION")
      .map((t) => ({
        propertyId: t.propertyId,
        type: t.type,
        amount: Number(t.amount),
        currency: t.currency,
      })),
    { start, end },
  );

  const summary = summariseStatementForLog(statement, isEmpty);

  // Reserve / refresh the StatementSend row in QUEUED. Doing this
  // before the send means a crashed worker leaves enough breadcrumb
  // for the system-health page to show a stuck QUEUED row instead
  // of silently no-show.
  const send = await prisma.statementSend.upsert({
    where: {
      clientId_periodYear_periodMonth: {
        clientId: client.id,
        periodYear: period.year,
        periodMonth: period.month,
      },
    },
    update: {
      status: "QUEUED",
      summary,
      error: null,
    },
    create: {
      clientId: client.id,
      periodYear: period.year,
      periodMonth: period.month,
      status: "QUEUED",
      summary,
    },
  });

  // Resolved before the PDF render so a slow observer lookup is not
  // holding a rendered buffer in memory, and so the body and the
  // headers are built from one answer rather than two lookups that
  // could disagree about who is on this send.
  const recipients = await resolveStatementRecipients({
    id: client.id,
    email: client.email,
  });

  try {
    const pdfBuffer = await renderToBuffer(
      StatementDocument({
        period,
        client: {
          fullName: client.fullName,
          companyName: client.companyName,
          email: client.email,
          preferredCurrency: client.preferredCurrency,
        },
        statement,
        shortTerm,
        generatedAt: new Date(),
      }),
    );

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_STATEMENTS || DEFAULT_FROM;
    const siteUrl = process.env.PUBLIC_SITE_URL || DEFAULT_SITE;
    const subject = `Goldstay statement — ${formatPeriod(period)}`;
    const filename = `goldstay-statement-${periodSlug(period)}.pdf`;

    // Log the comms row first (status QUEUED) so an outage between
    // Resend ack and DB write doesn't leave the timeline missing.
    const log = await logCommunication({
      clientId: client.id,
      channel: "EMAIL",
      direction: "OUTBOUND",
      subject,
      body: renderEmailBody({
        client,
        period,
        siteUrl,
        isEmpty,
        summary,
        observers: recipients.observers,
      }),
      status: "QUEUED",
      // Sent by the system, not a person — actor is null so no
      // audit row is written; the StatementSend table is the audit.
      actor: null,
    });

    if (!apiKey) {
      // Dev / preview without Resend. Mark as sent so a developer
      // can iterate against `pnpm cron:send-statements` without
      // bouncing on a missing secret. Production CI must set the
      // key; the system-health page will surface this state too.
      console.log(
        `[statements] would send to ${recipients.to.join(", ")}${
          recipients.cc.length ? ` (cc ${recipients.cc.join(", ")})` : ""
        } for ${formatPeriod(period)}\n${summary}`,
      );
      await updateCommunicationStatus(log.id, "SENT");
      const updated = await prisma.statementSend.update({
        where: { id: send.id },
        data: {
          status: "SENT",
          providerId: null,
          sentAt: new Date(),
          summary,
        },
      });
      return { ok: true, status: "sent", sendId: updated.id };
    }

    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to: recipients.to,
      // CC rather than BCC deliberately. The case this serves is
      // co-ownership, where the transparency is the feature: both
      // sisters can see the statement went to both of them, and the
      // account holder can see who is reading their income without
      // going to look. A hidden copy of somebody's financial
      // statement would be the wrong default even though it leaks
      // less. Omitted entirely when empty rather than sent as [],
      // which some providers treat as a malformed header.
      ...(recipients.cc.length > 0 ? { cc: recipients.cc } : {}),
      subject,
      text: renderEmailBody({
        client,
        period,
        siteUrl,
        isEmpty,
        summary,
        observers: recipients.observers,
      }),
      html: renderEmailHtml({
        client,
        period,
        siteUrl,
        isEmpty,
        summary,
        observers: recipients.observers,
      }),
      attachments: [
        {
          filename,
          content: Buffer.from(pdfBuffer),
        },
      ],
    });

    const providerId = result?.data?.id ?? null;
    await updateCommunicationStatus(log.id, "SENT", providerId);
    // After the send, and swallowing its own errors, so a co-owner
    // who says "I never get these" can be answered from the admin
    // screen without a counter update ever being able to make a
    // delivered statement look failed.
    await recordObserverSend(recipients.observers.map((o) => o.id));
    const updated = await prisma.statementSend.update({
      where: { id: send.id },
      data: {
        status: "SENT",
        providerId,
        sentAt: new Date(),
        summary,
      },
    });
    return { ok: true, status: "sent", sendId: updated.id };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Statement send failed";
    await prisma.statementSend.update({
      where: { id: send.id },
      data: {
        status: "FAILED",
        error: message.slice(0, 2000),
      },
    });
    return {
      ok: false,
      status: "failed",
      sendId: send.id,
      error: message,
    };
  }
}

// ---------- Pure helpers ----------

function summariseStatementForLog(
  statement: ReturnType<typeof buildStatement>,
  isEmpty: boolean,
): string {
  if (isEmpty) return "Empty period (no transactions or bookings)";
  const totals = statement.totalsByCurrency
    .slice(0, 2)
    .map(
      (t) =>
        `${t.currency} ${formatNumber(t.net)} net`,
    )
    .join(" · ");
  return `${statement.transactionCount} transactions${totals ? ` · ${totals}` : ""}`;
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-GB", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
