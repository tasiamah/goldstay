// Adding and removing the co-owners of a property.
//
// The rules live here rather than in the server action so that any
// second caller — a client-portal path, a bulk import — cannot
// enforce a different set. Same reasoning as lib/clients/
// observer-actions.ts, which this deliberately mirrors.
//
// A co-owner is an existing Goldstay client, not an email address.
// That is the whole difference from an observer: an observer is a
// mailing-list entry with no login, which is exactly what left Wesley
// Angulu signing in to a stale copy of a flat that had been moved to
// his mother. If the person has no client record, the answer is to
// create one, not to widen this.

import { prisma } from "@/lib/db";
import { recordAudit } from "@/lib/audit";
import type { CurrentActor } from "@/lib/auth";

export type CoOwnerResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export async function addCoOwnerByEmail(input: {
  propertyId: string;
  email: string;
  relationship?: string;
  actor: CurrentActor;
}): Promise<CoOwnerResult> {
  const email = input.email.trim().toLowerCase();
  if (!email) return { ok: false, error: "Enter an email address." };

  const property = await prisma.property.findUnique({
    where: { id: input.propertyId },
    select: {
      id: true,
      name: true,
      unitNumber: true,
      clientId: true,
      client: { select: { fullName: true, email: true } },
    },
  });
  if (!property) return { ok: false, error: "Property not found." };

  const client = await prisma.client.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true, fullName: true, archivedAt: true },
  });
  if (!client) {
    return {
      ok: false,
      // Naming the next step, because the operator is mid-call and
      // "not found" alone makes them go hunting.
      error: `No Goldstay client has the address ${email}. Create them as a client first, then add them here — a co-owner needs their own login.`,
    };
  }

  if (client.id === property.clientId) {
    return {
      ok: false,
      error: `${client.fullName} is already the owner of record for this unit.`,
    };
  }

  if (client.archivedAt) {
    return {
      ok: false,
      error: `${client.fullName}'s client record is archived. Restore it before adding them as a co-owner, or they will not be able to sign in.`,
    };
  }

  // Re-adding someone previously removed clears the removal rather
  // than making a second row, so the history stays in one place.
  const existing = await prisma.propertyCoOwner.findUnique({
    where: {
      propertyId_clientId: { propertyId: property.id, clientId: client.id },
    },
    select: { id: true, removedAt: true },
  });

  if (existing && !existing.removedAt) {
    return {
      ok: false,
      error: `${client.fullName} is already a co-owner of this unit.`,
    };
  }

  const relationship = (input.relationship ?? "").trim() || null;

  if (existing) {
    await prisma.propertyCoOwner.update({
      where: { id: existing.id },
      data: {
        removedAt: null,
        relationship,
        addedByEmail: input.actor.email,
      },
    });
  } else {
    await prisma.propertyCoOwner.create({
      data: {
        propertyId: property.id,
        clientId: client.id,
        relationship,
        addedByEmail: input.actor.email,
      },
    });
  }

  const unit = property.unitNumber
    ? `${property.name} · ${property.unitNumber}`
    : property.name;

  await recordAudit({
    actor: input.actor,
    entity: "PROPERTY",
    entityId: property.id,
    action: "property.coowner.added",
    summary: `${client.fullName} can now see ${unit}, co-owned with ${property.client.fullName}`,
    metadata: { clientId: client.id, relationship },
  });

  return {
    ok: true,
    message: `${client.fullName} can now see this unit in their own portal. Statements and payouts still go to ${property.client.fullName}.`,
  };
}

export async function removeCoOwner(input: {
  coOwnerId: string;
  propertyId: string;
  actor: CurrentActor;
}): Promise<CoOwnerResult> {
  const row = await prisma.propertyCoOwner.findUnique({
    where: { id: input.coOwnerId },
    select: {
      id: true,
      propertyId: true,
      removedAt: true,
      client: { select: { fullName: true } },
      property: { select: { name: true, unitNumber: true } },
    },
  });

  // The id is checked against the property it was reached through, so
  // a stale form cannot remove a co-owner from a different unit.
  if (!row || row.propertyId !== input.propertyId) {
    return { ok: false, error: "Co-owner not found on this property." };
  }
  if (row.removedAt) {
    return { ok: false, error: "That co-owner has already been removed." };
  }

  await prisma.propertyCoOwner.update({
    where: { id: row.id },
    data: { removedAt: new Date() },
  });

  const unit = row.property.unitNumber
    ? `${row.property.name} · ${row.property.unitNumber}`
    : row.property.name;

  await recordAudit({
    actor: input.actor,
    entity: "PROPERTY",
    entityId: input.propertyId,
    action: "property.coowner.removed",
    summary: `${row.client.fullName} can no longer see ${unit}`,
    metadata: { coOwnerId: row.id },
  });

  return {
    ok: true,
    message: `${row.client.fullName} can no longer see this unit.`,
  };
}
