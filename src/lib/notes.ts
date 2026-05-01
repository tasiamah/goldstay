// Internal notes on any audited entity.
//
// Notes are visible only inside /admin and flow into the activity
// timeline so a new hire reading the timeline gets both system
// events (from AuditEvent) and human context (from Note) in one
// place. Author identity duplicates `email` alongside the FK so a
// note row survives an admin row being deleted.

import { prisma } from "@/lib/db";
import type { AuditEntity, Note } from "@prisma/client";
import { recordAudit, type AuditActor } from "@/lib/audit";

export type AddNoteInput = {
  actor: AuditActor;
  entity: AuditEntity;
  entityId: string;
  body: string;
};

export async function addNote(input: AddNoteInput): Promise<Note> {
  const trimmed = input.body.trim();
  if (trimmed.length === 0) {
    throw new Error("Note body cannot be empty.");
  }

  const note = await prisma.note.create({
    data: {
      entity: input.entity,
      entityId: input.entityId,
      body: trimmed,
      authorAdminId: input.actor.adminId ?? null,
      authorEmail: input.actor.email,
    },
  });

  // The audit row keeps a short preview so the activity timeline
  // can render the bare event without a join when the note is later
  // deleted.
  await recordAudit({
    actor: input.actor,
    entity: input.entity,
    entityId: input.entityId,
    action: "note.added",
    summary: previewBody(trimmed),
    metadata: { noteId: note.id },
  });

  return note;
}

export async function deleteNote(
  noteId: string,
  actor: AuditActor,
): Promise<void> {
  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (!note) return;

  await prisma.note.delete({ where: { id: noteId } });

  await recordAudit({
    actor,
    entity: note.entity,
    entityId: note.entityId,
    action: "note.deleted",
    summary: previewBody(note.body),
    metadata: { noteId: note.id },
  });
}

export async function listNotesFor(
  entity: AuditEntity,
  entityId: string,
  limit = 50,
): Promise<Note[]> {
  return prisma.note.findMany({
    where: { entity, entityId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

// Pure helper exported for tests + the timeline summary builder.
export function previewBody(body: string): string {
  const single = body.replace(/\s+/g, " ").trim();
  return single.length <= 80 ? single : `${single.slice(0, 79)}…`;
}
