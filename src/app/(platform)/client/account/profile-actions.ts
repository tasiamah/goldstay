"use server";

// Client-side profile updates for the consolidated "Your details" step
// of the setup checklist. We collapsed the previous Personal +
// Business actions into a single updateYourDetailsAction because the
// two forms always shipped together and a single round-trip means we
// can validate the entityType/companyName interlock atomically.
//
// What the client can self-edit: name, phone, address, entity type,
// company name (only when entityType === COMPANY), company
// registration number (always optional), and country. Email stays
// admin-controlled — it's the auth principal, so a self-serve change
// here would be a one-click account-takeover. Currency is a financial
// decision tied to the payout method and is also admin-controlled.

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireClient } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import {
  flattenZodErrors,
  personFullName,
} from "@/lib/validation/preprocessors";

const YourDetailsInput = z
  .object({
    fullName: personFullName,
    phone: z.string().trim().min(4, "Phone is too short").max(40),
    address: z
      .string()
      .trim()
      .min(6, "Please enter a postal address.")
      .max(500),
    entityType: z.enum(["INDIVIDUAL", "COMPANY"]),
    // Always allow a value through, even when entityType is INDIVIDUAL,
    // so toggling back and forth doesn't wipe the company name in the
    // DB. The COMPANY-mode required-ness is enforced via .superRefine
    // below so we get a precise field-scoped error.
    companyName: z
      .string()
      .trim()
      .max(120)
      .optional()
      .transform((v) => (v && v.length > 0 ? v : null)),
    companyRegistrationNumber: z
      .string()
      .trim()
      .max(64)
      .optional()
      .transform((v) => (v && v.length > 0 ? v : null)),
    country: z.enum(["KE", "GH"]),
  })
  .superRefine((val, ctx) => {
    if (val.entityType === "COMPANY" && !val.companyName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["companyName"],
        message: "Company name is required when letting through a company.",
      });
    }
  });

export type ProfileActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function updateYourDetailsAction(
  _prev: unknown,
  formData: FormData,
): Promise<ProfileActionResult> {
  const { client } = await requireClient();
  const actor = { adminId: null, email: client.email };

  const parsed = YourDetailsInput.safeParse({
    fullName: formData.get("fullName") ?? "",
    phone: formData.get("phone") ?? "",
    address: formData.get("address") ?? "",
    entityType: formData.get("entityType") ?? "INDIVIDUAL",
    companyName: formData.get("companyName") ?? "",
    companyRegistrationNumber:
      formData.get("companyRegistrationNumber") ?? "",
    country: formData.get("country") ?? client.country,
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  await prisma.client.update({
    where: { id: client.id },
    data: parsed.data,
  });
  await recordAudit({
    actor,
    entity: "CLIENT",
    entityId: client.id,
    action: "client.profile.details_updated",
    summary: "Client updated profile details",
    metadata: {
      fields: [
        "fullName",
        "phone",
        "address",
        "entityType",
        "companyName",
        "companyRegistrationNumber",
        "country",
      ],
      entityType: parsed.data.entityType,
      scope: "client-self-serve",
    },
  });

  // /client/account renders the details form and the dashboard
  // surfaces the same checklist banner, so revalidate both. The
  // legacy /client/profile and /client/payouts paths just redirect
  // and don't hold cached output worth busting.
  revalidatePath("/client");
  revalidatePath("/client/account");
  return { ok: true };
}
