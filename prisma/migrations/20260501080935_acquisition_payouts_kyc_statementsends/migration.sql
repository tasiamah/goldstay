-- CreateEnum
CREATE TYPE "PayoutMethodKind" AS ENUM ('WISE', 'SWIFT_BANK', 'LOCAL_BANK', 'MPESA');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('WEBSITE', 'WHATSAPP', 'EMAIL', 'REFERRAL', 'OUTBOUND_SCRAPE', 'OTHER');

-- (DocumentKind enum extensions live in the immediately preceding
-- migration 20260501080900_add_owner_document_kinds so that the
-- new values are committed before any table can depend on them.)

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "ownerId" TEXT,
ALTER COLUMN "propertyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "payoutMethodId" TEXT;

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "source" "LeadSource" NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "residenceCountry" TEXT,
    "country" "Country",
    "city" TEXT,
    "neighbourhood" TEXT,
    "propertyType" TEXT,
    "bedrooms" TEXT,
    "furnished" TEXT,
    "serviceInterest" TEXT,
    "availability" TEXT,
    "notes" TEXT,
    "submissionHash" TEXT,
    "contactedAt" TIMESTAMP(3),
    "qualifiedAt" TIMESTAMP(3),
    "convertedAt" TIMESTAMP(3),
    "convertedOwnerId" TEXT,
    "lostAt" TIMESTAMP(3),
    "lostReason" TEXT,
    "ownerAdminId" TEXT,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnerPayoutMethod" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "kind" "PayoutMethodKind" NOT NULL,
    "label" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "beneficiaryName" TEXT NOT NULL,
    "bankName" TEXT,
    "bankCountry" TEXT,
    "branchCode" TEXT,
    "accountNumber" TEXT,
    "iban" TEXT,
    "swift" TEXT,
    "wiseEmail" TEXT,
    "mpesaPhone" TEXT,
    "beneficiaryAddress" TEXT,
    "internalNotes" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "verifiedByAdminId" TEXT,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OwnerPayoutMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatementSend" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "periodYear" INTEGER NOT NULL,
    "periodMonth" INTEGER NOT NULL,
    "status" "CommunicationStatus" NOT NULL DEFAULT 'QUEUED',
    "providerId" TEXT,
    "summary" TEXT,
    "error" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StatementSend_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_submissionHash_key" ON "Lead"("submissionHash");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_convertedOwnerId_key" ON "Lead"("convertedOwnerId");

-- CreateIndex
CREATE INDEX "Lead_status_createdAt_idx" ON "Lead"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Lead_country_status_idx" ON "Lead"("country", "status");

-- CreateIndex
CREATE INDEX "Lead_ownerAdminId_status_idx" ON "Lead"("ownerAdminId", "status");

-- CreateIndex
CREATE INDEX "Lead_archivedAt_idx" ON "Lead"("archivedAt");

-- CreateIndex
CREATE INDEX "OwnerPayoutMethod_ownerId_archivedAt_idx" ON "OwnerPayoutMethod"("ownerId", "archivedAt");

-- CreateIndex
CREATE INDEX "OwnerPayoutMethod_ownerId_isDefault_idx" ON "OwnerPayoutMethod"("ownerId", "isDefault");

-- CreateIndex
CREATE INDEX "StatementSend_periodYear_periodMonth_idx" ON "StatementSend"("periodYear", "periodMonth");

-- CreateIndex
CREATE INDEX "StatementSend_status_idx" ON "StatementSend"("status");

-- CreateIndex
CREATE UNIQUE INDEX "StatementSend_ownerId_periodYear_periodMonth_key" ON "StatementSend"("ownerId", "periodYear", "periodMonth");

-- CreateIndex
CREATE INDEX "Document_ownerId_kind_idx" ON "Document"("ownerId", "kind");

-- CreateIndex
CREATE INDEX "Transaction_payoutMethodId_idx" ON "Transaction"("payoutMethodId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_payoutMethodId_fkey" FOREIGN KEY ("payoutMethodId") REFERENCES "OwnerPayoutMethod"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_ownerAdminId_fkey" FOREIGN KEY ("ownerAdminId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnerPayoutMethod" ADD CONSTRAINT "OwnerPayoutMethod_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatementSend" ADD CONSTRAINT "StatementSend_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
