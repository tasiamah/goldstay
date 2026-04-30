// HTTP fetcher for iCal feeds. Wrapped in its own module so the
// sync engine stays test-friendly with no network dependency.
//
// Defensive choices:
//   - 10s timeout (OTAs are usually < 1s, sometimes flaky)
//   - User-Agent string so we look like a polite bot, not an
//     unidentified scraper that gets rate-limited
//   - Reject non-200 responses with a typed error so the caller can
//     persist a useful lastError on the feed row.

const FETCH_TIMEOUT_MS = 10_000;

export class IcalFetchError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "IcalFetchError";
  }
}

export async function fetchIcal(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "text/calendar, text/plain, */*",
        "User-Agent": "Goldstay-iCal-Sync/1.0 (+https://goldstay.co.ke)",
      },
      // iCal feeds change frequently; never serve a stale response
      // from an upstream cache.
      cache: "no-store",
    });
    if (!res.ok) {
      throw new IcalFetchError(
        `Upstream returned ${res.status} ${res.statusText}`,
        res.status,
      );
    }
    return await res.text();
  } catch (err) {
    if (err instanceof IcalFetchError) throw err;
    if ((err as Error).name === "AbortError") {
      throw new IcalFetchError(`Request timed out after ${FETCH_TIMEOUT_MS}ms`);
    }
    throw new IcalFetchError(
      (err as Error).message ?? "Unknown fetch error",
    );
  } finally {
    clearTimeout(timer);
  }
}
