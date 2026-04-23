import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Lightweight rate limiting for our public API routes. Backed by Upstash
// (serverless-safe) because Vercel functions are stateless and anything
// in-process resets on every cold start.
//
// If UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set, the
// limiter silently no-ops. That keeps local dev and preview deploys from
// breaking when the env vars aren't wired up yet; the logged warning on
// first call is the prompt to configure them before going live.

type LimiterKey =
  | "lead"
  | "tenantApplication"
  | "tenantWaitlist"
  | "unitsSearch";

// Per-route limits. Tuned to real-world human usage, not bots. A single
// household filling out a form twice is fine; fifty requests a minute from
// one IP is a spammer.
const configs: Record<
  LimiterKey,
  { tokens: number; window: `${number} ${"s" | "m" | "h"}` }
> = {
  lead: { tokens: 5, window: "1 h" },
  tenantApplication: { tokens: 3, window: "1 h" },
  tenantWaitlist: { tokens: 5, window: "1 h" },
  unitsSearch: { tokens: 60, window: "1 m" },
};

let redis: Redis | null = null;
const limiters = new Map<LimiterKey, Ratelimit>();
let warned = false;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    if (!warned) {
      console.warn(
        "[goldstay/rateLimit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN not set. Rate limiting disabled.",
      );
      warned = true;
    }
    return null;
  }
  redis = new Redis({ url, token });
  return redis;
}

function getLimiter(key: LimiterKey): Ratelimit | null {
  const cached = limiters.get(key);
  if (cached) return cached;
  const client = getRedis();
  if (!client) return null;
  const cfg = configs[key];
  const limiter = new Ratelimit({
    redis: client,
    limiter: Ratelimit.slidingWindow(cfg.tokens, cfg.window),
    analytics: false,
    prefix: `goldstay:rl:${key}`,
  });
  limiters.set(key, limiter);
  return limiter;
}

// Extract the client IP from Vercel / standard proxy headers. Falls back to
// a shared bucket label if no IP is available (better than nothing; the
// attacker is probably behind the same proxy as legit traffic).
function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "ip:unknown";
}

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: number; // ms epoch
};

export async function enforceRateLimit(
  req: Request,
  key: LimiterKey,
): Promise<RateLimitResult> {
  const limiter = getLimiter(key);
  if (!limiter) {
    return {
      allowed: true,
      limit: Infinity,
      remaining: Infinity,
      reset: 0,
    };
  }
  const ip = getClientIp(req);
  const { success, limit, remaining, reset } = await limiter.limit(
    `${key}:${ip}`,
  );
  return { allowed: success, limit, remaining, reset };
}

// Small helper for API routes: returns a 429 Response when rate-limited,
// otherwise returns null so the route can continue. Keeps every route's
// opening two lines identical.
export async function rateLimitOr429(
  req: Request,
  key: LimiterKey,
): Promise<Response | null> {
  const res = await enforceRateLimit(req, key);
  if (res.allowed) return null;
  const retryAfterSec = Math.max(1, Math.ceil((res.reset - Date.now()) / 1000));
  return new Response(
    JSON.stringify({
      error: "Too many requests. Please try again shortly.",
    }),
    {
      status: 429,
      headers: {
        "content-type": "application/json",
        "retry-after": String(retryAfterSec),
        "x-ratelimit-limit": String(res.limit),
        "x-ratelimit-remaining": String(res.remaining),
        "x-ratelimit-reset": String(res.reset),
      },
    },
  );
}
