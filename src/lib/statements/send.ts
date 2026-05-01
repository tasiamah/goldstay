// Monthly statement push.
//
// Called from /api/cron/send-statements on the 5th of every month
// (Vercel cron). For each owner with at least one ACTIVE property:
//
//   1. Skip if a StatementSend row already exists for the period.
//      Idempotency is the entire point of this layer — the cron
//      can fire twice (Vercel retry, manual run) and never double-
//      send.
//   2. Render the same PDF the owner can download from
//      /owner/statements/<year>/<month>.
//   3. Send via Resend with the PDF attached.
//   4. Record a CommunicationLog row + write the StatementSend row
//      with status, providerId, and a one-line summary.
//
// Failures are recorded (status=FAILED, error captured) but never
// thrown to the caller — one bad owner shouldn't kill the run.

import { renderToBuffer } from "@react-pdf/renderer";
import type { Owner } from "@prisma/client";
import { prisma } from "@/lib/db";
import { logCommunication, updateCommunicationStatus } from "@/lib/comms";
import { StatementDocument } from "./StatementDocument";
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

export async function sendStatementForOwner(
  owner: Pick<
    Owner,
    "id" | "email" | "fullName" | "companyName" | "preferredCurrency"
  >,
  period: Period,
): Promise<SendStatementResult> {
  // Idempotency check first; cheap and avoids any work if already
  // delivered for this period.
  const existing = await prisma.statementSend.findUnique({
    where: {
      ownerId_periodYear_periodMonth: {
        ownerId: owner.id,
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
        property: { ownerId: owner.id },
      },
      include: {
        property: { select: { id: true, name: true } },
        lease: { select: { id: true, tenantName: true } },
      },
      orderBy: { occurredOn: "asc" },
    }),
    prisma.booking.findMany({
      where: {
        property: { ownerId: owner.id, propertyType: "SHORT_TERM" },
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
    { preferredCurrency: owner.preferredCurrency },
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
      ownerId_periodYear_periodMonth: {
        ownerId: owner.id,
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
      ownerId: owner.id,
      periodYear: period.year,
      periodMonth: period.month,
      status: "QUEUED",
      summary,
    },
  });

  try {
    const pdfBuffer = await renderToBuffer(
      StatementDocument({
        period,
        owner: {
          fullName: owner.fullName,
          companyName: owner.companyName,
          email: owner.email,
          preferredCurrency: owner.preferredCurrency,
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
      ownerId: owner.id,
      channel: "EMAIL",
      direction: "OUTBOUND",
      subject,
      body: renderEmailBody({
        owner,
        period,
        siteUrl,
        isEmpty,
        summary,
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
        `[statements] would send to ${owner.email} for ${formatPeriod(period)}\n${summary}`,
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
      to: [owner.email],
      subject,
      text: renderEmailBody({ owner, period, siteUrl, isEmpty, summary }),
      html: renderEmailHtml({ owner, period, siteUrl, isEmpty, summary }),
      attachments: [
        {
          filename,
          content: Buffer.from(pdfBuffer),
        },
      ],
    });

    const providerId = result?.data?.id ?? null;
    await updateCommunicationStatus(log.id, "SENT", providerId);
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

function renderEmailBody(opts: {
  owner: Pick<Owner, "fullName" | "companyName">;
  period: Period;
  siteUrl: string;
  isEmpty: boolean;
  summary: string;
}): string {
  const greeting = `Hi ${opts.owner.fullName.split(/\s+/)[0] || "there"},`;
  const lead = opts.isEmpty
    ? `Your Goldstay statement for ${formatPeriod(opts.period)} is attached. There was no rent or booking activity to report this month — the cover page confirms a clean ledger.`
    : `Your Goldstay statement for ${formatPeriod(opts.period)} is attached. ${opts.summary}.`;
  return [
    greeting,
    "",
    lead,
    "",
    `You can also browse the same statement, line-by-line, in your portal:`,
    `${opts.siteUrl}/owner/statements/${opts.period.year}/${opts.period.month}`,
    "",
    "Net payouts are remitted by the 10th of every month per your management agreement. If anything in this statement looks off, reply to this email and we'll investigate same-day.",
    "",
    "— The Goldstay team",
  ].join("\n");
}

function renderEmailHtml(opts: {
  owner: Pick<Owner, "fullName" | "companyName">;
  period: Period;
  siteUrl: string;
  isEmpty: boolean;
  summary: string;
}): string {
  const firstName = opts.owner.fullName.split(/\s+/)[0] || "there";
  const lead = opts.isEmpty
    ? `Your Goldstay statement for <strong>${formatPeriod(opts.period)}</strong> is attached. There was no rent or booking activity to report this month — the cover page confirms a clean ledger.`
    : `Your Goldstay statement for <strong>${formatPeriod(opts.period)}</strong> is attached. ${escapeHtml(opts.summary)}.`;
  const url = `${opts.siteUrl}/owner/statements/${opts.period.year}/${opts.period.month}`;
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#fafaf9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1c1917">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fafaf9;padding:40px 16px">
      <tr><td align="center">
        <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e7e5e4;border-radius:12px;padding:40px">
          <tr><td>
            <p style="font-size:18px;font-family:Georgia,serif;color:#1c1917;margin:0 0 4px 0">Goldstay<span style="color:#b91c1c">.</span></p>
            <h1 style="font-size:22px;font-family:Georgia,serif;color:#1c1917;margin:24px 0 0 0;font-weight:normal">Hi ${escapeHtml(firstName)},</h1>
            <p style="color:#44403c;line-height:1.55;margin:16px 0 0 0">${lead}</p>
            <p style="margin:32px 0;text-align:center"><a href="${escapeAttr(url)}" style="background:#1c1917;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:600;font-size:14px;display:inline-block">Open statement in portal →</a></p>
            <p style="color:#78716c;font-size:13px;line-height:1.55;margin:32px 0 0 0;border-top:1px solid #e7e5e4;padding-top:24px">Net payouts are remitted by the 10th of every month per your management agreement. If anything in this statement looks off, reply and we'll investigate same-day.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
}
