// Owner notifications bell — sits in the owner layout header.
//
// Pure CSS popover via <details>/<summary> (same pattern as
// HelpHint) so the bell works without any client JavaScript. The
// "mark all read" button is wrapped in a server-action <form>; the
// per-row dismiss button is the same. Pages re-render after either
// action via revalidatePath("/owner").
//
// The bell badge surfaces the unread count, capped at "9+" so a
// neglected account doesn't blow up the layout. WARNING-tone items
// are sorted ahead of INFO/SUCCESS by listOwnerNotifications so a
// "you must act" item never sits below "your statement is ready".

import { Bell, X } from "lucide-react";
import Link from "next/link";
import type { OwnerNotification } from "@prisma/client";
import {
  dismissNotificationAction,
  markAllNotificationsReadAction,
} from "@/lib/notifications/actions";

const TONE_DOT: Record<OwnerNotification["tone"], string> = {
  WARNING: "bg-amber-500",
  SUCCESS: "bg-emerald-500",
  INFO: "bg-stone-400",
};

export function NotificationBell({
  items,
  unreadCount,
}: {
  items: OwnerNotification[];
  unreadCount: number;
}) {
  const hasItems = items.length > 0;
  const badge =
    unreadCount === 0 ? null : unreadCount > 9 ? "9+" : String(unreadCount);

  return (
    <details className="group relative">
      <summary
        className="relative flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-md border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 [&::-webkit-details-marker]:hidden"
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
      >
        <Bell aria-hidden className="h-4 w-4" />
        {badge ? (
          <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-600 px-1 text-[10px] font-semibold text-white">
            {badge}
          </span>
        ) : null}
      </summary>

      <div className="absolute right-0 z-30 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-stone-200 bg-white shadow-lg">
        <header className="flex items-center justify-between gap-3 border-b border-stone-100 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-stone-900">Notifications</p>
            <p className="text-xs text-stone-500">
              {hasItems
                ? unreadCount > 0
                  ? `${unreadCount} unread`
                  : "All caught up"
                : "Nothing right now"}
            </p>
          </div>
          {unreadCount > 0 ? (
            <form action={markAllNotificationsReadAction}>
              <button
                type="submit"
                className="rounded-md border border-stone-300 px-2.5 py-1 text-xs text-stone-700 hover:bg-stone-50"
              >
                Mark all read
              </button>
            </form>
          ) : null}
        </header>

        {hasItems ? (
          <ul className="max-h-[28rem] divide-y divide-stone-100 overflow-y-auto">
            {items.map((n) => (
              <Item key={n.id} notification={n} />
            ))}
          </ul>
        ) : (
          <div className="px-4 py-6 text-center text-sm text-stone-500">
            You&rsquo;re all caught up. We&rsquo;ll let you know when something
            needs your attention.
          </div>
        )}
      </div>
    </details>
  );
}

function Item({ notification }: { notification: OwnerNotification }) {
  const isUnread = notification.readAt === null;
  // The whole row is a link when href is set; otherwise it's just a
  // static block (admin broadcasts often won't have a link).
  const Inner = (
    <div className="flex gap-3">
      <span
        aria-hidden
        className={`mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full ${
          TONE_DOT[notification.tone]
        }`}
      />
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm ${
            isUnread ? "font-medium text-stone-900" : "text-stone-700"
          }`}
        >
          {notification.title}
        </p>
        {notification.body ? (
          <p className="mt-0.5 text-xs text-stone-500">{notification.body}</p>
        ) : null}
        <p className="mt-1 text-[11px] uppercase tracking-wider text-stone-400">
          {notification.createdAt.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
          })}
        </p>
      </div>
    </div>
  );

  return (
    <li className="group/row relative">
      {notification.href ? (
        <Link
          href={notification.href}
          className="block px-4 py-3 hover:bg-stone-50"
        >
          {Inner}
        </Link>
      ) : (
        <div className="px-4 py-3">{Inner}</div>
      )}
      {/* Dismiss is a separate form so the click is predictable
          (clicking the row navigates, clicking the X dismisses). */}
      <form
        action={dismissNotificationAction.bind(null, notification.id)}
        className="absolute right-2 top-2"
      >
        <button
          type="submit"
          aria-label="Dismiss"
          title="Dismiss"
          className="rounded-md p-1 text-stone-400 opacity-0 transition hover:bg-stone-100 hover:text-stone-700 group-hover/row:opacity-100 focus:opacity-100"
        >
          <X aria-hidden className="h-3.5 w-3.5" />
        </button>
      </form>
    </li>
  );
}
