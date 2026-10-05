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
import {
  earningCurrencyByProperty,
  normaliseCosts,
} from "./fx-normalise";
import {
  convert,
  formatRate,
  leastCostlyRate,
  round2,
  sameCurrency,
  type FxRate,
} from "@/lib/fx/convert";

export type PayoutRateUsed = {
  from: string;
  to: string;
  label: string;
  asOf: Date;
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

  // Reach back beyond the period: a cost on the 1st needs the rate
  // from the last day a rate was published, which is in the previous
  // month. 45 days covers a long public holiday without pulling the
  // whole table.
  const ratesFrom = new Date(start);
  ratesFrom.setUTCDate(ratesFrom.getUTCDate() - 45);

  const [transactions, bookings, rateRows] = await Promise.all([
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
    prisma.fxRate.findMany({
      where: { asOf: { gte: ratesFrom, lt: end } },
      select: { base: true, quote: true, asOf: true, rate: true },
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

  const { rows: converted } = normaliseCosts(flat, rates, earningCurrency);

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
          t.type === "GOLDSTAY_COMMISSION" ||
          OWNER_COST_TYPES.includes(t.type),
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

  return {
    statement,
    shortTerm,
    payoutInPreferred: convertPayout({
      totals: statement.totalsByCurrency,
      preferred: client.preferredCurrency,
      rates,
      period: { start, end },
    }),
    isEmpty: transactions.length === 0 && bookings.length === 0,
  };
}

// What the owner receives in the currency their account is set to.
//
// Unlike the cost conversion above, this is a trade we actually
// perform: we hold dollars and hand over shillings, and we carry the
// spread between the rate on any given day and the rate we get. So it
// takes the rate across the month that leaves us least short, and
// prints that rate on the statement — a margin the owner can see and
// check is a different thing from one they cannot.
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
    const rate = leastCostlyRate(rates, t.currency, to, period);
    // One unconvertible currency sinks the whole figure rather than
    // producing a total that silently omits part of what is owed.
    if (!rate) return null;
    total += convert(t.net, rate);
    usedRates.push({
      from: t.currency,
      to,
      // Printed the way a person quotes it — "1 USD = 128.4 KES" —
      // regardless of which way the stored row ran.
      label: rate.inverted
        ? formatRate(to, t.currency, 1 / rate.rate)
        : formatRate(t.currency, to, rate.rate),
      asOf: rate.asOf,
    });
  }

  return { currency: to, amount: round2(total), rates: usedRates };
}
