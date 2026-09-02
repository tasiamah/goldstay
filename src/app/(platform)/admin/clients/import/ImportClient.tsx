"use client";

import { useActionState, useRef, useState } from "react";
import { toast } from "sonner";
import {
  applyClientImportAction,
  previewClientImportAction,
  type ClientImportPreview,
} from "./actions";
import { WELCOME_SEND_CAP } from "./limits";

// Two-step client: preview parses + validates without writing, apply
// inserts. We hold the actual File in component state so the apply
// form re-uses the same upload (no second file picker).

export function ImportClient() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, formAction, pending] = useActionState<
    ClientImportPreview | null,
    FormData
  >(previewClientImportAction, null);

  return (
    <div className="space-y-6">
      <form action={formAction} className="rounded-lg border border-stone-200 bg-white p-6">
        <label className="block text-sm font-medium text-stone-900">
          CSV file
          <input
            ref={fileRef}
            type="file"
            name="file"
            accept=".csv,text/csv"
            required
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-2 block w-full cursor-pointer rounded-md border border-stone-300 bg-stone-50 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-stone-900 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-stone-800"
          />
        </label>
        <div className="mt-4 flex items-center justify-end">
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
          >
            {pending ? "Validating…" : "Preview"}
          </button>
        </div>
      </form>

      {preview ? (
        <PreviewBlock
          preview={preview}
          file={file}
          onApply={async (formData) => {
            try {
              await applyClientImportAction(formData);
            } catch (err) {
              toast.error("Import failed", {
                description: err instanceof Error ? err.message : String(err),
              });
            }
          }}
        />
      ) : null}
    </div>
  );
}

function PreviewBlock({
  preview,
  file,
  onApply,
}: {
  preview: ClientImportPreview;
  file: File | null;
  onApply: (formData: FormData) => Promise<void>;
}) {
  const overCap = preview.okCount > WELCOME_SEND_CAP;
  // Defaults to on so the common case — a few rows off a spreadsheet —
  // behaves like adding a client by hand. Forced off past the cap,
  // where the action would skip sending anyway.
  const [sendWelcome, setSendWelcome] = useState(!overCap);

  return (
    <section className="rounded-lg border border-stone-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 p-4">
        <div className="text-sm">
          <span className="font-medium text-stone-900">
            {preview.okCount} valid
          </span>
          {" · "}
          <span
            className={
              preview.errorCount > 0
                ? "font-medium text-red-700"
                : "text-stone-500"
            }
          >
            {preview.errorCount} invalid
          </span>
        </div>
        <form
          className="flex flex-wrap items-center gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!file) {
              toast.error("Re-pick the CSV file before applying.");
              return;
            }
            const fd = new FormData();
            fd.set("file", file);
            if (sendWelcome) fd.set("sendWelcome", "on");
            await onApply(fd);
          }}
        >
          {/* Imports used to create clients silently with no welcome
              email at all, which left them unable to reach the portal
              with nothing on screen saying so. Now it's a visible
              choice, defaulted to sending. */}
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              checked={sendWelcome}
              onChange={(e) => setSendWelcome(e.target.checked)}
              disabled={overCap}
              className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-500 disabled:opacity-50"
            />
            Send welcome emails
          </label>
          <button
            type="submit"
            disabled={preview.okCount === 0}
            className="rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
          >
            Import {preview.okCount} valid{" "}
            {preview.okCount === 1 ? "row" : "rows"}
          </button>
        </form>
      </div>

      {overCap ? (
        <p className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
          Over {WELCOME_SEND_CAP} rows, so welcome emails are not sent with
          the import — too many sends to finish inside one request without
          risking a partial batch. These clients will appear under{" "}
          <strong>Clients who never signed in</strong> on the overview, and
          you can send each one from their detail page.
        </p>
      ) : null}

      {preview.warnings.length > 0 ? (
        <ul className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
          {preview.warnings.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      ) : null}

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-stone-50 text-left text-xs uppercase tracking-wider text-stone-500">
            <th className="px-3 py-2">#</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Row</th>
          </tr>
        </thead>
        <tbody>
          {preview.rows.map((r) => (
            <tr key={r.rowIndex} className="border-t border-stone-100">
              <td className="px-3 py-2 text-xs text-stone-500">
                {r.rowIndex}
              </td>
              <td className="px-3 py-2 text-xs">
                {r.ok ? (
                  <span className="rounded bg-emerald-100 px-2 py-0.5 font-medium uppercase tracking-wider text-emerald-800">
                    OK
                  </span>
                ) : (
                  <span className="rounded bg-red-100 px-2 py-0.5 font-medium uppercase tracking-wider text-red-800">
                    Skip
                  </span>
                )}
              </td>
              <td className="px-3 py-2 text-stone-700">
                {r.ok ? (
                  <code className="text-xs">{JSON.stringify(r.value)}</code>
                ) : (
                  <ul className="text-xs text-red-700">
                    {r.errors.map((e, i) => (
                      <li key={i}>· {e}</li>
                    ))}
                  </ul>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
