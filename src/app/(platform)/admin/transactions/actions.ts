"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { currentAuditActor } from "@/lib/auth";
import { TransactionInput } from "@/lib/validation/schemas";
import { flattenZodErrors } from "@/lib/validation/preprocessors";
import { recordAudit } from "@/lib/audit";

export type TransactionActionResult =
  | { ok: true; transactionId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function fromForm(formData: FormData) {
  return {
    propertyId: String(formData.get("propertyId") ?? ""),
    leaseId: String(formData.get("leaseId") ?? ""),
    bookingId: String(formData.get("bookingId") ?? ""),
    occurredOn: String(formData.get("occurredOn") ?? ""),
    type: String(formData.get("type") ?? ""),
    direction: String(formData.get("direction") ?? "INFLOW"),
    amount: String(formData.get("amount") ?? ""),
    currency: String(formData.get("currency") ?? "KES"),
    description: String(formData.get("description") ?? ""),
    reference: String(formData.get("reference") ?? ""),
  };
}

export async function createTransactionAction(
  _prev: TransactionActionResult | null,
  formData: FormData,
): Promise<TransactionActionResult> {
  const actor = await currentAuditActor();
  const parsed = TransactionInput.safeParse(fromForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }
  try {
    const created = await prisma.transaction.create({ data: parsed.data });
    await recordAudit({
      actor,
      entity: "TRANSACTION",
      entityId: created.id,
      action: "transaction.created",
      summary: `${created.type} ${created.direction === "INFLOW" ? "+" : "-"}${created.amount} ${created.currency}`,
      metadata: { propertyId: created.propertyId, leaseId: created.leaseId },
    });
    revalidatePath("/admin");
    revalidatePath("/admin/transactions");
    revalidatePath(`/admin/properties/${parsed.data.propertyId}`);
    if (parsed.data.leaseId) {
      revalidatePath(`/admin/leases/${parsed.data.leaseId}`);
    }
    redirect(`/admin/transactions/${created.id}`);
  } catch (e) {
    if ((e as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) {
      throw e;
    }
    return {
      ok: false,
      error: "Could not save the transaction. Please retry.",
    };
  }
}

export async function updateTransactionAction(
  transactionId: string,
  _prev: TransactionActionResult | null,
  formData: FormData,
): Promise<TransactionActionResult> {
  const actor = await currentAuditActor();
  const parsed = TransactionInput.safeParse(fromForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }
  try {
    const updated = await prisma.transaction.update({
      where: { id: transactionId },
      data: parsed.data,
    });
    await recordAudit({
      actor,
      entity: "TRANSACTION",
      entityId: transactionId,
      action: "transaction.updated",
      summary: `${updated.type} ${updated.direction === "INFLOW" ? "+" : "-"}${updated.amount} ${updated.currency}`,
      metadata: { propertyId: updated.propertyId },
    });
    revalidatePath("/admin");
    revalidatePath("/admin/transactions");
    revalidatePath(`/admin/transactions/${transactionId}`);
    revalidatePath(`/admin/properties/${updated.propertyId}`);
    if (updated.leaseId) {
      revalidatePath(`/admin/leases/${updated.leaseId}`);
    }
    return { ok: true, transactionId };
  } catch {
    return { ok: false, error: "Could not save changes. Please retry." };
  }
}

export async function deleteTransactionAction(
  transactionId: string,
): Promise<void> {
  const actor = await currentAuditActor();
  const tx = await prisma.transaction.findUnique({
    where: { id: transactionId },
    select: {
      propertyId: true,
      leaseId: true,
      type: true,
      amount: true,
      currency: true,
    },
  });
  if (!tx) return;
  await prisma.transaction.delete({ where: { id: transactionId } });
  await recordAudit({
    actor,
    entity: "TRANSACTION",
    entityId: transactionId,
    action: "transaction.deleted",
    summary: `${tx.type} ${tx.amount} ${tx.currency} deleted`,
    metadata: { propertyId: tx.propertyId },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/transactions");
  revalidatePath(`/admin/properties/${tx.propertyId}`);
  if (tx.leaseId) revalidatePath(`/admin/leases/${tx.leaseId}`);
  redirect("/admin/transactions");
}
