"use client";

import { useActionState, useRef, useState } from "react";
import { toast } from "sonner";
import {
  applyOwnerImportAction,
  previewOwnerImportAction,
  type OwnerImportPreview,
} from "./actions";

// Two-step client: preview parses + validates without writing, apply
// inserts. We hold the actual File in component state so the apply
// form re-uses the same upload (no second file picker).

export function ImportClient() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, formAction, pending] = useActionState<
    OwnerImportPreview | null,
    FormData
  >(previewOwnerImportAction, null);

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
              await applyOwnerImportAction(formData);
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
  preview: OwnerImportPreview;
  file: File | null;
  onApply: (formData: FormData) => Promise<void>;
}) {
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
          onSubmit={async (e) => {
            e.preventDefault();
            if (!file) {
              toast.error("Re-pick the CSV file before applying.");
              return;
            }
            const fd = new FormData();
            fd.set("file", file);
            await onApply(fd);
          }}
        >
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
