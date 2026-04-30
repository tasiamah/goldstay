// Constant-time HMAC-SHA256 signature verification for the Hostaway
// webhook. Hostaway signs the raw request body with a shared secret
// and forwards the hex digest in the `X-Hostaway-Signature` header
// (`sha256=<hex>` prefix optional depending on tenant config). We
// accept either format to stay robust to both.

import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyHostawaySignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
): boolean {
  if (!signatureHeader || !secret) return false;
  const provided = signatureHeader.startsWith("sha256=")
    ? signatureHeader.slice("sha256=".length)
    : signatureHeader;

  const expected = createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex");

  if (expected.length !== provided.length) return false;
  try {
    return timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(provided, "hex"),
    );
  } catch {
    return false;
  }
}
