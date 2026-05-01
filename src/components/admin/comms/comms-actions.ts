"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { logCommunication } from "@/lib/comms";
import { currentAuditActor } from "@/lib/auth";

const ChannelEnum = z.enum(["EMAIL", "WHATSAPP", "CALL", "SMS"]);
const DirectionEnum = z.enum(["OUTBOUND", "INBOUND"]);

const ManualLogInput = z.object({
  ownerId: z.string().min(1),
  channel: ChannelEnum,
  direction: DirectionEnum,
  subject: z.string().max(200).optional(),
  body: z.string().max(5000).optional(),
});

// Manual "I just called the owner" / "they emailed me back" entry.
// Bound from the comms tab on the owner detail page; goes through
// logCommunication which writes the row + a paired audit event.
export async function logManualCommAction(
  ownerId: string,
  returnPath: string,
  formData: FormData,
): Promise<void> {
  const actor = await currentAuditActor();
  const parsed = ManualLogInput.safeParse({
    ownerId,
    channel: String(formData.get("channel") ?? "CALL"),
    direction: String(formData.get("direction") ?? "OUTBOUND"),
    subject: String(formData.get("subject") ?? "") || undefined,
    body: String(formData.get("body") ?? "") || undefined,
  });
  if (!parsed.success) return;
  await logCommunication({
    ownerId: parsed.data.ownerId,
    channel: parsed.data.channel,
    direction: parsed.data.direction,
    subject: parsed.data.subject ?? null,
    body: parsed.data.body ?? null,
    status: "SENT",
    actor,
  });
  revalidatePath(returnPath);
}
