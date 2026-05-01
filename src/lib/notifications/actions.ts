"use server";

// Server actions for the owner notification bell. Two surfaces:
//
//   * markAllNotificationsReadAction — called when the owner opens
//     the bell. We mark every still-unread, unresolved notification
//     as read in one go. The dropdown stays visible afterwards so
//     the owner can scan + act; only the bell badge clears.
//
//   * dismissNotificationAction — called from a per-row "×" so the
//     owner can hide a specific item without opening the link.
//     Dismissing flips resolvedAt, which removes the row from
//     listOwnerNotifications. If the underlying condition is still
//     true on the next sync (e.g. setup is still incomplete), we
//     re-create the row — that's intentional, the bell shouldn't
//     lie about open work.

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireOwner } from "@/lib/auth";

export async function markAllNotificationsReadAction(): Promise<void> {
  const { owner } = await requireOwner();
  await prisma.ownerNotification.updateMany({
    where: { ownerId: owner.id, readAt: null, resolvedAt: null },
    data: { readAt: new Date() },
  });
  // The bell renders inside the owner layout, so we revalidate
  // every page where it would be visible. /owner is the most
  // important — the dashboard renders the same data behind the
  // bell so a refresh keeps everything consistent.
  revalidatePath("/owner");
}

export async function dismissNotificationAction(
  notificationId: string,
): Promise<void> {
  const { owner } = await requireOwner();
  // Scoped delete: only the owner's own rows. We don't trust the
  // client-provided id past this filter — Prisma will silently
  // no-op if a malicious owner tries to dismiss someone else's row.
  await prisma.ownerNotification.updateMany({
    where: { id: notificationId, ownerId: owner.id, resolvedAt: null },
    data: { resolvedAt: new Date(), readAt: new Date() },
  });
  revalidatePath("/owner");
}
