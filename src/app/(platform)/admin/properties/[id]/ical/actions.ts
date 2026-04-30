"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { BookingSource } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { flattenZodErrors } from "@/lib/validation/preprocessors";
import { runFeedSync } from "@/lib/ical/run";

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
  await requireAdmin();
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
  revalidatePath(`/admin/properties/${parsed.data.propertyId}`);
  return { ok: true };
}

export async function deleteIcalFeedAction(
  feedId: string,
  propertyId: string,
): Promise<void> {
  await requireAdmin();
  await prisma.propertyIcalFeed.delete({ where: { id: feedId } });
  revalidatePath(`/admin/properties/${propertyId}`);
}

// "Sync now" button on the property detail. Runs the same logic as
// the cron, but for a single feed and surfaces the outcome inline.
export async function syncIcalFeedNowAction(
  feedId: string,
  propertyId: string,
): Promise<FeedActionResult> {
  await requireAdmin();
  const outcome = await runFeedSync(feedId);
  revalidatePath(`/admin/properties/${propertyId}`);
  return outcome.ok ? { ok: true } : { ok: false, error: outcome.error };
}
