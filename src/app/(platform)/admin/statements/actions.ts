"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { currentAuditActor, requireAdmin } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { sendStatementForClient } from "@/lib/statements/send";
import { eligibleStatementClients } from "@/lib/statements/review";
import { isValidPeriod } from "@/lib/statements/period";

export type SendResult = { ok: boolean; message: string };

// Sending one client's statement from the month-end list. Same
// function the per-client preview and the old cron used, so there is
// one implementation of what a statement send is.
export async function sendOneAction(
  clientId: string,
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  const period = periodFrom(formData);

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

  const result = await sendStatementForClient(client, period);

  await recordAudit({
    actor: await currentAuditActor(),
    entity: "CLIENT",
    entityId: client.id,
    action: result.ok ? `statement.${result.status}` : "statement.send_failed",
    summary: result.ok
      ? `Statement for ${label(period)} ${result.status}`
      : `Statement send failed: ${result.error.slice(0, 200)}`,
    metadata: { ...period, sendId: result.sendId },
  });

  revalidatePath("/admin/statements");
}

// Sends every statement for the period that has not gone yet.
//
// Deliberately skips empty months rather than sending a cover with
// nothing in it. An empty statement is the shape a broken feed makes,
// and the whole point of this screen is to stop those going out
// without someone having looked. They can still be sent one at a time
// from the row, which is a deliberate act on a specific client.
export async function sendAllAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const actor = await currentAuditActor();
  const period = periodFrom(formData);

  const clients = await eligibleStatementClients(prisma);
  const sent = await prisma.statementSend.findMany({
    where: {
      periodYear: period.year,
      periodMonth: period.month,
      status: { in: ["SENT", "DELIVERED"] },
    },
    select: { clientId: true },
  });
  const alreadySent = new Set(sent.map((s) => s.clientId));

  // The empty check is a count rather than a full assemble: this is
  // the same question assembleStatement answers with isEmpty, asked
  // without rendering anything.
  let succeeded = 0;
  let failed = 0;
  for (const client of clients) {
    if (alreadySent.has(client.id)) continue;
    if (await isEmptyPeriod(client.id, period)) continue;

    const result = await sendStatementForClient(client, period);
    if (result.ok) succeeded += 1;
    else failed += 1;
  }

  await recordAudit({
    actor,
    entity: "CLIENT",
    entityId: "bulk",
    action: "statement.bulk_sent",
    summary: `Sent ${succeeded} statements for ${label(period)}${
      failed > 0 ? `, ${failed} failed` : ""
    }`,
    metadata: { ...period, succeeded, failed },
  });

  revalidatePath("/admin/statements");
}

async function isEmptyPeriod(
  clientId: string,
  period: { year: number; month: number },
): Promise<boolean> {
  const start = new Date(Date.UTC(period.year, period.month - 1, 1));
  const end = new Date(Date.UTC(period.year, period.month, 1));

  const [transactions, bookings] = await Promise.all([
    prisma.transaction.count({
      where: {
        occurredOn: { gte: start, lt: end },
        property: { clientId },
        archivedAt: null,
      },
    }),
    prisma.booking.count({
      where: {
        property: { clientId },
        status: { not: "CANCELLED" },
        checkIn: { lt: end },
        checkOut: { gt: start },
      },
    }),
  ]);
  return transactions === 0 && bookings === 0;
}

function periodFrom(formData: FormData): { year: number; month: number } {
  const year = Number(formData.get("year"));
  const month = Number(formData.get("month"));
  if (!isValidPeriod({ year, month })) throw new Error("Invalid period");
  return { year, month };
}

function label(period: { year: number; month: number }): string {
  return `${period.year}-${String(period.month).padStart(2, "0")}`;
}
