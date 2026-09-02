// Read-side for the client notification bell.
//
// One round-trip returns: the active (unresolved) notifications to
// render, plus the unread-count for the bell badge. Sorted with
// WARNING ahead of INFO/SUCCESS so a "you must act" item never
// hides under a friendly "your statement is ready" row.

import { prisma } from "@/lib/db";
import type { ClientNotification } from "@prisma/client";

const TONE_PRIORITY: Record<string, number> = {
  WARNING: 0,
  INFO: 1,
  SUCCESS: 2,
};

export type ClientNotificationListing = {
  items: ClientNotification[];
  unreadCount: number;
};

export async function listClientNotifications(
  clientId: string,
  opts?: { limit?: number },
): Promise<ClientNotificationListing> {
  const limit = opts?.limit ?? 8;
  const items = await prisma.clientNotification.findMany({
    where: { clientId, resolvedAt: null },
    // Pull a few extra so the in-memory tone sort doesn't leave a
    // gap when there are more than `limit` rows. We slice to limit
    // after sorting.
    orderBy: { createdAt: "desc" },
    take: Math.max(limit * 2, limit),
  });

  items.sort((a, b) => {
    const t = TONE_PRIORITY[a.tone] - TONE_PRIORITY[b.tone];
    if (t !== 0) return t;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const sliced = items.slice(0, limit);
  const unreadCount = sliced.filter((n) => n.readAt === null).length;
  return { items: sliced, unreadCount };
}
