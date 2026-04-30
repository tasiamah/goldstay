"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { LeaseStatus, UnitStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { LeaseInput } from "@/lib/validation/schemas";
import { flattenZodErrors } from "@/lib/validation/preprocessors";

export type LeaseActionResult =
  | { ok: true; leaseId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function fromForm(formData: FormData) {
  return {
    unitId: String(formData.get("unitId") ?? ""),
    tenantName: String(formData.get("tenantName") ?? ""),
    tenantEmail: String(formData.get("tenantEmail") ?? ""),
    tenantPhone: String(formData.get("tenantPhone") ?? ""),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
    monthlyRent: String(formData.get("monthlyRent") ?? ""),
    currency: String(formData.get("currency") ?? "KES"),
    depositAmount: String(formData.get("depositAmount") ?? ""),
    status: String(formData.get("status") ?? "ACTIVE"),
    notes: String(formData.get("notes") ?? ""),
  };
}

export async function createLeaseAction(
  _prev: LeaseActionResult | null,
  formData: FormData,
): Promise<LeaseActionResult> {
  await requireAdmin();
  const parsed = LeaseInput.safeParse(fromForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  try {
    // We deliberately do NOT promote the property's status here.
    // Property lifecycle (Onboarding → Active) is gated by a human
    // doc-review step on the property detail page, not by lease
    // creation. A lease can be drafted before paperwork is final.
    const { lease, propertyId } = await prisma.$transaction(async (tx) => {
      const created = await tx.lease.create({ data: parsed.data });

      if (parsed.data.status === "ACTIVE") {
        await tx.unit.update({
          where: { id: parsed.data.unitId },
          data: { status: UnitStatus.OCCUPIED },
        });
      }

      const unit = await tx.unit.findUnique({
        where: { id: parsed.data.unitId },
        select: { propertyId: true },
      });

      return { lease: created, propertyId: unit?.propertyId ?? null };
    });

    revalidatePath("/admin");
    if (propertyId) {
      revalidatePath(`/admin/properties/${propertyId}`);
    }
    redirect(`/admin/leases/${lease.id}`);
  } catch (e) {
    if ((e as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) {
      throw e;
    }
    return { ok: false, error: "Could not save the lease. Please retry." };
  }
}

export async function updateLeaseAction(
  leaseId: string,
  _prev: LeaseActionResult | null,
  formData: FormData,
): Promise<LeaseActionResult> {
  await requireAdmin();
  const parsed = LeaseInput.safeParse(fromForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }
  try {
    const { unitId: _u, ...rest } = parsed.data;
    await prisma.lease.update({
      where: { id: leaseId },
      data: rest,
    });
    revalidatePath("/admin");
    revalidatePath(`/admin/leases/${leaseId}`);
    return { ok: true, leaseId };
  } catch {
    return { ok: false, error: "Could not save changes. Please retry." };
  }
}

// Quick-action: end an active lease today. Sets endDate=now, status=ENDED,
// and frees the unit. Used from the lease detail page.
export async function endLeaseAction(leaseId: string): Promise<void> {
  await requireAdmin();
  const lease = await prisma.lease.findUnique({
    where: { id: leaseId },
    select: { unitId: true },
  });
  if (!lease) return;

  await prisma.$transaction([
    prisma.lease.update({
      where: { id: leaseId },
      data: { status: LeaseStatus.ENDED, endDate: new Date() },
    }),
    prisma.unit.update({
      where: { id: lease.unitId },
      data: { status: UnitStatus.VACANT },
    }),
  ]);

  revalidatePath("/admin");
  revalidatePath(`/admin/leases/${leaseId}`);
}
