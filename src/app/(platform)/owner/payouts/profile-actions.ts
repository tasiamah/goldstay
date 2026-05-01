"use server";

// Owner-side profile updates for the setup checklist on /owner/payouts.
//
// We keep the schema for what the owner can self-edit deliberately
// narrow: name + phone (Personal) and company name + country
// (Business). Email is the auth principal so we don't expose a way
// to change it from a server action — it has to round-trip through
// admin support, otherwise an account takeover is one form post away.
// Currency is a financial decision tied to the payout method and
// stays admin-controlled for the same reason.

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireOwner } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import {
  flattenZodErrors,
  personFullName,
} from "@/lib/validation/preprocessors";

const PersonalInput = z.object({
  fullName: personFullName,
  phone: z.string().trim().min(4, "Phone is too short").max(40),
  address: z
    .string()
    .trim()
    .min(6, "Please enter a postal address.")
    .max(500),
});

const BusinessInput = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, "Company name is too short")
    .max(120),
  country: z.enum(["KE", "GH"]),
});

export type ProfileActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function updatePersonalDetailsAction(
  _prev: unknown,
  formData: FormData,
): Promise<ProfileActionResult> {
  const { owner } = await requireOwner();
  const actor = { adminId: null, email: owner.email };

  const parsed = PersonalInput.safeParse({
    fullName: formData.get("fullName") ?? "",
    phone: formData.get("phone") ?? "",
    address: formData.get("address") ?? "",
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  await prisma.owner.update({
    where: { id: owner.id },
    data: parsed.data,
  });
  await recordAudit({
    actor,
    entity: "OWNER",
    entityId: owner.id,
    action: "owner.profile.personal_updated",
    summary: "Owner updated personal details",
    metadata: {
      fields: ["fullName", "phone", "address"],
      scope: "owner-self-serve",
    },
  });

  // Both /owner/profile and /owner/payouts render the personal block
  // (or its checklist row), so we revalidate both surfaces.
  revalidatePath("/owner/profile");
  revalidatePath("/owner/payouts");
  return { ok: true };
}

export async function updateBusinessDetailsAction(
  _prev: unknown,
  formData: FormData,
): Promise<ProfileActionResult> {
  const { owner } = await requireOwner();
  const actor = { adminId: null, email: owner.email };

  const parsed = BusinessInput.safeParse({
    companyName: formData.get("companyName") ?? "",
    country: formData.get("country") ?? "",
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  await prisma.owner.update({
    where: { id: owner.id },
    data: parsed.data,
  });
  await recordAudit({
    actor,
    entity: "OWNER",
    entityId: owner.id,
    action: "owner.profile.business_updated",
    summary: "Owner updated business details",
    metadata: {
      fields: ["companyName", "country"],
      scope: "owner-self-serve",
    },
  });

  revalidatePath("/owner/profile");
  revalidatePath("/owner/payouts");
  return { ok: true };
}
