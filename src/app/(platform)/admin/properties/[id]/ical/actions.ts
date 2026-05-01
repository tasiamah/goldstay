"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { BookingSource } from "@prisma/client";
import { prisma } from "@/lib/db";
import { currentAuditActor } from "@/lib/auth";
import { flattenZodErrors } from "@/lib/validation/preprocessors";
import { runFeedSync } from "@/lib/ical/run";
import { recordAudit } from "@/lib/audit";

export type FeedActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

const FeedInput = z.object({
  propertyId: z.string().min(1),
  source: z.nativeEnum(BookingSource),
  url: z
    .string()
    .trim()
    .url("Must be a valid URL")
    .max(1000),
});

function fromForm(formData: FormData) {
  return {
    propertyId: String(formData.get("propertyId") ?? ""),
    source: String(formData.get("source") ?? "AIRBNB"),
    url: String(formData.get("url") ?? ""),
  };
}

export async function upsertIcalFeedAction(
  _prev: FeedActionResult | null,
  formData: FormData,
): Promise<FeedActionResult> {
  const actor = await currentAuditActor();
  const parsed = FeedInput.safeParse(fromForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }
  await prisma.propertyIcalFeed.upsert({
    where: {
      propertyId_source: {
        propertyId: parsed.data.propertyId,
        source: parsed.data.source,
      },
    },
    create: parsed.data,
    update: { url: parsed.data.url, lastError: null },
  });
  await recordAudit({
    actor,
    entity: "PROPERTY",
    entityId: parsed.data.propertyId,
    action: "ical.feed.added",
    summary: `iCal feed for ${parsed.data.source} added/updated`,
    metadata: { source: parsed.data.source },
  });
  revalidatePath(`/admin/properties/${parsed.data.propertyId}`);
  return { ok: true };
}

export async function deleteIcalFeedAction(
  feedId: string,
  propertyId: string,
): Promise<void> {
  const actor = await currentAuditActor();
  const feed = await prisma.propertyIcalFeed.findUnique({
    where: { id: feedId },
    select: { source: true },
  });
  await prisma.propertyIcalFeed.delete({ where: { id: feedId } });
  if (feed) {
    await recordAudit({
      actor,
      entity: "PROPERTY",
      entityId: propertyId,
      action: "ical.feed.removed",
      summary: `iCal feed for ${feed.source} removed`,
      metadata: { source: feed.source },
    });
  }
  revalidatePath(`/admin/properties/${propertyId}`);
}

// "Sync now" button on the property detail. Runs the same logic as
// the cron, but for a single feed and surfaces the outcome inline.
// We deliberately don't write an audit row per manual sync — the
// JobRun table already has a per-execution record we can surface in
// the system-health page, and a manual sync isn't an entity-state
// change anyone reading the property timeline cares about.
export async function syncIcalFeedNowAction(
  feedId: string,
  propertyId: string,
): Promise<FeedActionResult> {
  await currentAuditActor();
  const outcome = await runFeedSync(feedId);
  revalidatePath(`/admin/properties/${propertyId}`);
  return outcome.ok ? { ok: true } : { ok: false, error: outcome.error };
}
