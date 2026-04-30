"use server";

// Server Actions for Owner mutations from the admin surface. Every
// action revalidates the affected paths and re-runs the auth gate so
// a stolen form action token cannot be replayed by a non-admin.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { Country, Prisma } from "@prisma/client";

const OwnerInput = z.object({
  email: z.string().trim().toLowerCase().email(),
  fullName: z.string().trim().min(2, "Name is too short").max(120),
  phone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((v) => (v ? v : undefined)),
  companyName: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((v) => (v ? v : undefined)),
  country: z.nativeEnum(Country),
  preferredCurrency: z
    .string()
    .trim()
    .toUpperCase()
    .min(3)
    .max(3)
    .default("USD"),
});

export type OwnerActionResult =
  | { ok: true; ownerId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function fromForm(formData: FormData) {
  return {
    email: String(formData.get("email") ?? ""),
    fullName: String(formData.get("fullName") ?? ""),
    phone: String(formData.get("phone") ?? "") || undefined,
    companyName: String(formData.get("companyName") ?? "") || undefined,
    country: String(formData.get("country") ?? ""),
    preferredCurrency: String(formData.get("preferredCurrency") ?? "USD"),
  };
}

function flattenZodErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export async function createOwnerAction(
  _prev: OwnerActionResult | null,
  formData: FormData,
): Promise<OwnerActionResult> {
  await requireAdmin();

  const parsed = OwnerInput.safeParse(fromForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  try {
    const owner = await prisma.owner.create({ data: parsed.data });
    revalidatePath("/admin");
    revalidatePath("/admin/owners");
    redirect(`/admin/owners/${owner.id}`);
  } catch (e) {
    // Re-throw the redirect "error" so Next.js can handle it; only
    // catch real DB errors here.
    if ((e as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) {
      throw e;
    }
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return {
        ok: false,
        error: "An owner with that email already exists.",
        fieldErrors: { email: "Already in use" },
      };
    }
    return { ok: false, error: "Could not save the owner. Please retry." };
  }
}

export async function updateOwnerAction(
  ownerId: string,
  _prev: OwnerActionResult | null,
  formData: FormData,
): Promise<OwnerActionResult> {
  await requireAdmin();

  const parsed = OwnerInput.safeParse(fromForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  try {
    await prisma.owner.update({
      where: { id: ownerId },
      data: parsed.data,
    });
    revalidatePath("/admin");
    revalidatePath("/admin/owners");
    revalidatePath(`/admin/owners/${ownerId}`);
    return { ok: true, ownerId };
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return {
        ok: false,
        error: "Another owner already uses that email.",
        fieldErrors: { email: "Already in use" },
      };
    }
    return { ok: false, error: "Could not save changes. Please retry." };
  }
}
