-- CreateEnum
CREATE TYPE "ReferrerType" AS ENUM ('LANDLORD', 'AGENT', 'PARTNER');

-- CreateEnum
CREATE TYPE "ReferrerStatus" AS ENUM ('ACTIVE', 'PAUSED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('ATTRIBUTED', 'CONTACTED', 'QUALIFIED', 'SIGNED', 'CHURNED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('SCHEDULED', 'PAID', 'CANCELLED');

-- CreateTable
CREATE TABLE "Referrer" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "dashboardToken" TEXT NOT NULL,
    "type" "ReferrerType" NOT NULL,
    "status" "ReferrerStatus" NOT NULL DEFAULT 'ACTIVE',
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "companyName" TEXT,
    "country" TEXT,
    "longTermPctOverride" DECIMAL(5,4),
    "shortStayPctOverride" DECIMAL(5,4),
    "payoutMonthsOverride" INTEGER,
    "notes" TEXT,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Referrer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "airtableLeadId" TEXT,
    "landlordName" TEXT NOT NULL,
    "landlordEmail" TEXT,
    "landlordPhone" TEXT,
    "city" TEXT,
    "status" "ReferralStatus" NOT NULL DEFAULT 'ATTRIBUTED',
    "contactedAt" TIMESTAMP(3),
    "signedAt" TIMESTAMP(3),
    "monthlyRentUsd" DECIMAL(12,2),
    "managementFeePct" DECIMAL(5,4),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralPayout" (
    "id" TEXT NOT NULL,
    "referralId" TEXT NOT NULL,
    "monthIndex" INTEGER NOT NULL,
    "amountUsd" DECIMAL(12,2) NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "paidReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReferralPayout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Referrer_code_key" ON "Referrer"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Referrer_dashboardToken_key" ON "Referrer"("dashboardToken");

-- CreateIndex
CREATE UNIQUE INDEX "Referrer_email_key" ON "Referrer"("email");

-- CreateIndex
CREATE INDEX "Referrer_status_idx" ON "Referrer"("status");

-- CreateIndex
CREATE INDEX "Referrer_type_idx" ON "Referrer"("type");

-- CreateIndex
CREATE INDEX "Referrer_archivedAt_idx" ON "Referrer"("archivedAt");

-- CreateIndex
CREATE INDEX "Referral_referrerId_status_idx" ON "Referral"("referrerId", "status");

-- CreateIndex
CREATE INDEX "Referral_airtableLeadId_idx" ON "Referral"("airtableLeadId");

-- CreateIndex
CREATE INDEX "Referral_status_idx" ON "Referral"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralPayout_referralId_monthIndex_key" ON "ReferralPayout"("referralId", "monthIndex");

-- CreateIndex
CREATE INDEX "ReferralPayout_status_scheduledFor_idx" ON "ReferralPayout"("status", "scheduledFor");

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "Referrer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralPayout" ADD CONSTRAINT "ReferralPayout_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "Referral"("id") ON DELETE CASCADE ON UPDATE CASCADE;
