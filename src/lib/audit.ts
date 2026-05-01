// Audit log writer + reader.
//
// Every mutating server action writes one row through `recordAudit`
// so we can reconstruct "who did what, when" for any entity. Reads
// power both the per-entity activity timeline and the admin "Recent
// activity" feed.
//
// Pure helpers (`summariseAction`, `groupEventsByDay`) are exported
// separately so we can unit-test the timeline rendering without a DB.

import { prisma } from "@/lib/db";
import type { AuditEntity, AuditEvent, Prisma } from "@prisma/client";

// Minimal actor shape callers pass in. We capture both the AdminUser
// id (when known) and the email so audit rows survive an admin row
// being deleted in future. Email is the source of truth for "who".
export type AuditActor = {
  adminId?: string | null;
  email: string;
};

export type RecordAuditInput = {
  actor: AuditActor;
  entity: AuditEntity;
  entityId: string;
  // Dot-namespaced action key, e.g. "property.verified".
  action: string;
  // Human-readable one-liner shown in the timeline.
  summary: string;
  metadata?: Prisma.InputJsonValue;
};

export async function recordAudit(input: RecordAuditInput): Promise<AuditEvent> {
  return prisma.auditEvent.create({
    data: {
      actorAdminId: input.actor.adminId ?? null,
      actorEmail: input.actor.email,
      entity: input.entity,
      entityId: input.entityId,
      action: input.action,
      summary: input.summary,
      metadata: input.metadata,
    },
  });
}

// Per-entity feed used by ActivityTimeline. Capped because no admin
// page wants to render thousands of rows; older rows are accessible
// via the global Recent activity view (with pagination there).
export async function listAuditFor(
  entity: AuditEntity,
  entityId: string,
  limit = 50,
): Promise<AuditEvent[]> {
  return prisma.auditEvent.findMany({
    where: { entity, entityId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

// Default human-friendly summary for an action key when the caller
// doesn't supply a custom one. Pure for testability. Unknown actions
// fall back to the raw action string so we never silently swallow.
const DEFAULT_SUMMARIES: Record<string, string> = {
  "owner.created": "Owner created",
  "owner.updated": "Owner updated",
  "owner.archived": "Owner archived",
  "owner.restored": "Owner restored",
  "owner.welcomed": "Welcome email sent",
  "owner.welcomed.resent": "Welcome email resent",
  "owner.impersonated": "Admin opened owner portal",
  "owner.impersonated.stopped": "Admin closed owner portal",
  "property.created": "Property created",
  "property.updated": "Property updated",
  "property.verified": "Property marked active",
  "property.exited": "Property marked exited",
  "property.archived": "Property archived",
  "property.restored": "Property restored",
  "lease.created": "Lease created",
  "lease.updated": "Lease updated",
  "lease.ended": "Lease ended",
  "booking.created": "Booking created",
  "booking.updated": "Booking updated",
  "booking.cancelled": "Booking cancelled",
  "transaction.created": "Transaction recorded",
  "transaction.updated": "Transaction updated",
  "transaction.archived": "Transaction archived",
  "document.uploaded": "Document uploaded",
  "document.deleted": "Document deleted",
  "agreement.issued": "Management agreement issued",
  "agreement.reissued": "Management agreement reissued",
  "agreement.signed": "Management agreement signed",
  "ical.feed.added": "iCal feed connected",
  "ical.feed.removed": "iCal feed removed",
  "ical.synced": "iCal synced",
  "comms.sent": "Communication logged",
  "note.added": "Note added",
  "note.deleted": "Note deleted",
  "task.created": "Task created",
  "task.completed": "Task completed",
  "admin.created": "Admin user invited",
  "admin.updated": "Admin user updated",
  "admin.archived": "Admin user removed",
  "lead.created": "Lead created",
  "lead.contacted": "Lead marked contacted",
  "lead.qualified": "Lead marked qualified",
  "lead.lost": "Lead marked lost",
  "lead.converted": "Lead converted to owner",
  "payout.added": "Payout method added",
  "payout.defaulted": "Default payout method changed",
  "payout.verified": "Payout method verified",
  "payout.archived": "Payout method archived",
  "payout.recorded": "Payout transaction recorded",
};

export function summariseAction(action: string): string {
  return DEFAULT_SUMMARIES[action] ?? action;
}

// Buckets a list of events into day labels so the timeline UI can
// render "Today / Yesterday / 28 Apr" headers. Ordered the same way
// the input is — we don't re-sort.
export type EventDayBucket = {
  label: string;
  isoDate: string; // YYYY-MM-DD in UTC, useful for stable React keys
  events: Array<{ createdAt: Date }>;
};

export function groupEventsByDay<T extends { createdAt: Date }>(
  events: T[],
  now: Date = new Date(),
): Array<{ label: string; isoDate: string; events: T[] }> {
  const today = utcDateKey(now);
  const yesterday = utcDateKey(addDays(now, -1));
  const buckets = new Map<string, T[]>();
  const order: string[] = [];

  for (const e of events) {
    const key = utcDateKey(e.createdAt);
    if (!buckets.has(key)) {
      buckets.set(key, []);
      order.push(key);
    }
    buckets.get(key)!.push(e);
  }

  return order.map((key) => ({
    isoDate: key,
    label:
      key === today
        ? "Today"
        : key === yesterday
          ? "Yesterday"
          : labelFromIso(key),
    events: buckets.get(key)!,
  }));
}

function utcDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function labelFromIso(iso: string): string {
  const [y, m, dStr] = iso.split("-");
  const d = new Date(Date.UTC(Number(y), Number(m) - 1, Number(dStr)));
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
