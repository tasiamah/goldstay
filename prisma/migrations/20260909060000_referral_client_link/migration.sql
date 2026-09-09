-- Link a referral to the client it became.
--
-- Additive only: one nullable column plus an index and a foreign key,
-- no change to existing data, so it is safe to apply ahead of the
-- deploy that reads it.
--
-- Attribution creates a Referral from a public form submission, so at
-- that moment all we hold is a name and an email the landlord typed
-- in. Whether the client who signs three months later is the same
-- person was previously a judgement somebody made from memory each
-- time the question arose, and that judgement decides who receives
-- twelve months of commission. Recording it once is the point.
--
-- It also lets markReferralSigned prefill its rent and fee snapshot
-- from the signed agreement rather than having an operator read those
-- numbers off the property page and retype them.

-- AlterTable
ALTER TABLE "Referral" ADD COLUMN "clientId" TEXT;

-- CreateIndex
CREATE INDEX "Referral_clientId_idx" ON "Referral"("clientId");

-- AddForeignKey
-- SetNull, not Cascade. If a client row is removed the referral still
-- happened, and an agent owed money must not have the evidence of it
-- deleted along with them. "Owner" is the physical table behind the
-- Client model; the rename was never applied at the database level.
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
