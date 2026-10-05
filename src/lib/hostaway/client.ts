// Outbound Hostaway REST client.
//
// The webhook in app/api/webhooks/hostaway only ever hears about
// reservations made from the moment it was registered. Anything that
// happened before that — which for us is every stay Polaris has ever
// had — has to be pulled. That is what this is for.
//
// Auth is OAuth2 client credentials against
// POST /v1/accessTokens with scope=general, where client_id is the
// Hostaway account ID and client_secret is the API key from
// Settings > Hostaway API. Tokens are valid for 24 months, but we
// fetch one per run rather than storing it: an import is a rare,
// operator-triggered action, and a token in the database is one more
// credential to leak.
//
// Hostaway's own documentation warns the token is not usable for one
// second after issue, which is why acquireToken waits before
// returning. Skipping that produces a 403 that looks exactly like
// bad credentials.

import type { HostawayReservation } from "./mapper";

const API_BASE = "https://api.hostaway.com/v1";
const TOKEN_WARMUP_MS = 1_100;

export type Fetch = typeof fetch;

export class HostawayApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "HostawayApiError";
  }
}

export async function acquireToken({
  accountId,
  apiKey,
  fetchImpl = fetch,
  warmupMs = TOKEN_WARMUP_MS,
}: {
  accountId: string;
  apiKey: string;
  fetchImpl?: Fetch;
  warmupMs?: number;
}): Promise<string> {
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: accountId,
    client_secret: apiKey,
    scope: "general",
  });

  const res = await fetchImpl(`${API_BASE}/accessTokens`, {
    method: "POST",
    headers: {
      "Cache-control": "no-cache",
      "Content-type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!res.ok) {
    throw new HostawayApiError(
      `Could not get a Hostaway token (HTTP ${res.status}). Check the account ID and API key in Settings > Hostaway API.`,
      res.status,
    );
  }

  const json = (await res.json()) as { access_token?: unknown };
  if (typeof json.access_token !== "string" || !json.access_token) {
    throw new HostawayApiError(
      "Hostaway returned a token response with no access_token in it.",
      res.status,
    );
  }

  if (warmupMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, warmupMs));
  }
  return json.access_token;
}

export type ReservationQuery = {
  token: string;
  listingId: string;
  /** Inclusive YYYY-MM-DD bound on the stay's arrival date. */
  arrivalStartDate: string;
  arrivalEndDate: string;
  fetchImpl?: Fetch;
  pageSize?: number;
  /** Guards against a paging bug turning into an unbounded loop. */
  maxPages?: number;
};

// Filters on arrival date, which is the only window Hostaway offers
// that reliably brackets a stay. A statement needs every stay
// *overlapping* its month, so callers should ask for a range that
// starts before the month they care about — a guest who arrived on
// 28 August and left on 3 September belongs to both.
export async function listReservations({
  token,
  listingId,
  arrivalStartDate,
  arrivalEndDate,
  fetchImpl = fetch,
  pageSize = 100,
  maxPages = 50,
}: ReservationQuery): Promise<HostawayReservation[]> {
  const out: HostawayReservation[] = [];

  for (let page = 0; page < maxPages; page++) {
    const params = new URLSearchParams({
      listingId,
      arrivalStartDate,
      arrivalEndDate,
      limit: String(pageSize),
      offset: String(page * pageSize),
    });

    const res = await fetchImpl(`${API_BASE}/reservations?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-control": "no-cache",
      },
    });

    if (!res.ok) {
      throw new HostawayApiError(
        `Hostaway rejected the reservations request (HTTP ${res.status}).`,
        res.status,
      );
    }

    const json = (await res.json()) as { result?: unknown };
    const batch = Array.isArray(json.result) ? json.result : [];
    out.push(...(batch as HostawayReservation[]));

    // A short page is the last page. Hostaway also returns `count`,
    // but it has meant both "total matching" and "returned here" at
    // different times, so page length is the safer signal.
    if (batch.length < pageSize) break;
  }

  return out;
}

export function hostawayCredentials(): {
  accountId: string;
  apiKey: string;
} | null {
  const accountId = process.env.HOSTAWAY_ACCOUNT_ID;
  const apiKey = process.env.HOSTAWAY_API_KEY;
  if (!accountId || !apiKey) return null;
  return { accountId, apiKey };
}
