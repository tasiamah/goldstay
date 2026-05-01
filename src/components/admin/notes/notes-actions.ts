"use server";

import { revalidatePath } from "next/cache";
import type { AuditEntity } from "@prisma/client";
import { addNote, deleteNote } from "@/lib/notes";
import { currentAuditActor } from "@/lib/auth";

// Server action target for the NotesPanel form. Bound to (entity,
// entityId, returnPath) on the page so the panel itself stays
// generic. Returns void; success / failure surfaces by the page
// re-rendering with the new note in the list.
export async function addNoteAction(
  entity: AuditEntity,
  entityId: string,
  returnPath: string,
  formData: FormData,
): Promise<void> {
  const actor = await currentAuditActor();
  const body = String(formData.get("body") ?? "").trim();
  if (body.length === 0) return;
  await addNote({ actor, entity, entityId, body });
  revalidatePath(returnPath);
}

export async function deleteNoteAction(
  noteId: string,
  returnPath: string,
): Promise<void> {
  const actor = await currentAuditActor();
  await deleteNote(noteId, actor);
  revalidatePath(returnPath);
}
