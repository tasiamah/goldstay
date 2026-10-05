// Brings a month's costs into the currency the property earns in, so
// an owner reads one statement rather than two balances.
//
// Polaris bills guests in dollars. A KES 6,000 repair on it used to
// land in a shilling column of its own: it did not reduce the payout,
// it did not appear in the short-stay block, and the summary showed
// "KES −6,000" next to "USD 350.16" with nothing connecting them.
//
// Only costs are converted, and only into the currency that property
// actually earns. Income is never touched — a guest paid what they
// paid, in the currency they paid it, and restating that would make
// the statement disagree with Airbnb.

import {
  convert,
  formatRate,
  rateOnOrBefore,
  sameCurrency,
  type FxRate,
} from "@/lib/fx/convert";

export type NormalisableTransaction = {
  occurredOn: Date;
  direction: "INFLOW" | "OUTFLOW";
  amount: number;
  currency: string;
  description?: string | null;
  propertyId: string;
};

// The currency a property takes its money in. Derived from what it
// earned this period rather than configured, so it cannot drift out
// of step with reality — and chosen by value, because a property that
// took one small direct booking in shillings and the rest in dollars
// earns in dollars.
export function earningCurrencyByProperty(
  rows: readonly {
    propertyId: string;
    direction: "INFLOW" | "OUTFLOW";
    amount: number;
    currency: string;
  }[],
): Map<string, string> {
  const totals = new Map<string, Map<string, number>>();
  for (const r of rows) {
    if (r.direction !== "INFLOW") continue;
    if (!(r.amount > 0)) continue;
    const byCurrency = totals.get(r.propertyId) ?? new Map<string, number>();
    byCurrency.set(r.currency, (byCurrency.get(r.currency) ?? 0) + r.amount);
    totals.set(r.propertyId, byCurrency);
  }

  const out = new Map<string, string>();
  for (const [propertyId, byCurrency] of totals) {
    let winner: string | null = null;
    let most = -1;
    for (const [currency, amount] of byCurrency) {
      // Ties resolve alphabetically rather than by insertion order,
      // so the same month always converts the same way.
      if (amount > most || (amount === most && winner && currency < winner)) {
        most = amount;
        winner = currency;
      }
    }
    if (winner) out.set(propertyId, winner);
  }
  return out;
}

export type NormaliseResult<T> = {
  rows: T[];
  // Costs we could not convert because no rate was on file at or
  // before the day they were paid. They keep their own currency and
  // the statement shows them apart, as it did before any of this.
  unconverted: number;
};

export function normaliseCosts<T extends NormalisableTransaction>(
  rows: readonly T[],
  rates: readonly FxRate[],
  earningCurrency: ReadonlyMap<string, string>,
): NormaliseResult<T> {
  let unconverted = 0;

  const out = rows.map((row) => {
    if (row.direction !== "OUTFLOW") return row;

    const target = earningCurrency.get(row.propertyId);
    if (!target || sameCurrency(row.currency, target)) return row;

    // The rate on the day we paid it, never a later one: we recover
    // what the cost actually cost us and no more, which is what
    // "billed at what we were charged" has to mean once a currency
    // boundary is involved.
    const rate = rateOnOrBefore(rates, row.currency, target, row.occurredOn);
    if (!rate) {
      unconverted += 1;
      return row;
    }

    return {
      ...row,
      amount: convert(row.amount, rate),
      currency: target,
      // The original sum and the rate travel with the line, so the
      // owner can check it against a receipt written in shillings.
      description: withConversionNote(
        row.description,
        row.amount,
        row.currency,
        target,
        rate.inverted ? 1 / rate.rate : rate.rate,
        rate.inverted ? target : row.currency,
        rate.inverted ? row.currency : target,
      ),
    };
  });

  return { rows: out, unconverted };
}

function withConversionNote(
  description: string | null | undefined,
  originalAmount: number,
  originalCurrency: string,
  _target: string,
  shownRate: number,
  rateFrom: string,
  rateTo: string,
): string {
  const original = `${originalCurrency} ${originalAmount.toLocaleString(
    "en-GB",
    { minimumFractionDigits: 0, maximumFractionDigits: 2 },
  )}`;
  const note = `${original} at ${formatRate(rateFrom, rateTo, shownRate)}`;
  const written = description?.trim();
  // An already-converted description keeps its own note rather than
  // collecting a second one.
  if (written && written.includes(" at 1 ")) return written;
  return written ? `${written} — ${note}` : note;
}
