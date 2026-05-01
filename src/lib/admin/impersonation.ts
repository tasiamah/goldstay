// Open-as-owner impersonation primitives.
//
// We deliberately do NOT do anything fancy here: no JWT signing, no
// session replication. The flow is:
//
//   1. An admin clicks "Open as owner" on the owner detail page.
//   2. A server action mints a Supabase magic link for the owner's
//      email via supabase.auth.admin.generateLink, writes an audit
//      event, sets a same-site cookie with the metadata we need to
//      render an ImpersonationBanner, and returns the magic link URL.
//   3. The client opens the magic link in a new tab. That tab signs
//      the admin in as the owner (cookies are shared), and the
//      ImpersonationBanner reads the metadata cookie to show the
//      "you're acting as <owner>" warning + stop-impersonating action.
//
// The cookie is intentionally `httpOnly: false` so we can flag the
// banner client-side too if needed; nothing about it is a credential.
// Real impersonation safety comes from the audit row + the banner.

import { cookies } from "next/headers";

export const IMPERSONATION_COOKIE = "gs_impersonation";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 8; // one workday

export type ImpersonationCookie = {
  ownerId: string;
  ownerLabel: string;
  adminEmail: string;
  startedAt: string;
};

export async function setImpersonationCookie(
  payload: ImpersonationCookie,
): Promise<void> {
  const store = await cookies();
  store.set(IMPERSONATION_COOKIE, encodeCookie(payload), {
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function readImpersonationCookie(): Promise<ImpersonationCookie | null> {
  const store = await cookies();
  const raw = store.get(IMPERSONATION_COOKIE)?.value;
  if (!raw) return null;
  return decodeCookie(raw);
}

export async function clearImpersonationCookie(): Promise<void> {
  const store = await cookies();
  store.delete(IMPERSONATION_COOKIE);
}

// ---------- Pure helpers ----------

export function encodeCookie(payload: ImpersonationCookie): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function decodeCookie(raw: string): ImpersonationCookie | null {
  try {
    const json = Buffer.from(raw, "base64url").toString("utf8");
    const parsed = JSON.parse(json) as Partial<ImpersonationCookie>;
    if (
      typeof parsed.ownerId !== "string" ||
      typeof parsed.ownerLabel !== "string" ||
      typeof parsed.adminEmail !== "string" ||
      typeof parsed.startedAt !== "string"
    ) {
      return null;
    }
    return parsed as ImpersonationCookie;
  } catch {
    return null;
  }
}
