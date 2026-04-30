-- CreateEnum
CREATE TYPE "AgreementStatus" AS ENUM ('DRAFT', 'SENT', 'SIGNED', 'CANCELLED');

-- AlterEnum
ALTER TYPE "DocumentKind" ADD VALUE 'MANAGEMENT_AGREEMENT';

-- CreateTable
CREATE TABLE "ManagementAgreement" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "termMonths" INTEGER NOT NULL,
    "commissionRate" DECIMAL(5,4) NOT NULL,
    "earlyExitFee" DECIMAL(12,2) NOT NULL,
    "earlyExitFeeCurrency" TEXT NOT NULL,
    "noticePeriodDays" INTEGER NOT NULL,
    "governingLaw" TEXT NOT NULL,
    "status" "AgreementStatus" NOT NULL DEFAULT 'DRAFT',
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),
    "signedAt" TIMESTAMP(3),
    "signedByName" TEXT,
    "signedByIp" TEXT,
    "signedByUserAgent" TEXT,
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManagementAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ManagementAgreement_documentId_key" ON "ManagementAgreement"("documentId");

-- CreateIndex
CREATE INDEX "ManagementAgreement_propertyId_idx" ON "ManagementAgreement"("propertyId");

-- CreateIndex
CREATE INDEX "ManagementAgreement_status_idx" ON "ManagementAgreement"("status");

-- AddForeignKey
ALTER TABLE "ManagementAgreement" ADD CONSTRAINT "ManagementAgreement_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagementAgreement" ADD CONSTRAINT "ManagementAgreement_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;
