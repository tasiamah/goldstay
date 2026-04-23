// Tiny access check for the private /apply surface. Goldstay shares the
// tenant application form over WhatsApp or email with a single shared
// token appended as `?key=...`. Any request without the matching token is
// shown a stub page and cannot submit.
//
// This is deliberately minimal (one shared secret, rotatable via env var)
// rather than per-invite signed tokens. It stops drive-by indexing, casual
// sharing and automated form-fillers, which is 99% of the real-world
// threat at this stage. If per-invite revocation becomes necessary we can
// replace this with signed tokens stored in Airtable without changing the
// URL shape.
//
// Rotation: set APPLY_ACCESS_TOKEN in Vercel to any random string
// (e.g. `openssl rand -hex 24`). The old value stops working immediately.

export function isApplyAccessConfigured(): boolean {
  return typeof process.env.APPLY_ACCESS_TOKEN === "string"
    && process.env.APPLY_ACCESS_TOKEN.length > 0;
}

export function isApplyAccessValid(token: string | undefined | null): boolean {
  const expected = process.env.APPLY_ACCESS_TOKEN;
  if (!expected) {
    // Fail closed in production if the secret isn't set. In local dev
    // (NODE_ENV !== "production") we fail open so the maintainer can
    // still hit the form without wiring Upstash/Airtable locally.
    return process.env.NODE_ENV !== "production";
  }
  if (!token) return false;
  // Constant-time-ish comparison. Node's timingSafeEqual would need equal
  // byte lengths; for short secrets this is enough, and we're not storing
  // anything worth the effort of a timing attack.
  if (token.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}
