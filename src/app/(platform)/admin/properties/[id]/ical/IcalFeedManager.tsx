"use client";

import { useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  deleteIcalFeedAction,
  syncIcalFeedNowAction,
  upsertIcalFeedAction,
  type FeedActionResult,
} from "./actions";
import { ACTIVE_OTA_SOURCES, SOURCE_LABEL } from "@/lib/booking-sources";

type Feed = {
  id: string;
  source: "AIRBNB" | "BOOKING_COM" | "VRBO" | "DIRECT";
  url: string;
  lastSyncedAt: Date | null;
  lastSuccessAt: Date | null;
  lastError: string | null;
};

export function IcalFeedManager({
  propertyId,
  feeds,
}: {
  propertyId: string;
  feeds: Feed[];
}) {
  const existingSources = new Set(feeds.map((f) => f.source));
  // Only OTAs that have an iCal feed are connectable; "Direct"
  // bookings are recorded by hand. Booking.com / Vrbo come back
  // when src/lib/booking-sources.ts re-enables them.
  const availableSources = ACTIVE_OTA_SOURCES.filter(
    (s) => !existingSources.has(s),
  );

  return (
    <div className="space-y-5">
      {feeds.length === 0 ? (
        <p className="text-sm text-stone-500">
          No channel calendars connected yet. Paste your Airbnb iCal link
          below — find it under{" "}
          <span className="font-medium text-stone-700">
            Listing → Availability → Sync calendars → Export calendar
          </span>{" "}
          in Airbnb&rsquo;s host dashboard.
        </p>
      ) : (
        <ul className="divide-y divide-stone-100">
          {feeds.map((f) => (
            <FeedRow key={f.id} propertyId={propertyId} feed={f} />
          ))}
        </ul>
      )}

      {availableSources.length > 0 ? (
        <AddFeedForm
          propertyId={propertyId}
          availableSources={availableSources}
        />
      ) : (
        <p className="text-xs text-stone-500">
          All connectable channel calendars are already linked.
        </p>
      )}
    </div>
  );
}

function FeedRow({ propertyId, feed }: { propertyId: string; feed: Feed }) {
  const [pendingSync, startSync] = useTransition();
  const [pendingDelete, startDelete] = useTransition();
  const [outcome, setOutcome] = useState<string | null>(null);

  return (
    <li className="space-y-2 py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-stone-900">
            {SOURCE_LABEL[feed.source]}
          </p>
          <p className="mt-0.5 truncate text-xs text-stone-500">{feed.url}</p>
          <p className="mt-1 text-xs text-stone-500">
            {feed.lastError ? (
              <span className="text-red-700">
                Failed{" "}
                {feed.lastSyncedAt
                  ? `${relTime(feed.lastSyncedAt)} ago`
                  : ""}
                : {feed.lastError}
              </span>
            ) : feed.lastSuccessAt ? (
              <>Last synced {relTime(feed.lastSuccessAt)} ago</>
            ) : (
              <>Not yet synced.</>
            )}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            disabled={pendingSync}
            onClick={() => {
              setOutcome(null);
              startSync(async () => {
                const res = await syncIcalFeedNowAction(feed.id, propertyId);
                setOutcome(res.ok ? "Sync complete." : `Sync failed: ${res.error}`);
              });
            }}
            className="inline-flex items-center rounded-md border border-stone-300 bg-white px-2.5 py-1 text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-60"
          >
            {pendingSync ? "Syncing…" : "Sync now"}
          </button>
          <button
            type="button"
            disabled={pendingDelete}
            onClick={() => {
              if (
                !window.confirm(
                  `Disconnect ${SOURCE_LABEL[feed.source]} calendar?`,
                )
              )
                return;
              startDelete(async () => {
                await deleteIcalFeedAction(feed.id, propertyId);
              });
            }}
            className="inline-flex items-center rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
          >
            {pendingDelete ? "Removing…" : "Remove"}
          </button>
        </div>
      </div>
      {outcome ? (
        <p className="text-xs text-stone-600">{outcome}</p>
      ) : null}
    </li>
  );
}

function AddFeedForm({
  propertyId,
  availableSources,
}: {
  propertyId: string;
  availableSources: ReadonlyArray<"AIRBNB" | "BOOKING_COM" | "VRBO" | "DIRECT">;
}) {
  const [state, formAction] = useFormState(
    upsertIcalFeedAction,
    null as FeedActionResult | null,
  );
  const fieldError = (key: string) =>
    state && !state.ok ? state.fieldErrors?.[key] : undefined;

  return (
    <form action={formAction} className="rounded-md border border-stone-200 bg-stone-50 p-4">
      <input type="hidden" name="propertyId" value={propertyId} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[140px_1fr_auto]">
        <label className="block">
          <span className="block text-xs font-medium text-stone-700">
            Channel
          </span>
          <select
            name="source"
            required
            className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-2 py-1.5 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-500"
          >
            {availableSources.map((s) => (
              <option key={s} value={s}>
                {SOURCE_LABEL[s]}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="block text-xs font-medium text-stone-700">
            iCal URL
          </span>
          <input
            type="url"
            name="url"
            required
            placeholder="https://www.airbnb.com/calendar/ical/12345.ics?s=…"
            aria-invalid={Boolean(fieldError("url")) || undefined}
            className={`mt-1 block w-full rounded-md border px-2 py-1.5 text-sm text-stone-900 focus:outline-none focus:ring-1 ${
              fieldError("url")
                ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                : "border-stone-300 focus:border-stone-500 focus:ring-stone-500"
            }`}
          />
          {fieldError("url") ? (
            <span className="mt-1 block text-xs text-red-700">
              {fieldError("url")}
            </span>
          ) : null}
        </label>
        <div className="flex items-end">
          <ConnectButton />
        </div>
      </div>
      {state && !state.ok ? (
        <p className="mt-2 text-xs text-red-700">{state.error}</p>
      ) : null}
    </form>
  );
}

function ConnectButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-[34px] items-center rounded-md bg-stone-900 px-3 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
    >
      {pending ? "Connecting…" : "Connect"}
    </button>
  );
}

function relTime(date: Date): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const min = Math.round(diffMs / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m`;
  const hr = Math.round(min / 60);
  if (hr < 48) return `${hr}h`;
  const day = Math.round(hr / 24);
  return `${day}d`;
}
