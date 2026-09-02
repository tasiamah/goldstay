-- Adopts the GoldStay Short-Let Property Management Agreement (Kenya)
-- as a second contract template alongside the original generic one.
--
-- Purely additive: every new column is nullable or carries a default
-- that matches what existing rows were already issued under, so no
-- backfill is required and already-signed agreements keep the exact
-- terms they were signed under.
--
-- ManagementAgreement.template defaults to GENERIC_MANAGEMENT_V1
-- because that is the only contract that existed when those rows were
-- created. Kenya short-term properties issued from here on get
-- SHORT_LET_KE_V1.
--
-- Note: "Owner" below is the physical table behind the Prisma `Client`
-- model (@@map). The owner -> client rename is Prisma-level only.

-- CreateEnum
CREATE TYPE "AgreementTemplate" AS ENUM ('GENERIC_MANAGEMENT_V1', 'SHORT_LET_KE_V1');

-- AlterTable
-- Schedule 1 "Client" row: ID / registration no. and KRA PIN. The PIN
-- is required by clause 5.10 but collected during onboarding, so it
-- stays nullable here rather than blocking acceptance.
ALTER TABLE "Owner" ADD COLUMN     "idNumber" TEXT,
ADD COLUMN     "kraPin" TEXT;

-- AlterTable
-- Schedule 1 property and money terms. launchedAt is the clause 1.4
-- "Launch Date" that the three-month Initial Commitment Period runs
-- from, recorded by the system when the listing goes live.
ALTER TABLE "Property" ADD COLUMN     "forecastMonthlyFee" DECIMAL(12,2),
ADD COLUMN     "launchedAt" TIMESTAMP(3),
ADD COLUMN     "maxOccupancy" INTEGER,
ADD COLUMN     "operatingReserve" DECIMAL(12,2),
ADD COLUMN     "startupCostsBudget" DECIMAL(12,2);

-- AlterTable
-- template/templateVersion pin which clause set a row was rendered
-- under. reference is the GS-YYYY-### shown on the contract;
-- acceptanceReference is the receipt handed back after one-click
-- acceptance. Both unique so a concurrent issue or accept cannot mint
-- a duplicate, both nullable because pre-existing rows have neither.
ALTER TABLE "ManagementAgreement" ADD COLUMN     "acceptanceReference" TEXT,
ADD COLUMN     "acceptedByUserId" TEXT,
ADD COLUMN     "forecastMonthlyFee" DECIMAL(12,2),
ADD COLUMN     "operatingReserve" DECIMAL(12,2),
ADD COLUMN     "reference" TEXT,
ADD COLUMN     "startupCostsBudget" DECIMAL(12,2),
ADD COLUMN     "template" "AgreementTemplate" NOT NULL DEFAULT 'GENERIC_MANAGEMENT_V1',
ADD COLUMN     "templateVersion" TEXT NOT NULL DEFAULT 'generic-management-v1';

-- CreateIndex
CREATE UNIQUE INDEX "ManagementAgreement_reference_key" ON "ManagementAgreement"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "ManagementAgreement_acceptanceReference_key" ON "ManagementAgreement"("acceptanceReference");
