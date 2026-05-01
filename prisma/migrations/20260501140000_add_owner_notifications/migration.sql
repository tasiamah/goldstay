-- Owner-facing notifications surface (bell in the owner header).
-- Two enums + one table. All additive; no downstream code reads the
-- table yet so this migration can ship safely ahead of the bell UI.

CREATE TYPE "OwnerNotificationKind" AS ENUM (
  'SETUP_INCOMPLETE',
  'AGREEMENT_PENDING',
  'STATEMENT_AVAILABLE',
  'PAYOUT_PAID',
  'ADMIN_BROADCAST'
);

CREATE TYPE "OwnerNotificationTone" AS ENUM ('INFO', 'WARNING', 'SUCCESS');

CREATE TABLE "OwnerNotification" (
  "id"         TEXT NOT NULL,
  "ownerId"    TEXT NOT NULL,
  "kind"       "OwnerNotificationKind" NOT NULL,
  "tone"       "OwnerNotificationTone" NOT NULL DEFAULT 'INFO',
  "title"      TEXT NOT NULL,
  "body"       TEXT,
  "href"       TEXT,
  "sourceRef"  TEXT,
  "readAt"     TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"  TIMESTAMP(3) NOT NULL,

  CONSTRAINT "OwnerNotification_pkey" PRIMARY KEY ("id")
);

-- One active notification per (owner, kind, sourceRef). NULLs are
-- distinct in Postgres unique indexes so multiple BROADCAST rows
-- (sourceRef = NULL) coexist freely while DERIVED rows are
-- de-duplicated.
CREATE UNIQUE INDEX "OwnerNotification_ownerId_kind_sourceRef_key"
  ON "OwnerNotification"("ownerId", "kind", "sourceRef");

CREATE INDEX "OwnerNotification_ownerId_readAt_idx"
  ON "OwnerNotification"("ownerId", "readAt");

CREATE INDEX "OwnerNotification_ownerId_resolvedAt_idx"
  ON "OwnerNotification"("ownerId", "resolvedAt");

ALTER TABLE "OwnerNotification"
  ADD CONSTRAINT "OwnerNotification_ownerId_fkey"
  FOREIGN KEY ("ownerId") REFERENCES "Owner"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
