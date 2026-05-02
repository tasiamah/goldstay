// Auth helpers used by Server Components and Server Actions to gate
// platform routes. Pure server module; never import from the browser.
//
// As of Phase A.3, admin access is DB-backed via the AdminUser table.
// The env-only allowlist (ADMIN_EMAILS) and the goldstay corporate
// domains still drive *bootstrap* — the first time an allowlisted
// email signs in, we provision an AdminUser row for them — but every
// subsequent decision (role, country scope, archive, last-login)
// reads from the DB. This means an outsourced contractor can be
// granted SUPPORT and revoked again without redeploying the app.

import { cache } from "react";
import { redirect } from "next/navigation";
import type { AdminUser, Owner } from "@prisma/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { isAdminEmail } from "@/lib/admin-allowlist";
import {
  can,
  canForCountry,
  type AdminAction,
} from "@/lib/admin/roles";

export { isAdminEmail };

// Wrapped in React `cache` so that within a single render pass the
// Supabase JWT is validated exactly once. Without this the layout
// (`requireUser`), the page (`requireOwner` -> `requireUser`) and
// any nested helper each fired their own getUser() round-trip,
// stacking ~150–400ms apiece on the post-magic-link cold landing.
// `cache` keys on the call's arguments — there are none here, so
// every caller in the same request hits the same memoized promise.
export const getCurrentUser = cache(async () => {
  // Supabase's getUser() can throw on transient network blips,
  // malformed cookies, or missing env vars. We mirror the
  // defensive try/catch from src/lib/supabase/middleware.ts so
  // an exception here doesn't propagate up to the platform error
  // boundary and render the generic "Something went wrong" UI to
  // a logged-out visitor — they should just be sent to /login.
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

// Resolves the AdminUser row for the logged-in Supabase user, auto-
// provisioning on first login from the env / corporate-domain
// allowlist. Bumps lastLoginAt on every refresh so the team page can
// show "active 2 days ago".
//
// Redirects to /owner if:
//   * the user has no email (impossible for magic-link, defensive)
//   * the email isn't allowlisted AND has no existing AdminUser row
//   * the AdminUser row is archived
export async function requireAdmin(): Promise<AdminUser> {
  const user = await requireUser();
  const email = (user.email ?? "").toLowerCase();
  if (!email) redirect("/owner");

  let admin = await prisma.adminUser.findUnique({ where: { email } });

  if (!admin) {
    // Bootstrap path: an allowlisted email has signed in before any
    // AdminUser row was created for them. Provision now. The first
    // such row gets SUPER_ADMIN so the founder isn't immediately
    // locked out of the team-management page.
    if (!isAdminEmail(email)) redirect("/owner");
    admin = await provisionAdmin(email, user.id);
  } else if (admin.archivedAt) {
    redirect("/owner");
  }

  // Update authUserId on first login + bump lastLoginAt at most
  // once per minute to avoid hammering the DB on rapid navigation.
  // The bump is best-effort: a transient DB hiccup here must not
  // take down the entire admin surface, so we swallow the error
  // and return the row we already have. The next refresh will
  // retry on its own.
  const STALE_AFTER_MS = 60 * 1000;
  const needsAuthUserId = admin.authUserId !== user.id;
  const stale =
    !admin.lastLoginAt ||
    Date.now() - admin.lastLoginAt.getTime() > STALE_AFTER_MS;
  if (needsAuthUserId || stale) {
    try {
      admin = await prisma.adminUser.update({
        where: { id: admin.id },
        data: {
          authUserId: user.id,
          lastLoginAt: new Date(),
        },
      });
    } catch {
      // Stick with the unbumped row. Auth still works; the
      // "active 2 days ago" indicator may lag by one navigation.
    }
  }

  return admin;
}

// Bootstrap a new AdminUser from an allowlisted login. SUPER_ADMIN
// for the very first row, OPS thereafter. The team page is the
// proper way to add subsequent admins; this path only fires for the
// founders + people whose @goldstay.* email logs in before they've
// been added explicitly.
async function provisionAdmin(
  email: string,
  authUserId: string,
): Promise<AdminUser> {
  const existingCount = await prisma.adminUser.count();
  return prisma.adminUser.create({
    data: {
      email,
      fullName: deriveNameFromEmail(email),
      authUserId,
      role: existingCount === 0 ? "SUPER_ADMIN" : "OPS",
    },
  });
}

function deriveNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  if (local.length === 0) return email;
  // "kwame.mensah" → "Kwame Mensah", "ops" → "Ops"
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p[0]!.toUpperCase() + p.slice(1))
    .join(" ");
}

