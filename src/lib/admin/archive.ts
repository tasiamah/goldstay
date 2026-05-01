// Soft-delete helpers.
//
// Every model that we archive (Owner, Property, Lease, Transaction)
// has an `archivedAt: DateTime?` column. Default queries everywhere
// filter `archivedAt: null`; the archive view explicitly inverts.
//
// Archive is reversible for 30 days from the timestamp. After that
// rows are still kept (we don't run a deletion job yet), but the
// restore button hides and a future cleanup job can hard-delete.

import { prisma } from "@/lib/db";
import { recordAudit, type AuditActor } from "@/lib/audit";
import type { AuditEntity } from "@prisma/client";

export const ARCHIVE_RESTORE_WINDOW_DAYS = 30;

export type ArchivableEntity = "OWNER" | "PROPERTY" | "LEASE" | "TRANSACTION";

async function setArchivedAt(
  entity: ArchivableEntity,
  id: string,
  archivedAt: Date | null,
): Promise<void> {
  switch (entity) {
    case "OWNER":
      await prisma.owner.update({ where: { id }, data: { archivedAt } });
      return;
    case "PROPERTY":
      await prisma.property.update({ where: { id }, data: { archivedAt } });
      return;
    case "LEASE":
      await prisma.lease.update({ where: { id }, data: { archivedAt } });
      return;
    case "TRANSACTION":
      await prisma.transaction.update({
        where: { id },
        data: { archivedAt },
      });
      return;
  }
}

export type ArchiveResult = {
  entity: ArchivableEntity;
  id: string;
  archivedAt: Date;
};

export async function archiveEntity(
  entity: ArchivableEntity,
  id: string,
  actor: AuditActor,
  options: { summary?: string } = {},
): Promise<ArchiveResult> {
  const archivedAt = new Date();
  await setArchivedAt(entity, id, archivedAt);
  await recordAudit({
    actor,
    entity: entity as AuditEntity,
    entityId: id,
    action: `${entity.toLowerCase()}.archived`,
    summary:
      options.summary ?? `${formatEntity(entity)} archived (soft delete)`,
    metadata: { archivedAt: archivedAt.toISOString() },
  });
  return { entity, id, archivedAt };
}

export async function restoreEntity(
  entity: ArchivableEntity,
  id: string,
  actor: AuditActor,
  options: { summary?: string } = {},
): Promise<void> {
  await setArchivedAt(entity, id, null);
  await recordAudit({
    actor,
    entity: entity as AuditEntity,
    entityId: id,
    action: `${entity.toLowerCase()}.restored`,
    summary: options.summary ?? `${formatEntity(entity)} restored`,
  });
}

// ---------- Pure helpers ----------

export function isWithinRestoreWindow(
  archivedAt: Date | null,
  now: Date = new Date(),
): boolean {
  if (!archivedAt) return false;
  const cutoff = new Date(
    now.getTime() - ARCHIVE_RESTORE_WINDOW_DAYS * 24 * 60 * 60 * 1000,
  );
  return archivedAt >= cutoff;
}

export function formatEntity(entity: ArchivableEntity): string {
  switch (entity) {
    case "OWNER":
      return "Owner";
    case "PROPERTY":
      return "Property";
    case "LEASE":
      return "Lease";
    case "TRANSACTION":
      return "Transaction";
  }
}
