// Money and percentage formatting for the referral programme.
//
// Shared between the public page, the referrer's own dashboard and the
// admin screens so an agent and an operator looking at the same
// commission see the same string.
//
// Everything here is USD. The programme quotes dollars on the public
// page and the schema stores monthlyRentUsd, while leases are
// recorded in the currency of the country they sit in — see the note
// on suggestedTermsForReferral in ./db.ts for why the two are kept
// deliberately apart rather than converted.

export function usd(amount: number): string {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Ratios are stored as decimals (0.25 = 25%). Trailing zeroes are
// dropped so a quarter share reads "25%" rather than "25.0%".
export function pct(ratio: number): string {
  const asPercent = ratio * 100;
  const rounded = Math.round(asPercent * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)}%`;
}

// Local money in its own currency, used where a lease amount is shown
// as context next to a USD field. Always renders the currency code,
// because the entire point of showing it is that it might not be USD.
export function localMoney(amount: number, currency: string): string {
  return `${currency.toUpperCase()} ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function shortDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
