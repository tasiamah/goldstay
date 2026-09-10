"use client";

import { useState, useTransition } from "react";
import { importFromAirbnbAction } from "./airbnb-import";
import type { ImportMapping } from "@/lib/airbnb/to-property";

// Paste-a-link prefill, shown only when creating a property.
//
// It is deliberately not offered when editing. Importing replaces the
// fields below it, and doing that to a property that already has a
// signed agreement against it is a much worse accident than retyping
// a bedroom count.
export function AirbnbImportPanel({
  onImport,
}: {
  onImport: (mapping: ImportMapping) => void;
}) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportMapping | null>(null);
  const [pending, startTransition] = useTransition();

  function run() {
    setError(null);
    startTransition(async () => {
      const res = await importFromAirbnbAction(url);
      if (!res.ok) {
        setError(res.error);
        setResult(null);
        return;
      }
      setResult(res.mapping);
      onImport(res.mapping);
    });
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-medium text-stone-900">
          Prefill from an Airbnb listing
        </h3>
        <span className="text-xs text-stone-500">Optional</span>
      </div>
      <p className="mt-1 text-xs text-stone-600">
        Paste the listing URL and we will fill in what Airbnb publishes. Do
        this before you start typing: importing replaces the fields below.
      </p>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          // Enter inside a form submits it. This input is a tool, not
          // a field, so it has to swallow the key or pasting a link
          // and hitting Enter would create a half-empty property.
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (url.trim() && !pending) run();
            }
          }}
          placeholder="https://www.airbnb.com/rooms/12345678"
          className="flex-1 rounded-md border border-stone-300 px-3 py-2 text-sm"
          disabled={pending}
        />
        <button
          type="button"
          onClick={run}
          disabled={pending || url.trim() === ""}
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {pending ? "Reading…" : "Prefill"}
        </button>
      </div>

      {error ? (
        <p className="mt-3 rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-800">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="mt-3 space-y-2 text-xs">
          <p className="font-medium text-green-800">
            Prefilled. Check every field before saving.
          </p>

          {/* The warnings are the point of the panel, not a footnote.
              Every one of them marks a field where the import means
              something different from the label on the box. */}
          <ul className="list-disc space-y-1 pl-4 text-amber-900">
            {result.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>

          <p className="text-stone-600">
            Airbnb also reports{" "}
            {result.unmapped.rating !== null
              ? `${result.unmapped.rating} from ${result.unmapped.reviewCount} reviews`
              : "no rating yet"}
            .{" "}
            <a
              href={result.unmapped.listingUrl}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Open the listing
            </a>{" "}
            to copy the address across.
          </p>
        </div>
      ) : null}
    </div>
  );
}
