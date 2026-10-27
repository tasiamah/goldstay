"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { sendClientWelcomeEmail } from "@/lib/client-welcome";
import {
  lookupInvite,
  mintedRecentlyFor,
  recordInviteUse,
  RESEND_COOLDOWN_MS,
} from "@/lib/clients/invite";
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

// "My link expired, send me a new one."
//
// The expired token still identifies its owner, so this needs no
// email box and cannot be used to discover whether an address is a
// Goldstay client: an unknown token gets no button at all.
//
// It is safe to let whoever holds the expired link press this, because
// the new link goes to the landlord's own address rather than to
// whoever clicked. The worst an outsider achieves is causing an email
// they cannot read, which is the same bargain every "forgot password"
// form in the world makes.
export async function requestNewLinkAction(formData: FormData): Promise<void> {
  const token = String(formData.get("token") ?? "");
  const back = `/welcome/${encodeURIComponent(token)}`;

  const found = await lookupInvite(token);

  // Only an expired invite earns a replacement. "retired" means they
  // already have a password, and "unknown" means we have no idea who
  // to send it to.
  if (found.status !== "expired") {
    redirect(back);
  }

  // Already sent one a moment ago: say so rather than sending again.
  // This is what makes a double-click, or a second person opening the
  // same forwarded email, harmless.
  if (await mintedRecentlyFor(found.client.id, RESEND_COOLDOWN_MS)) {
    redirect(`${back}?sent=1`);
  }

  const client = await prisma.client.findUnique({
    where: { id: found.client.id },
    select: {
      email: true,
      fullName: true,
      companyName: true,
      country: true,
    },
  });
  if (!client) redirect(back);

  await sendClientWelcomeEmail({
    ...client,
    clientId: found.client.id,
    // No actor: nobody at Goldstay did this, the landlord did. The
    // audit trail attributes it to the system rather than inventing
    // an operator who was not involved.
    actor: null,
    tone: "self-requested",
  });

  redirect(`${back}?sent=1`);
}
