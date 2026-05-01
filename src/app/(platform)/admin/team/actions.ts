"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { currentAuditActor, requireRole } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ALL_ROLES, ROLE_LABEL } from "@/lib/admin/roles";
import { personFullName } from "@/lib/validation/preprocessors";

const RoleEnum = z.enum(ALL_ROLES as readonly [string, ...string[]]);
const CountryEnum = z.enum(["KE", "GH"]);

const InviteInput = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Enter a valid email address." }),
  fullName: personFullName,
  role: RoleEnum,
  country: z.union([CountryEnum, z.literal("")]).optional(),
});

const UpdateInput = z.object({
  fullName: personFullName,
  role: RoleEnum,
  country: z.union([CountryEnum, z.literal("")]).optional(),
});

const DEFAULT_SITE = "https://goldstay.co.ke";

// Adds a new admin row, mints a magic link, and emails it. The
// invite is logged into CommunicationLog as an OWNER-style outbound
// (we reuse the comms log; AdminUser is the pseudo-owner of the
// audit trail) — except CommunicationLog is keyed to ownerId. For
// admins we skip the comms row and rely on the audit + the magic
// link landing in the new admin's inbox.
export async function inviteAdminAction(formData: FormData): Promise<void> {
  const me = await requireRole("admin.write");
  const actor = await currentAuditActor();

  const parsed = InviteInput.safeParse({
    email: formData.get("email"),
    fullName: formData.get("fullName"),
    role: formData.get("role"),
    country: formData.get("country") ?? "",
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const country = parsed.data.country
    ? (parsed.data.country as "KE" | "GH")
    : null;

  const existing = await prisma.adminUser.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) {
    throw new Error("An admin with that email already exists.");
  }

  const created = await prisma.adminUser.create({
    data: {
      email: parsed.data.email,
      fullName: parsed.data.fullName,
      role: parsed.data.role as never,
      country,
    },
  });

  await recordAudit({
    actor,
    entity: "ADMIN_USER",
    entityId: created.id,
    action: "admin.created",
    summary: `${me.email} invited ${created.email} as ${ROLE_LABEL[created.role]}`,
    metadata: {
      role: created.role,
      country: created.country,
    },
  });

  // Best-effort magic link send. Failure here doesn't reverse the
  // invite — the new admin can sign in via /login on next attempt.
  try {
    const supabase = createSupabaseAdminClient();
    const siteUrl = process.env.PUBLIC_SITE_URL || DEFAULT_SITE;
    const redirectTo = new URL(
      "/auth/callback?next=/admin",
      siteUrl,
    ).toString();
    await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: created.email,
      options: { redirectTo },
    });
  } catch (err) {
    console.warn("[team] magic-link generation failed", err);
  }

  revalidatePath("/admin/team");
  redirect(`/admin/team/${created.id}`);
}

export async function updateAdminAction(
  adminId: string,
  formData: FormData,
): Promise<void> {
  await requireRole("admin.write");
  const actor = await currentAuditActor();

  const parsed = UpdateInput.safeParse({
    fullName: formData.get("fullName"),
    role: formData.get("role"),
    country: formData.get("country") ?? "",
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const country = parsed.data.country
    ? (parsed.data.country as "KE" | "GH")
    : null;

  const updated = await prisma.adminUser.update({
    where: { id: adminId },
    data: {
      fullName: parsed.data.fullName,
      role: parsed.data.role as never,
      country,
    },
  });

  await recordAudit({
    actor,
    entity: "ADMIN_USER",
    entityId: updated.id,
    action: "admin.updated",
    summary: `${updated.email} updated to ${ROLE_LABEL[updated.role]}${
      updated.country ? ` (${updated.country})` : ""
    }`,
    metadata: { role: updated.role, country: updated.country },
  });

  revalidatePath("/admin/team");
  revalidatePath(`/admin/team/${adminId}`);
}

export async function archiveAdminAction(adminId: string): Promise<void> {
  const me = await requireRole("admin.write");
  const actor = await currentAuditActor();

  if (adminId === me.id) {
    throw new Error("You can't archive your own account.");
  }

  const updated = await prisma.adminUser.update({
    where: { id: adminId },
    data: { archivedAt: new Date() },
  });

  await recordAudit({
    actor,
    entity: "ADMIN_USER",
    entityId: updated.id,
    action: "admin.archived",
    summary: `${updated.email} archived`,
  });

  revalidatePath("/admin/team");
  redirect("/admin/team");
}

export async function restoreAdminAction(adminId: string): Promise<void> {
  await requireRole("admin.write");
  const actor = await currentAuditActor();

  const updated = await prisma.adminUser.update({
    where: { id: adminId },
    data: { archivedAt: null },
  });

  await recordAudit({
    actor,
    entity: "ADMIN_USER",
    entityId: updated.id,
    action: "admin.restored",
    summary: `${updated.email} restored`,
  });

  revalidatePath("/admin/team");
  revalidatePath(`/admin/team/${adminId}`);
}

