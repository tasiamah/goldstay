"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { LeaseStatus, UnitStatus } from "@prisma/client";

const optionalString = z
  .preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().trim().optional(),
  )
  .optional();

const optionalDecimal = z.preprocess((v) => {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  if (t === "") return undefined;
  const n = Number(t);
  return Number.isFinite(n) ? n : NaN;
}, z.number().min(0).optional());

const requiredDate = z.preprocess((v) => {
  if (typeof v !== "string" || v.trim() === "") return undefined;
  const d = new Date(v);
  return isNaN(d.getTime()) ? NaN : d;
}, z.date());

const optionalDate = z.preprocess((v) => {
  if (typeof v !== "string" || v.trim() === "") return undefined;
  const d = new Date(v);
  return isNaN(d.getTime()) ? NaN : d;
}, z.date().optional());

const LeaseInput = z.object({
  unitId: z.string().min(1),
  tenantName: z.string().trim().min(2).max(120),
  tenantEmail: z
    .preprocess(
      (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
      z.string().email().optional(),
    )
    .optional(),
  tenantPhone: optionalString,
  startDate: requiredDate,
  endDate: optionalDate,
  monthlyRent: z.preprocess(
    (v) => (typeof v === "string" ? Number(v) : v),
    z.number().min(0),
  ),
  currency: z.string().trim().toUpperCase().min(3).max(3).default("KES"),
  depositAmount: optionalDecimal,
  status: z.nativeEnum(LeaseStatus).default("ACTIVE"),
  notes: optionalString,
});

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

function flattenZodErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
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
    const lease = await prisma.$transaction(async (tx) => {
      const created = await tx.lease.create({ data: parsed.data });
      // Auto-flip the unit to OCCUPIED if the new lease is active.
      if (parsed.data.status === "ACTIVE") {
        await tx.unit.update({
          where: { id: parsed.data.unitId },
          data: { status: UnitStatus.OCCUPIED },
        });
      }
      return created;
    });

    revalidatePath("/admin");
    revalidatePath(`/admin/units/${parsed.data.unitId}`);
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
    const updated = await prisma.lease.update({
      where: { id: leaseId },
      data: rest,
    });
    revalidatePath("/admin");
    revalidatePath(`/admin/leases/${leaseId}`);
    revalidatePath(`/admin/units/${updated.unitId}`);
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
  revalidatePath(`/admin/units/${lease.unitId}`);
}
