-- Read-only shares of a single management agreement, for somebody who
-- is not the client. In practice the client's advocate.
--
-- Additive only: one new table, no change to any existing column, so
-- this is safe to apply ahead of the deploy that reads it.
--
-- The rationale for the table existing at all is in the AgreementShare
-- comment in prisma/schema.prisma. In short: the client's own
-- agreement email carries a Supabase magic link, so adding a second
-- address to the account would have granted a third party the entire
-- portal plus the ability to accept the contract in the client's name.
-- A share is a separate, weaker credential scoped to one document.

-- CreateTable
CREATE TABLE "AgreementShare" (
    "id" TEXT NOT NULL,
    "agreementId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "recipientName" TEXT,
    "recipientRelationship" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdByEmail" TEXT,
    "firstViewedAt" TIMESTAMP(3),
    "lastViewedAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgreementShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgreementShare_token_key" ON "AgreementShare"("token");

-- CreateIndex
CREATE INDEX "AgreementShare_agreementId_idx" ON "AgreementShare"("agreementId");

-- CreateIndex
CREATE INDEX "AgreementShare_recipientEmail_idx" ON "AgreementShare"("recipientEmail");

-- AddForeignKey
-- Cascade: a share is meaningless without its agreement, and a
-- superseded agreement's shares should not outlive it as live links.
ALTER TABLE "AgreementShare" ADD CONSTRAINT "AgreementShare_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "ManagementAgreement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
