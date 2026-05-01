// ActivityTimeline — server component that renders a unified
// "what happened to this entity" feed: AuditEvent + Note +
// CommunicationLog rows, ordered desc, grouped into Today /
// Yesterday / dated buckets.
//
// Each row type renders with a distinct icon-letter so an operator
// can scan vertically for the kind of change they're looking for:
//
//   ●  audit (system event)
//   ✎  note  (human-written context)
//   ✉  comm  (email / WhatsApp / call)
//
// We deliberately don't paginate yet — capped to 50 of each
// source which is plenty for the typical entity. When a single
// entity grows past that threshold the right answer is a
// dedicated /admin/<entity>/<id>/activity page rather than
// infinite-scroll on the detail page.

import { listAuditFor, groupEventsByDay } from "@/lib/audit";
import { listNotesFor } from "@/lib/notes";
import { listCommunicationsFor, summariseLog } from "@/lib/comms";
import type { AuditEntity } from "@prisma/client";

type Row =
  | {
      kind: "audit";
      id: string;
      createdAt: Date;
      who: string;
      action: string;
      summary: string;
    }
  | {
      kind: "note";
      id: string;
      createdAt: Date;
      who: string;
      summary: string;
    }
  | {
      kind: "comm";
      id: string;
      createdAt: Date;
      who: string;
      summary: string;
    };

const KIND_GLYPH: Record<Row["kind"], string> = {
  audit: "●",
  note: "✎",
  comm: "✉",
};

const KIND_LABEL: Record<Row["kind"], string> = {
  audit: "Event",
  note: "Note",
  comm: "Comms",
};

export async function ActivityTimeline({
  entity,
  entityId,
  // Owner-only sources (Communications) are read separately because
  // CommunicationLog is keyed by ownerId, not (entity, entityId).
  // For a property, we still surface comms when the caller passes
  // the property's ownerId; for an owner, ownerId === entityId.
  ownerId,
  title = "Activity",
}: {
  entity: AuditEntity;
  entityId: string;
  ownerId?: string | null;
  title?: string;
}) {
  const [audits, notes, comms] = await Promise.all([
    listAuditFor(entity, entityId, 50),
    listNotesFor(entity, entityId, 50),
    ownerId
      ? listCommunicationsFor(ownerId, 50)
      : Promise.resolve([]),
  ]);

  const rows: Row[] = [
    ...audits.map((a) => ({
      kind: "audit" as const,
      id: a.id,
      createdAt: a.createdAt,
      who: a.actorEmail,
      action: a.action,
      summary: a.summary,
    })),
    ...notes.map((n) => ({
      kind: "note" as const,
      id: n.id,
      createdAt: n.createdAt,
      who: n.authorEmail,
      summary: n.body,
    })),
    ...comms.map((c) => ({
      kind: "comm" as const,
      id: c.id,
      createdAt: c.createdAt,
      who: c.sentByAdminId ? "ops" : c.direction === "INBOUND" ? "owner" : "system",
      summary: summariseLog(c),
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const buckets = groupEventsByDay(rows);

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-medium text-stone-900">{title}</h3>
        <span className="text-xs text-stone-400">
          {rows.length === 0
            ? "Nothing yet"
            : `${rows.length} ${rows.length === 1 ? "event" : "events"}`}
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-stone-500">
          Mutations, notes, and communications on this record will appear
          here. Add the first note above to start the trail.
        </p>
      ) : (
        <ol className="mt-6 space-y-6">
          {buckets.map((bucket) => (
            <li key={bucket.isoDate}>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-stone-500">
                {bucket.label}
              </p>
              <ul className="space-y-2 border-l border-stone-200 pl-4">
                {bucket.events.map((row) => (
                  <li key={`${row.kind}-${row.id}`} className="flex gap-3">
                    <span
                      aria-label={KIND_LABEL[row.kind]}
                      className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[10px] text-stone-600"
                    >
                      {KIND_GLYPH[row.kind]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-stone-800">{row.summary}</p>
                      <p className="text-xs text-stone-500">
                        {row.who} ·{" "}
                        {row.createdAt.toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
