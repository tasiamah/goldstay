// Currency conversion for statements.
//
// Until now there was no FX anywhere in this codebase: amounts were
// grouped by currency and never combined. That was honest but it left
// an owner whose unit earns dollars, and on which we spent shillings,
// reading two separate balances and a payout that did not include one
// of them.
//
// Two different questions are asked here, and they take different
// rates on purpose:
//
//   1. What did a cost actually cost? Converted at the rate on the day
//      we paid it. We recover what we spent and no more, which is what
//      "billed at what we were charged, no markup" on /pricing means.
//
//   2. What will we pay the owner? We really do convert currency to
//      pay them and we really do carry the spread, so that conversion
//      uses the rate across the period least likely to leave us short.
//      The rate used is printed on the statement; a margin the owner
//      cannot see is a different thing from one they can.

export type FxRate = {
  base: string;
  quote: string;
  // Midnight UTC on the day the rate applies.
  asOf: Date;
  // Units of `quote` per 1 `base`.
  rate: number;
};

export type ResolvedRate = {
  // Units of `to` per 1 `from`, whichever direction the stored row ran.
  rate: number;
  asOf: Date;
  // True when the stored row was the other way round and we inverted
  // it, which the UI may want to say out loud.
  inverted: boolean;
};

const norm = (c: string) => c.trim().toUpperCase();

// Re-expresses a stored row as "units of `to` per 1 `from`", or null
// if the row is about some other pair.
function orient(r: FxRate, from: string, to: string): ResolvedRate | null {
  const f = norm(from);
  const t = norm(to);
  const base = norm(r.base);
  const quote = norm(r.quote);
  if (!(r.rate > 0)) return null;
  if (base === f && quote === t) {
    return { rate: r.rate, asOf: r.asOf, inverted: false };
  }
  if (base === t && quote === f) {
    return { rate: 1 / r.rate, asOf: r.asOf, inverted: true };
  }
  return null;
}

export function sameCurrency(from: string, to: string): boolean {
  return norm(from) === norm(to);
}

// The rate in force on a given day: the most recent one at or before
// it. Rates are not published at weekends, so a Saturday cost has to
// look back rather than find nothing.
//
// Deliberately never looks forward. Using a later rate to value an
// earlier payment restates history with information we did not have.
export function rateOnOrBefore(
  rates: readonly FxRate[],
  from: string,
  to: string,
  date: Date,
): ResolvedRate | null {
  if (sameCurrency(from, to)) {
    return { rate: 1, asOf: date, inverted: false };
  }
  const cutoff = date.getTime();
  let best: ResolvedRate | null = null;
  for (const r of rates) {
    const oriented = orient(r, from, to);
    if (!oriented) continue;
    if (oriented.asOf.getTime() > cutoff) continue;
    if (!best || oriented.asOf.getTime() > best.asOf.getTime()) {
      best = oriented;
    }
  }
  return best;
}

// The rate for the payout conversion: of everything recorded in the
// period, the one that hands over the fewest units of `to`.
//
// Expressed as "fewest units of the currency we are paying out in"
// rather than as a minimum or a maximum, because which of those it is
// flips with the direction of the stored pair.
export function leastCostlyRate(
  rates: readonly FxRate[],
  from: string,
  to: string,
  period: { start: Date; end: Date },
): ResolvedRate | null {
  if (sameCurrency(from, to)) {
    return { rate: 1, asOf: period.start, inverted: false };
  }
  const startMs = period.start.getTime();
  const endMs = period.end.getTime();
  let best: ResolvedRate | null = null;
  for (const r of rates) {
    const oriented = orient(r, from, to);
    if (!oriented) continue;
    const t = oriented.asOf.getTime();
    if (t < startMs || t >= endMs) continue;
    if (!best || oriented.rate < best.rate) best = oriented;
  }
  // A month we hold no rates for must not silently convert at some
  // unrelated day's rate. The caller decides whether to fall back to
  // the last known rate or to show the currencies apart, which is
  // what we did before any of this existed.
  return best;
}

export function convert(amount: number, rate: ResolvedRate): number {
  return round2(amount * rate.rate);
}

export function round2(n: number): number {
  // Decimal money through binary floating point: 1.005 * 100 is
  // 100.49999999999999, so nudge before rounding.
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

// "1 USD = 129.748 KES". Trailing zeros trimmed so a rate of exactly
// 130 does not print as 130.000000.
export function formatRate(
  from: string,
  to: string,
  rate: number,
): string {
  const shown = Number(rate.toFixed(6)).toLocaleString("en-GB", {
    maximumFractionDigits: 6,
  });
  return `1 ${norm(from)} = ${shown} ${norm(to)}`;
}
