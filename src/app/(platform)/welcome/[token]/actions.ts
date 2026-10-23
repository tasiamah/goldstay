"use server";

import { redirect } from "next/navigation";

import { lookupInvite, recordInviteUse } from "@/lib/clients/invite";
import { mintCallbackLink } from "@/lib/supabase/magic-link";

const DEFAULT_SITE = "https://goldstay.co.ke";

// A server action, so it can only be reached by POST. That is the
// property that protects the token: a mail scanner issuing GETs at
// every URL in the email reaches the page, not this.
export async function openPortalAction(formData: FormData): Promise<void> {
  const token = String(formData.get("token") ?? "");
  const siteUrl = process.env.PUBLIC_SITE_URL || DEFAULT_SITE;

  const found = await lookupInvite(token);
  if (found.status !== "valid") {
    redirect(`/welcome/${encodeURIComponent(token)}?stale=1`);
  }

  const link = await mintCallbackLink({
    email: found.client.email,
    siteUrl,
    next: "/account/password",
  });

  if (!link) {
    // Supabase is misconfigured or refused. Sending them to /login
    // with a password reset is the one path that does not depend on
    // us minting anything.
    redirect("/login?error=link-failed");
  }

  await recordInviteUse(found.inviteId);

  // The Supabase token is created and spent in the same breath, in
  // the landlord's own browser, so its one-hour life never matters.
  redirect(link);
}
