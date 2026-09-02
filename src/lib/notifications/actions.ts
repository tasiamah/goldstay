"use server";

// Server actions for the client notification bell. Two surfaces:
//
//   * markAllNotificationsReadAction — called when the client opens
//     the bell. We mark every still-unread, unresolved notification
//     as read in one go. The dropdown stays visible afterwards so
//     the client can scan + act; only the bell badge clears.
//
//   * dismissNotificationAction — called from a per-row "×" so the
//     client can hide a specific item without opening the link.
//     Dismissing flips resolvedAt, which removes the row from
//     listClientNotifications. If the underlying condition is still
//     true on the next sync (e.g. setup is still incomplete), we
//     re-create the row — that's intentional, the bell shouldn't
//     lie about open work.

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireClient } from "@/lib/auth";

export async function markAllNotificationsReadAction(): Promise<void> {
  const { client } = await requireClient();
  await prisma.clientNotification.updateMany({
    where: { clientId: client.id, readAt: null, resolvedAt: null },
    data: { readAt: new Date() },
  });
  // The bell renders inside the client layout, so we revalidate
  // every page where it would be visible. /client is the most
  // important — the dashboard renders the same data behind the
  // bell so a refresh keeps everything consistent.
  revalidatePath("/client");
}

export async function dismissNotificationAction(
  notificationId: string,
): Promise<void> {
  const { client } = await requireClient();
  // Scoped delete: only the client's own rows. We don't trust the
  // client-provided id past this filter — Prisma will silently
  // no-op if a malicious client tries to dismiss someone else's row.
  await prisma.clientNotification.updateMany({
    where: { id: notificationId, clientId: client.id, resolvedAt: null },
    data: { resolvedAt: new Date(), readAt: new Date() },
  });
  revalidatePath("/client");
}
