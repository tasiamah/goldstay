"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { currentAuditActor, requireRole } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { setImpersonationCookie } from "@/lib/admin/impersonation";
import { formatOwnerDisplayName } from "@/lib/format-owner";

const DEFAULT_SITE = "https://goldstay.co.ke";

// Mints a Supabase magic link for the owner's email, stamps the
// impersonation cookie, and redirects the admin to a tiny page that
// opens the link in a new tab. We avoid returning the URL to the
// caller because doing so leaks it into the admin's HTML diff.
//
// `impersonate.owner` is only granted to OPS / COUNTRY_MANAGER /
// SUPER_ADMIN per the role matrix — SUPPORT and ACCOUNTING were
// previously able to invoke this action because the gate was only
// at the UI layer. The requireRole call closes that hole; the
// button is also conditionally rendered now so the failure mode
// is "no button" rather than "button that throws on submit".
export async function startImpersonationAction(
  ownerId: string,
): Promise<void> {
  await requireRole("impersonate.owner");
  const actor = await currentAuditActor();

  const owner = await prisma.owner.findUnique({
    where: { id: ownerId },
    select: {
      id: true,
      email: true,
      fullName: true,
      companyName: true,
    },
  });
  if (!owner) {
    throw new Error("Owner not found");
  }

  const supabase = createSupabaseAdminClient();
  const siteUrl = process.env.PUBLIC_SITE_URL || DEFAULT_SITE;
  const redirectTo = new URL("/auth/callback?next=/owner", siteUrl).toString();
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email: owner.email,
    options: { redirectTo },
  });
  if (error || !data?.properties?.action_link) {
    throw new Error(
      `Could not mint impersonation link: ${error?.message ?? "no link returned"}`,
    );
  }

  const ownerLabel = formatOwnerDisplayName(owner);

  await setImpersonationCookie({
    ownerId: owner.id,
    ownerLabel,
    adminEmail: actor.email,
    startedAt: new Date().toISOString(),
  });

  await recordAudit({
    actor,
    entity: "OWNER",
    entityId: owner.id,
    action: "owner.impersonation.started",
    summary: `Started impersonating ${ownerLabel}`,
    metadata: { ownerEmail: owner.email },
  });

  // Hand off to a tiny launcher page that pops the magic link in a
  // new tab. We use a query param rather than a redirect so the URL
  // never lands in the admin's browser history as an action.
  redirect(
    `/admin/owners/${owner.id}/impersonate/launch?token=${encodeURIComponent(
      data.properties.action_link,
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
      entity: "OWNER",
      entityId: cookie.ownerId,
      action: "owner.impersonation.stopped",
      summary: `Stopped impersonating ${cookie.ownerLabel}`,
    });
  }
  redirect("/admin");
}
