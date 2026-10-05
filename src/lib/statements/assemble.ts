// The one place that turns (client, period) into the numbers a
// statement shows.
//
// Four callers need exactly the same answer: the emailed PDF
// (statements/send.ts), the client's own download
// (/client/statements/[year]/[month]), the operator's HTML preview
// and the operator's PDF (/admin/clients/[id]/statement). Before this
// existed each one wrote its own pair of queries, and they had drifted
// in two ways that mattered:
//
//   - The preview filtered archived transactions and the two PDF
//     paths did not, so a transaction an operator had deleted stayed
//     on the statement the client received while disappearing from
//     the screen the operator checked it on.
//   - The preview never loaded bookings at all, so the short-stay
//     section of the PDF had no counterpart on screen. On a
//     short-let client that is most of the statement.
//
// A preview whose only job is to let someone verify a statement is
// worse than no preview if it does not render the same arithmetic, so
// the fix is one function rather than three corrected copies.
//
// Takes an injected prisma, like the iCal sync engine, so the
// assembly rules can be tested without a database.

import type { PrismaClient } from "@prisma/client";
import { buildStatement, type Statement } from "./aggregate";
import { buildShortTermSummary, type ShortTermPropertyRow } from "./short-term";
import { periodRange, type Period } from "./period";

export type AssembledStatement = {
  statement: Statement;
  shortTerm: ShortTermPropertyRow[];
  // An empty period still gets a statement, because a landlord
  // reading nothing cannot tell "no activity" from "the job did not
  // run". The email body changes rather than the send being skipped.
  isEmpty: boolean;
};

export async function assembleStatement({
  prisma,
  client,
  period,
}: {
  prisma: PrismaClient;
  client: { id: string; preferredCurrency?: string | null };
  period: Period;
}): Promise<AssembledStatement> {
  const { start, end } = periodRange(period);

  const [transactions, bookings] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        occurredOn: { gte: start, lt: end },
        property: { clientId: client.id },
        // Archived means deleted as far as anyone outside the admin
        // is concerned. Leaving these in was the bug that let a
        // corrected ledger entry keep appearing on a client's PDF.
        archivedAt: null,
      },
      include: {
        property: { select: { id: true, name: true } },
        lease: { select: { id: true, tenantName: true } },
      },
      orderBy: { occurredOn: "asc" },
    }),
    // Any stay that overlaps the period at all. buildShortTermSummary
    // clips nights to the window and drops cancellations; gross and
    // fees stay attached to the stay's own period so the figure
    // matches the bank.
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
    bookings.map((b) => ({
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
    // Goldstay's commission lives on Transaction rather than Booking
    // because the rate can change over time. Sourced from the same
    // filtered list above, so an archived commission row cannot be
    // deducted from a payout the client is shown.
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

  return {
    statement,
    shortTerm,
    isEmpty: transactions.length === 0 && bookings.length === 0,
  };
}
