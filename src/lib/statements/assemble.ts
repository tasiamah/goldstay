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
import {
  buildShortTermSummary,
  OWNER_COST_TYPES,
  type ShortTermPropertyRow,
} from "./short-term";
import { periodRange, type Period } from "./period";
import { earningCurrencyByProperty, normaliseCosts } from "./fx-normalise";
import { firstStatementFacts, firstStatementNote } from "./first-statement";
import {
  convert,
  monthlyRate,
  round2,
  sameCurrency,
  type FxRate,
} from "@/lib/fx/convert";

export type PayoutRateUsed = {
  from: string;
  to: string;
  label: string;
};

export type PayoutInPreferred = {
  currency: string;
  amount: number;
  rates: PayoutRateUsed[];
};

export type AssembledStatement = {
  statement: Statement;
  shortTerm: ShortTermPropertyRow[];
  // The payout restated in the currency the client's account is set
  // to. Null when there is nothing to convert, nothing owed, or no
  // rate on file — never a guess.
  payoutInPreferred: PayoutInPreferred | null;
  // Sentences to show above the figures when this is the first
  // statement this client has received, explaining the two things
  // that make a first month low and self-correcting. Empty on every
  // later statement.
  firstStatementNote: string[];
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

  const [transactions, bookings, rateRows, earlierSend, clientRow] =
    await Promise.all([
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
      // Only the period's own rates. A month converts at a rate
      // published during it or not at all — borrowing a neighbouring
      // month's would value September using October's shilling.
      prisma.fxRate.findMany({
        where: { asOf: { gte: start, lt: end } },
        select: { base: true, quote: true, asOf: true, rate: true },
      }),
      // Any statement for an earlier period. Keyed on "earlier" rather
      // than "any" so re-rendering September after it has been sent
      // still knows September was the first one — otherwise the note
      // would vanish from the copy in the portal the moment the email
      // went out.
      prisma.statementSend.findFirst({
        where: {
          clientId: client.id,
          OR: [
            { periodYear: { lt: period.year } },
            { periodYear: period.year, periodMonth: { lt: period.month } },
          ],
        },
        select: { id: true },
      }),
      // Read here rather than taken from the caller. Four callers build
      // this statement and the note has to appear on all of them; a
      // field one of them forgot to select is how the preview and the
      // PDF drifted apart the last time.
      prisma.client.findUnique({
        where: { id: client.id },
        select: { createdAt: true },
      }),
    ]);

  const rates: FxRate[] = rateRows.map((r) => ({
    base: r.base,
    quote: r.quote,
    asOf: r.asOf,
    rate: Number(r.rate),
  }));

  // Costs are brought into the currency each property earns in
  // before anything is totalled, so the ledger, the short-stay block
  // and the summary all agree. Done once here rather than in each of
  // the three, which is how they drifted apart last time.
  const flat = transactions.map((t) => ({
    id: t.id,
    occurredOn: t.occurredOn,
    type: t.type,
    direction: t.direction,
    amount: Number(t.amount),
    currency: t.currency,
    description: t.description,
    reference: t.reference,
    propertyId: t.propertyId,
    propertyName: t.property.name,
    leaseId: t.leaseId,
    tenantName: t.lease?.tenantName ?? null,
  }));

  const earningCurrency = earningCurrencyByProperty([
    ...flat,
    // Bookings count as income too. Without them a short-stay
    // property whose rent lands as one monthly transaction still
    // resolves, but one paid per booking would not.
    ...bookings.map((b) => ({
      propertyId: b.propertyId,
      direction: "INFLOW" as const,
      amount: Number(b.grossAmount),
      currency: b.currency,
    })),
  ]);

  const { rows: converted } = normaliseCosts(flat, rates, earningCurrency, {
    start,
    end,
  });

  const statement = buildStatement(converted, {
    preferredCurrency: client.preferredCurrency,
  });

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
    // because the rate can change over time, and expenses because
    // they belong to the unit rather than to a stay. Sourced from the
    // same filtered list above, so an archived row cannot be deducted
    // from a payout the client is shown.
    converted
      .filter(
        (t) =>
          t.type === "GOLDSTAY_COMMISSION" || OWNER_COST_TYPES.includes(t.type),
      )
      .map((t) => ({
        propertyId: t.propertyId,
        type: t.type,
        amount: t.amount,
        currency: t.currency,
        description: t.description,
      })),
    { start, end },
  );

  const isEmpty = transactions.length === 0 && bookings.length === 0;

  return {
    statement,
    shortTerm,
    payoutInPreferred: convertPayout({
      totals: statement.totalsByCurrency,
      preferred: client.preferredCurrency,
      rates,
      period: { start, end },
    }),
    // Suppressed on an empty month: there is no low figure to explain,
    // and a note about first-month earnings above a statement showing
    // none reads as an apology for nothing having happened.
    firstStatementNote:
      earlierSend || isEmpty
        ? []
        : firstStatementNote(
            firstStatementFacts({
              joinedOn: clientRow?.createdAt ?? null,
              period: { start, end },
            }),
            period,
          ),
    isEmpty,
  };
}

// What the owner receives in the currency their account is set to.
//
// Uses the same month rate as the costs above, rounded the other way
// because this is money leaving rather than money already spent. We
// hold dollars and hand over shillings, and we carry the spread
// between any published rate and the one we actually get, so the
// rounding keeps that spread from coming out of the management fee.
// The rate is printed beside the figure.
function convertPayout({
  totals,
  preferred,
  rates,
  period,
}: {
  totals: readonly { currency: string; net: number }[];
  preferred?: string | null;
  rates: readonly FxRate[];
  period: { start: Date; end: Date };
}): PayoutInPreferred | null {
  const to = preferred?.trim().toUpperCase();
  if (!to) return null;

  // Only what the owner is actually owed. A currency that nets
  // negative is a balance to settle, and rolling it into the headline
  // would hide it.
  const owed = totals.filter((t) => t.net > 0);
  if (owed.length === 0) return null;

  // Already entirely in their currency: there is nothing to convert
  // and a second line saying so would be noise.
  if (owed.every((t) => sameCurrency(t.currency, to))) return null;

  let total = 0;
  const usedRates: PayoutRateUsed[] = [];
  for (const t of owed) {
    if (sameCurrency(t.currency, to)) {
      total += t.net;
      continue;
    }
    const rate = monthlyRate(rates, t.currency, to, period, "disburse");
    // One unconvertible currency sinks the whole figure rather than
    // producing a total that silently omits part of what is owed.
    if (!rate) return null;
    total += convert(t.net, rate.rate);
    usedRates.push({ from: t.currency, to, label: rate.label });
  }

  return { currency: to, amount: round2(total), rates: usedRates };
}
