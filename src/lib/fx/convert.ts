// Currency conversion for statements.
//
// Until now there was no FX anywhere in this codebase: amounts were
// grouped by currency and never combined. That was honest but it left
// an owner whose unit earns dollars, and on which we spent shillings,
// reading two separate balances and a payout that did not include one
// of them.
//
// One rate per currency pair per month, used for everything on that
// month's statement. A rate that changed per transaction was more
// faithful to the day but gave a statement several different rates
// for the same month, which nobody could check at a glance and which
// an operator could not explain on the phone.
//
// The month's rate is chosen conservatively and then rounded to a
// clean number in the same direction, because converting currency
// costs us a spread we would otherwise absorb: KES 2,000 at a true
// 129.6 becomes KES 2,000 at 129, and the owner's statement says 129.
// The rounding is at most one step — under 1% at every magnitude we
// deal in — and the rate is printed next to every converted figure.
// A margin the owner can see and check is a different thing from one
// they cannot.
//
// Which way "conservative" rounds depends on which side of the trade
// we are on, so it is derived rather than hardcoded. In practice both
// of ours point the same way: we earn dollars from Airbnb, we spend
// shillings on the property and we pay the owner in shillings, so a
// lower shillings-per-dollar rate is the safe one whether we are
// recovering a cost or handing over a payout.

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

// Which side of a conversion we are on, which is what decides the
// safe direction to round.
export type RateUse =
  // We already spent money in `from` and are restating it in `to` to
  // bill it on. Spending too little of `to` is what leaves us short,
  // so a larger `to` figure is the safe one.
  | "recover"
  // We owe money in `from` and are handing it over in `to`. Here it
  // is a larger `to` figure that leaves us short, so the safe
  // direction is the opposite one.
  | "disburse";

export type MonthlyRate = {
  // Units of `to` per 1 `from`, already rounded, ready to multiply.
  rate: number;
  // The rate written the way a person quotes it: whichever side of
  // the pair reads as a number above one. "1 USD = 129 KES".
  label: string;
  // How many published rates the month offered. One is enough to
  // convert, but it is worth being able to say it was one.
  observations: number;
};

// The step we round the quoted rate to. Coarse enough to produce a
// number an owner recognises, fine enough that the margin it creates
// stays under 1% at every magnitude: 129.748 to 129 is 0.58%, 15.67
// to 15.6 is 0.45%, 1.163 to 1.16 is 0.26%.
function stepFor(quoted: number): number {
  if (quoted >= 100) return 1;
  if (quoted >= 10) return 0.1;
  return 0.01;
}

// Rounding a decimal to a decimal step through binary floating point
// needs the division settled first: 15.6 / 0.1 is 155.99999999999997,
// which would floor to 15.5 rather than staying at 15.6.
const round6 = (n: number) => Math.round(n * 1e6) / 1e6;

function toStep(n: number, step: number, up: boolean): number {
  const steps = round6(n / step);
  return round6((up ? Math.ceil(steps) : Math.floor(steps)) * step);
}

// The single rate a month's statement converts everything at: of the
// rates published during the month, the one least likely to leave us
// short, rounded one step further the same way.
//
// Returns null for a month we hold no rates for. Reaching into a
// neighbouring month would restate a period using a rate from outside
// it; the caller shows the currencies apart instead, which is what
// the statement did before any of this existed.
export function monthlyRate(
  rates: readonly FxRate[],
  from: string,
  to: string,
  period: { start: Date; end: Date },
  use: RateUse,
): MonthlyRate | null {
  if (sameCurrency(from, to)) {
    return { rate: 1, label: formatRate(from, to, 1), observations: 0 };
  }

  const startMs = period.start.getTime();
  const endMs = period.end.getTime();
  const oriented: number[] = [];
  for (const r of rates) {
    const o = orient(r, from, to);
    if (!o) continue;
    const t = o.asOf.getTime();
    if (t < startMs || t >= endMs) continue;
    oriented.push(o.rate);
  }
  if (oriented.length === 0) return null;

  const wantLarge = use === "recover";
  const picked = wantLarge
    ? Math.max(...oriented)
    : Math.min(...oriented);

  // Round on the side of the pair that is quoted above one. Doing the
  // same work on 0.0077 USD per KES would mean picking an arbitrary
  // number of decimal places and printing a rate nobody would
  // recognise as the shilling rate.
  const quotedIsOriented = picked >= 1;
  const quoted = quotedIsOriented ? picked : 1 / picked;
  // Inverting the pair inverts which extreme is the safe one.
  const roundUp = quotedIsOriented ? wantLarge : !wantLarge;
  const rounded = toStep(quoted, stepFor(quoted), roundUp);

  return {
    // The reciprocal is kept at full precision. Rounding it too would
    // reintroduce an error that grows with the amount — 1/131 to six
    // places turns KES 131,000 into USD 1,000.05 — and the number we
    // owe the owner an explanation for is the quoted one.
    rate: quotedIsOriented ? rounded : 1 / rounded,
    label: quotedIsOriented
      ? formatRate(from, to, rounded)
      : formatRate(to, from, rounded),
    observations: oriented.length,
  };
}

export function convert(amount: number, rate: number): number {
  return round2(amount * rate);
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