// Higher-level admin gate: ensures the current admin can perform
// the named action (and optionally the target country, for
// COUNTRY_MANAGER). Redirects if not. Use this in any server action
// where the action key meaningfully differs from a blanket admin.
//
// On denial we redirect to /admin?denied=<action> (URL-encoded) so
// the overview page can render a friendly explanatory banner with
// the action key — much better than the previous silent bounce
// that made permission-gated routes feel broken to new hires.
// Server actions inherit the same UX: if a SUPPORT user submits
// a form behind impersonate.owner they land on the overview with
// a clear "you don't have access to..." message instead of just
// an unexplained jump.
export async function requireRole(
  action: AdminAction,
  targetCountry: AdminUser["country"] | null = null,
): Promise<AdminUser> {
  const admin = await requireAdmin();
  const ok = canForCountry(admin.role, action, admin.country, targetCountry);
  if (!ok) redirect(`/admin?denied=${encodeURIComponent(action)}`);
  return admin;
}

// Boolean check, no redirect. Useful in server components that want
// to conditionally render an action button.
export async function adminCan(
  action: AdminAction,
  targetCountry: AdminUser["country"] | null = null,
): Promise<boolean> {
  const admin = await requireAdmin();
  return canForCountry(admin.role, action, admin.country, targetCountry);
}

// Shorter alias re-exported for callers that just want the matrix.
export { can };

// Resolves the AuditActor used by recordAudit / addNote / createTask
// from the current admin session.
export type CurrentActor = {
  adminId: string | null;
  email: string;
};

export async function currentAuditActor(): Promise<CurrentActor> {
  const admin = await requireAdmin();
  return { adminId: admin.id, email: admin.email };
}

// Resolves the Owner row for the logged-in Supabase user. Owner rows
// are created by an admin during onboarding; we look up by authUserId
// first (set when the owner first logs in) and fall back to email
// match so the very first login automatically claims their record.
// Owner row for the currently logged-in user, or null if there's no
// match (signed-in Supabase user but no Owner record in our DB).
//
// Wrapped in React `cache` so the layout's lookup, the page's
// requireOwner() and any other helper that needs the owner all
// share a single Prisma round-trip per request. Without this the
// dashboard was doing 2–4 separate Owner queries on every render.
//
// We do the lookup as one `findFirst({ OR: [authUserId, email] })`
// rather than two sequential `findUnique` calls so the common
// "first sign-in after invite" path is one DB hop instead of two.
// The best-effort claim that binds authUserId to the owner row
// only fires when the row was email-matched and has no authUserId
// yet — same behaviour as before, just folded into the helper.
export const getCurrentOwner = cache(async (): Promise<Owner | null> => {
  const user = await getCurrentUser();
  if (!user) return null;

  const email = user.email ?? null;

  const owner = email
    ? await prisma.owner.findFirst({
        where: {
          OR: [{ authUserId: user.id }, { email }],
        },
      })
    : await prisma.owner.findUnique({ where: { authUserId: user.id } });

  if (!owner) return null;

  // First sign-in: bind the auth user id to the owner row so future
  // lookups hit the indexed path directly. Best-effort and silent —
  // a transient failure just means we'll retry on the next visit.
  if (!owner.authUserId || owner.authUserId !== user.id) {
    try {
      const claimed = await prisma.owner.update({
        where: { id: owner.id },
        data: { authUserId: user.id },
      });
      return claimed;
    } catch {
      // Return the unclaimed row; the page can still render off it.
    }
  }
  return owner;
});

export async function requireOwner() {
  const user = await requireUser();
  const owner = await getCurrentOwner();
  if (!owner) {
    // Logged in but not yet an owner in our DB. Send them somewhere
    // safe; the page itself decides what to show.
    redirect("/owner/pending");
  }
  return { user, owner };
}
