// Constant-time HTTP Basic credential check for the Hostaway webhook.
//
// Hostaway does not sign its webhook bodies. The only protection it
// offers on an outgoing unified webhook is an optional login and
// password, which it sends as a standard `Authorization: Basic`
// header (https://api.hostaway.com/documentation, "Webhook events").
// There is no HMAC and no signature header of any kind, so the
// endpoint has to be protected by the credential pair plus the
// obscurity of the URL.
//
// Because the body is unsigned we cannot detect a tampered payload,
// only an unauthenticated caller. That is a weaker guarantee than a
// signature would give us, and it is the reason the route keys
// idempotency on the Hostaway reservation id rather than trusting
// the body to be unique.

import { timingSafeEqual } from "node:crypto";

export function verifyHostawayBasicAuth(
  authorizationHeader: string | null,
  user: string,
  password: string,
): boolean {
  if (!authorizationHeader || !user || !password) return false;

  const [scheme, ...rest] = authorizationHeader.trim().split(/\s+/);
  if (!scheme || scheme.toLowerCase() !== "basic") return false;

  const provided = rest.join("");
  if (!provided) return false;

  const expected = Buffer.from(`${user}:${password}`, "utf8").toString(
    "base64",
  );

  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  // timingSafeEqual throws on a length mismatch, and the length of a
  // base64 credential leaks only the combined length of the pair,
  // which is not worth padding against.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
