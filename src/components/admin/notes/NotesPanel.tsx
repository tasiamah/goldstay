// NotesPanel — server component rendering a textarea + a list of
// existing notes for any audited entity. The form's action is wired
// to addNoteAction bound to (entity, entityId, returnPath).
//
// Rendering choices:
//   * Notes are reverse-chronological so the most recent context an
//     operator added is at the top — what they care about when
//     reopening a record after a few weeks.
//   * Author is shown by email rather than name because authors might
//     be outside contractors and we capture email everywhere.
//   * Delete is allowed for any admin who can read the panel, since
//     notes are quick context not auditable evidence.

import { listNotesFor } from "@/lib/notes";
import type { AuditEntity } from "@prisma/client";
import { addNoteAction, deleteNoteAction } from "./notes-actions";

export async function NotesPanel({
  entity,
  entityId,
  returnPath,
  title = "Internal notes",
}: {
  entity: AuditEntity;
  entityId: string;
  returnPath: string;
  title?: string;
}) {
  const notes = await listNotesFor(entity, entityId);
  const addBound = addNoteAction.bind(null, entity, entityId, returnPath);

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-medium text-stone-900">{title}</h3>
        <span className="text-xs text-stone-400">
          {notes.length === 0
            ? "No notes yet"
            : `${notes.length} ${notes.length === 1 ? "note" : "notes"}`}
        </span>
      </div>
      <p className="mt-1 text-sm text-stone-500">
        Visible only inside /admin. Use this for context the next operator
        will need: outstanding paperwork, owner preferences, things said in
        a phone call. Notes flow into the activity timeline below.
      </p>

      <form action={addBound} className="mt-4 space-y-2">
        <textarea
          name="body"
          rows={3}
          required
          placeholder="Type a note for the team…"
          className="block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
          >
            Save note
          </button>
        </div>
      </form>

      {notes.length > 0 ? (
        <ul className="mt-6 space-y-4">
          {notes.map((note) => {
            const deleteBound = deleteNoteAction.bind(
              null,
              note.id,
              returnPath,
            );
            return (
              <li
                key={note.id}
                className="rounded-md border border-stone-200 bg-stone-50 p-4"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-xs text-stone-500">
                    <span className="font-medium text-stone-700">
                      {note.authorEmail}
                    </span>{" "}
                    · {formatDateTime(note.createdAt)}
                  </p>
                  <form action={deleteBound}>
                    <button
                      type="submit"
                      className="text-xs text-stone-400 hover:text-red-600"
                      aria-label="Delete note"
                    >
                      Delete
                    </button>
                  </form>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-stone-800">
                  {note.body}
                </p>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}

function formatDateTime(d: Date): string {
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
