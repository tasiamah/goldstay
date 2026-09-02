// Communication log writer + reader.
//
// Every email / WhatsApp / SMS / phone call in either direction is
// recorded here. Outbound emails through Resend write a row before
// the network call (status=QUEUED) and update on success; manual
// logs (a phone call with the client) are inserted directly with
// status=SENT. The client detail page renders these in a dedicated
// "Communications" tab so anybody picking up the account knows
// exactly what's been said and when.

import { prisma } from "@/lib/db";
import type {
  CommunicationChannel,
  CommunicationDirection,
  CommunicationLog,
  CommunicationStatus,
} from "@prisma/client";
import { recordAudit, type AuditActor } from "@/lib/audit";

export type LogCommunicationInput = {
  clientId: string;
  channel: CommunicationChannel;
  direction: CommunicationDirection;
  subject?: string | null;
  body?: string | null;
  providerId?: string | null;
  status?: CommunicationStatus;
  // Set for manual logs ("ops emailed/called the client") so the audit
  // event is attributed correctly. Null for system-driven sends
  // (welcome email triggered by createClientAction).
  actor?: AuditActor | null;
};

export async function logCommunication(
  input: LogCommunicationInput,
): Promise<CommunicationLog> {
  const log = await prisma.communicationLog.create({
    data: {
      clientId: input.clientId,
      channel: input.channel,
      direction: input.direction,
      subject: input.subject ?? null,
      body: input.body ?? null,
      providerId: input.providerId ?? null,
      status: input.status ?? "SENT",
      sentByAdminId: input.actor?.adminId ?? null,
    },
  });

  if (input.actor) {
    await recordAudit({
      actor: input.actor,
      entity: "CLIENT",
      entityId: input.clientId,
      action: "comms.sent",
      summary: summariseLog(log),
      metadata: { logId: log.id, channel: log.channel },
    });
  }

  return log;
}

export async function updateCommunicationStatus(
  id: string,
  status: CommunicationStatus,
  providerId?: string | null,
): Promise<CommunicationLog> {
  return prisma.communicationLog.update({
    where: { id },
    data: {
      status,
      providerId: providerId ?? undefined,
    },
  });
}

export async function listCommunicationsFor(
  clientId: string,
  limit = 50,
): Promise<CommunicationLog[]> {
  return prisma.communicationLog.findMany({
    where: { clientId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

// ---------- Pure helpers ----------

const CHANNEL_LABEL: Record<CommunicationChannel, string> = {
  EMAIL: "Email",
  WHATSAPP: "WhatsApp",
  CALL: "Phone call",
  SMS: "SMS",
};

const DIRECTION_LABEL: Record<CommunicationDirection, string> = {
  OUTBOUND: "to client",
  INBOUND: "from client",
};

export function summariseLog(
  log: Pick<CommunicationLog, "channel" | "direction" | "subject">,
): string {
  const channel = CHANNEL_LABEL[log.channel];
  const direction = DIRECTION_LABEL[log.direction];
  return log.subject
    ? `${channel} ${direction}: ${log.subject}`
    : `${channel} ${direction}`;
}
