"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { currentAuditActor, requireAdmin } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { sendStatementForOwner } from "@/lib/statements/send";
import { isValidPeriod } from "@/lib/statements/period";

// Sends the rendered PDF to the owner via the same path the cron uses,
// then writes an audit row. The actual Resend / PDF / CommunicationLog
// plumbing lives in sendStatementForOwner; we just glue admin auth +
// audit on top.
export async function sendStatementAction(
  ownerId: string,
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  const actor = await currentAuditActor();

  const year = Number(formData.get("year"));
  const month = Number(formData.get("month"));
  if (!isValidPeriod({ year, month })) {
    throw new Error("Invalid period");
  }

  const owner = await prisma.owner.findUnique({
    where: { id: ownerId },
    select: {
      id: true,
      email: true,
      fullName: true,
      companyName: true,
      preferredCurrency: true,
    },
  });
  if (!owner) throw new Error("Owner not found");

  const result = await sendStatementForOwner(owner, { year, month });

  await recordAudit({
    actor,
    entity: "OWNER",
    entityId: owner.id,
    action: result.ok
      ? `statement.${result.status}`
      : "statement.send_failed",
    summary: result.ok
      ? `Statement for ${year}-${String(month).padStart(2, "0")} ${result.status}`
      : `Statement send failed: ${result.error.slice(0, 200)}`,
    metadata: { year, month, sendId: result.sendId },
  });

  revalidatePath(`/admin/owners/${ownerId}/statement`);
}
