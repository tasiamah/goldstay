// Polite HTTP fetch helper for the public-listing scrapers.
//
// Target sites (Airbnb, BuyRentKenya) are happy to serve their public
// search pages to a normal-looking browser request. They are not happy
// to serve them to a default Node.js User-Agent. We therefore set:
//
//   - A realistic UA string (rotated per call from a small pool).
//   - Standard Accept / Accept-Language headers.
//   - A Goldstay contact line in the User-Agent so a reasonable
//     webmaster who notices the traffic can email us instead of
//     blacklisting first. This is good citizenship and has saved us
//     more than one block historically.
//
// Optional outbound proxy support via ACQUISITION_PROXY_URL env var
// (e.g. a Bright Data residential proxy). Without it the cron runs
// from Vercel's IP space, which some sources rate-limit aggressively;
// add a proxy when (not if) we see 403s in production.

const UAS = [
  // A small pool of recent desktop Chrome strings keeps each request
  // looking like a different visitor without going overboard. Update
  // these once a year or so as Chrome's major version moves on.
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
];

function pickUa(): string {
  const i = Math.floor(Math.random() * UAS.length);
  const base = UAS[i] ?? UAS[0]!;
  return `${base} (+goldstay-acquisition-bot; contact: leads@goldstay.co.ke)`;
}

export class FetchBlockedError extends Error {
  status: number;
  constructor(status: number, url: string) {
    super(`fetch blocked (${status}) for ${url}`);
    this.status = status;
    this.name = "FetchBlockedError";
  }
}

// Sleeps a polite jittered interval. Default 1500–3000 ms which is
// well above what a human browser would do and well within any
// reasonable robots etiquette.
export async function politeDelay(minMs = 1500, maxMs = 3000): Promise<void> {
  const ms = minMs + Math.floor(Math.random() * Math.max(1, maxMs - minMs));
  await new Promise((r) => setTimeout(r, ms));
}

export async function fetchHtml(
  url: string,
  init: { timeoutMs?: number } = {},
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), init.timeoutMs ?? 15000);

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": pickUa(),
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-GB,en;q=0.9,en-US;q=0.8",
        "Cache-Control": "no-cache",
      },
      signal: controller.signal,
    });
    if (res.status === 403 || res.status === 429) {
      throw new FetchBlockedError(res.status, url);
    }
    if (!res.ok) {
      throw new Error(`fetch failed ${res.status} for ${url}`);
    }
    return await res.text();
  } finally {
    clearTimeout(timeout);
  }
}
