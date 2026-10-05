// Fetches today's rates and stores them.
//
// open.er-api.com is used because it is the only free source that
// quotes KES without an API key. It publishes once a day, which is
// the granularity a monthly statement needs anyway.
//
// It gives today's rates only — there is no history to backfill from.
// That is why the job has to run every day rather than being called
// when a statement is generated: a rate not captured on the day is
// gone, and September's rates cannot be recovered after the fact.

const ENDPOINT = "https://open.er-api.com/v6/latest/";

export class FxProviderError extends Error {}

export type FetchedRates = {
  base: string;
  asOf: Date;
  rates: Record<string, number>;
};

// Currencies we actually settle in. Fetching the provider's full list
// would store hundreds of rows a day for pairs nobody will ever ask
// about.
export const TRACKED_QUOTES = ["KES", "GHS", "EUR", "GBP"] as const;

export async function fetchRates(
  base = "USD",
  fetchImpl: typeof fetch = fetch,
): Promise<FetchedRates> {
  const res = await fetchImpl(`${ENDPOINT}${encodeURIComponent(base)}`, {
    headers: { accept: "application/json" },
  });
  if (!res.ok) {
    throw new FxProviderError(
      `Rate provider returned ${res.status} ${res.statusText}`,
    );
  }

  const body = (await res.json()) as {
    result?: string;
    time_last_update_unix?: number;
    rates?: Record<string, number>;
  };

  if (body.result !== "success" || !body.rates) {
    throw new FxProviderError("Rate provider returned no rates");
  }

  const rates: Record<string, number> = {};
  for (const quote of TRACKED_QUOTES) {
    const value = body.rates[quote];
    // A missing or nonsense quote is skipped rather than stored as
    // zero, which would later divide by zero or value a payout at
    // nothing.
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
      rates[quote] = value;
    }
  }

  if (Object.keys(rates).length === 0) {
    throw new FxProviderError("Rate provider returned none of the pairs we track");
  }

  return { base, asOf: dayOf(body.time_last_update_unix), rates };
}

// Rates are a property of a calendar day, so the timestamp is
// flattened to midnight UTC. Without this the unique index would
// admit several rows for one day and `leastCostlyRate` would pick
// between them arbitrarily.
function dayOf(unixSeconds?: number): Date {
  const d = unixSeconds ? new Date(unixSeconds * 1000) : new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function dayUtc(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}
