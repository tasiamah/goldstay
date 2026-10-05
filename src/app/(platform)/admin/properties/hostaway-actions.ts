"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { currentAuditActor, requireAdmin } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { hostawayCredentials } from "@/lib/hostaway/client";
import { importPropertyReservations } from "@/lib/hostaway/import";

export type HostawayImportResult =
  | { ok: false; error: string }
  | { ok: true; message: string };

// How far back a single import reaches. Long enough to cover a
// property that has been running on an iCal feed for a while,
// short enough that one click cannot rewrite years of settled
// statements by accident.
const DEFAULT_MONTHS_BACK = 12;

export async function importHostawayAction(
  propertyId: string,
  _prev: HostawayImportResult | null,
  _formData: FormData,
): Promise<HostawayImportResult> {
  await requireAdmin();

  const credentials = hostawayCredentials();
  if (!credentials) {
    return {
      ok: false,
      error:
        "Hostaway API credentials are not set. Add HOSTAWAY_ACCOUNT_ID and HOSTAWAY_API_KEY from Settings > Hostaway API.",
    };
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { id: true, name: true, hostawayListingId: true },
  });
  if (!property) return { ok: false, error: "Property not found." };
  if (!property.hostawayListingId) {
    return {
      ok: false,
      error:
        "This property has no Hostaway listing ID, so there is nothing to import against. Set it in Details first.",
    };
  }

  const to = new Date();
  const from = new Date(to);
  from.setUTCMonth(from.getUTCMonth() - DEFAULT_MONTHS_BACK);

  try {
    const summary = await importPropertyReservations({
      prisma,
      accountId: credentials.accountId,
      apiKey: credentials.apiKey,
      listingId: property.hostawayListingId,
      from,
      to,
    });

    await recordAudit({
      actor: await currentAuditActor(),
      entity: "PROPERTY",
      entityId: property.id,
      action: "property.updated",
      summary: `Imported ${summary.created} new and ${summary.updated} existing bookings from Hostaway`,
      metadata: { ...summary },
    });

    revalidatePath(`/admin/properties/${property.id}`);

    const parts = [
      `${summary.fetched} reservations read`,
      `${summary.created} added`,
      `${summary.updated} updated`,
    ];
    if (summary.placeholdersRemoved > 0) {
      parts.push(
        `${summary.placeholdersRemoved} calendar placeholder${
          summary.placeholdersRemoved === 1 ? "" : "s"
        } replaced`,
      );
    }
    if (summary.skipped > 0) parts.push(`${summary.skipped} skipped`);

    return { ok: true, message: `${parts.join(", ")}.` };
  } catch (e) {
    // Surfaced rather than thrown: the operator needs to know whether
    // to fix credentials or chase Hostaway, and a thrown error in a
    // server action shows them an unhelpful generic page.
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Hostaway import failed.",
    };
  }
}
