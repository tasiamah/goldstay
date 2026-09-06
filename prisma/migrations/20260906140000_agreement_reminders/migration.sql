-- Reminder ladder state for unsigned management agreements.
--
-- The unique index on (agreementId, step) is the at-most-once
-- guarantee: the hourly cron, a Vercel retry and a manual replay all
-- race to insert the same row and exactly one wins.

CREATE TYPE "AgreementReminderKind" AS ENUM ('EMAIL', 'ESCALATION');

CREATE TYPE "AgreementReminderStatus" AS ENUM ('QUEUED', 'SENT', 'FAILED', 'SKIPPED');

CREATE TABLE "AgreementReminder" (
    "id" TEXT NOT NULL,
    "agreementId" TEXT NOT NULL,
    "step" INTEGER NOT NULL,
    "kind" "AgreementReminderKind" NOT NULL DEFAULT 'EMAIL',
    "status" "AgreementReminderStatus" NOT NULL DEFAULT 'QUEUED',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "providerId" TEXT,
    "error" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgreementReminder_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AgreementReminder_agreementId_step_key" ON "AgreementReminder"("agreementId", "step");

CREATE INDEX "AgreementReminder_agreementId_idx" ON "AgreementReminder"("agreementId");

CREATE INDEX "AgreementReminder_status_idx" ON "AgreementReminder"("status");

ALTER TABLE "AgreementReminder" ADD CONSTRAINT "AgreementReminder_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "ManagementAgreement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
