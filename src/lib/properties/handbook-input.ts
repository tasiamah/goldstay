// Validation and persistence for the property handbook.
//
// Separate from ./handbook.ts so the field list can be imported by a
// client component without pulling zod and the Prisma client into the
// browser bundle behind it.
//
// Both write paths go through saveHandbook: the client editing their
// own unit on /client/properties/[id], and an operator editing the
// same row on /admin/properties/[id]. One function rather than two
// because the only thing that differs between them is who is
// recorded as the author, and a second copy of an upsert is a second
// place for the field list to fall out of date.

import { z } from "zod";
import { prisma } from "@/lib/db";
import { recordAudit } from "@/lib/audit";
import {
  HANDBOOK_FIELDS,
  changedHandbookFields,
  type HandbookActionResult,
  type HandbookField,
  type HandbookFieldName,
  type HandbookValues,
} from "./handbook";

// Every field is optional, and that is the whole point: a handbook
// filled in over three sittings is worth more than one nobody starts
// because the form demanded ten answers at once. Blank and whitespace
// collapse to null so "cleared by the owner" and "never filled in"
// are the same state in the database rather than two that render
// differently.
//
// Over-length is a real error rather than a silent truncation. These
// are instructions someone will follow at a locked gate, and quietly
// dropping the last sentence of one is worse than refusing the save.
function handbookText(field: HandbookField) {
  return z
    .string()
    .trim()
    .max(field.maxLength, `${field.label} is too long.`)
    .transform((v) => (v.length > 0 ? v : null));
}

const handbookShape = {} as Record<
  HandbookFieldName,
  ReturnType<typeof handbookText>
>;
for (const f of HANDBOOK_FIELDS) handbookShape[f.name] = handbookText(f);

export const HandbookInput = z.object(handbookShape);

// Reads the ten fields out of a submitted form. Here rather than in
// either action so the two write paths parse identically.
export function handbookValuesFromFormData(formData: FormData): unknown {
  return Object.fromEntries(
    HANDBOOK_FIELDS.map((f) => [f.name, formData.get(f.name) ?? ""]),
  );
}

export type SaveHandbookActor = {
  // Set when an operator saved it, null when the owner did. Mirrors
  // the audit actor shape used across the platform.
  adminId: string | null;
  email: string;
};

export async function saveHandbook(input: {
  propertyId: string;
  formData: FormData;
  actor: SaveHandbookActor;
}): Promise<HandbookActionResult> {
  const parsed = HandbookInput.safeParse(
    handbookValuesFromFormData(input.formData),
  );
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors,
    };
  }

  const values = parsed.data as HandbookValues;

  // Read the current row purely to work out what changed, so the
  // audit entry can say "wifiPassword, checkInNotes" rather than
  // "handbook updated" on every save. An operator reading the
  // timeline six months later wants to know which instruction moved.
  const before = await prisma.propertyHandbook.findUnique({
    where: { propertyId: input.propertyId },
  });
  const changed = changedHandbookFields(before, values);

  await prisma.propertyHandbook.upsert({
    where: { propertyId: input.propertyId },
    create: {
      propertyId: input.propertyId,
      ...values,
      updatedByEmail: input.actor.email,
      updatedByAdminId: input.actor.adminId,
    },
    update: {
      ...values,
      updatedByEmail: input.actor.email,
      updatedByAdminId: input.actor.adminId,
    },
  });

  // A save that changed nothing still touches updatedAt, because
  // "I checked, it is still right" is useful information about a
  // handbook and the whole point of the timestamp. It does not earn
  // an audit row, though, which would otherwise fill the property
  // timeline with no-ops.
  if (changed.length > 0) {
    await recordAudit({
      actor: { adminId: input.actor.adminId, email: input.actor.email },
      entity: "PROPERTY",
      entityId: input.propertyId,
      action: "property.handbook.updated",
      summary:
        input.actor.adminId === null
          ? "Client updated the property handbook"
          : "Operator updated the property handbook",
      // Field names only, never values. See changedHandbookFields.
      metadata: {
        fields: changed,
        scope: input.actor.adminId === null ? "client-self-serve" : "admin",
      },
    });
  }

  return { ok: true };
}
