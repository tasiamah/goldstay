"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { currentAuditActor, requireAdmin } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { sendStatementForClient } from "@/lib/statements/send";
import { isValidPeriod } from "@/lib/statements/period";

// Sends the rendered PDF to the client via the same path the cron uses,
// then writes an audit row. The actual Resend / PDF / CommunicationLog
// plumbing lives in sendStatementForClient; we just glue admin auth +
// audit on top.
export async function sendStatementAction(
  clientId: string,
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  const actor = await currentAuditActor();

  const year = Number(formData.get("year"));
  const month = Number(formData.get("month"));
  if (!isValidPeriod({ year, month })) {
    throw new Error("Invalid period");
  }

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: {
      id: true,
      email: true,
      fullName: true,
      companyName: true,
      preferredCurrency: true,
    },
  });
  if (!client) throw new Error("Client not found");

  const result = await sendStatementForClient(client, { year, month });

  await recordAudit({
    actor,
    entity: "CLIENT",
    entityId: client.id,
    action: result.ok
      ? `statement.${result.status}`
      : "statement.send_failed",
    summary: result.ok
      ? `Statement for ${year}-${String(month).padStart(2, "0")} ${result.status}`
      : `Statement send failed: ${result.error.slice(0, 200)}`,
    metadata: { year, month, sendId: result.sendId },
  });

  revalidatePath(`/admin/clients/${clientId}/statement`);
}
