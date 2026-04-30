"use server";

// Server Actions for Owner mutations from the admin surface. Every
// action revalidates the affected paths and re-runs the auth gate so
// a stolen form action token cannot be replayed by a non-admin.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { OwnerInput } from "@/lib/validation/schemas";
import { flattenZodErrors } from "@/lib/validation/preprocessors";

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
