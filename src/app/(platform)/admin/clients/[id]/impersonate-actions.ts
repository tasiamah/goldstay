"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { currentAuditActor, requireRole } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { mintCallbackLink } from "@/lib/supabase/magic-link";
import { setImpersonationCookie } from "@/lib/admin/impersonation";
import { formatClientDisplayName } from "@/lib/format-client";

const DEFAULT_SITE = "https://goldstay.co.ke";

// Mints a Supabase magic link for the client's email, stamps the
// impersonation cookie, and redirects the admin to a tiny page that
// opens the link in a new tab. We avoid returning the URL to the
// caller because doing so leaks it into the admin's HTML diff.
//
// `impersonate.client` is only granted to OPS / COUNTRY_MANAGER /
// SUPER_ADMIN per the role matrix — SUPPORT and ACCOUNTING were
// previously able to invoke this action because the gate was only
// at the UI layer. The requireRole call closes that hole; the
// button is also conditionally rendered now so the failure mode
// is "no button" rather than "button that throws on submit".
export async function startImpersonationAction(
  clientId: string,
): Promise<void> {
  await requireRole("impersonate.client");
  const actor = await currentAuditActor();

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: {
      id: true,
      email: true,
      fullName: true,
      companyName: true,
    },
  });
  if (!client) {
    throw new Error("Client not found");
  }

  const siteUrl = process.env.PUBLIC_SITE_URL || DEFAULT_SITE;
  // Same token-hash link the welcome email uses. Supabase's own
  // action_link returns its session in a URL fragment the server can
  // never read, so it would land the admin on the "invalid sign-in
  // token" page instead of the client's portal.
  const actionLink = await mintCallbackLink({
    email: client.email,
    siteUrl,
    next: "/client",
  });
  if (!actionLink) {
    throw new Error("Could not mint impersonation link");
  }

  const clientLabel = formatClientDisplayName(client);

  await setImpersonationCookie({
    clientId: client.id,
    clientLabel,
    adminEmail: actor.email,
    startedAt: new Date().toISOString(),
  });

  await recordAudit({
    actor,
    entity: "CLIENT",
    entityId: client.id,
    action: "client.impersonation.started",
    summary: `Started impersonating ${clientLabel}`,
    metadata: { clientEmail: client.email },
  });

  // Hand off to a tiny launcher page that pops the magic link in a
  // new tab. We use a query param rather than a redirect so the URL
  // never lands in the admin's browser history as an action.
  redirect(
    `/admin/clients/${client.id}/impersonate/launch?token=${encodeURIComponent(
      actionLink,
    )}`,
  );
}

export async function stopImpersonationAction(): Promise<void> {
  const actor = await currentAuditActor();
  const { clearImpersonationCookie, readImpersonationCookie } = await import(
    "@/lib/admin/impersonation"
  );
  const cookie = await readImpersonationCookie();
  await clearImpersonationCookie();
  if (cookie) {
    await recordAudit({
      actor,
      entity: "CLIENT",
      entityId: cookie.clientId,
      action: "client.impersonation.stopped",
      summary: `Stopped impersonating ${cookie.clientLabel}`,
    });
  }
  redirect("/admin");
}
