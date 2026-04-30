-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('LONG_TERM', 'SHORT_TERM');

-- CreateEnum
CREATE TYPE "BookingSource" AS ENUM ('AIRBNB', 'BOOKING_COM', 'VRBO', 'DIRECT');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('CONFIRMED', 'CANCELLED', 'COMPLETED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TransactionType" ADD VALUE 'OTA_COMMISSION';
ALTER TYPE "TransactionType" ADD VALUE 'CLEANING_FEE';
ALTER TYPE "TransactionType" ADD VALUE 'GUEST_REFUND';
ALTER TYPE "TransactionType" ADD VALUE 'GOLDSTAY_COMMISSION';

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "hostawayListingId" TEXT,
ADD COLUMN     "propertyType" "PropertyType" NOT NULL DEFAULT 'LONG_TERM';

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "bookingId" TEXT;

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "source" "BookingSource" NOT NULL,
    "externalId" TEXT,
    "guestName" TEXT NOT NULL,
    "guestEmail" TEXT,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3) NOT NULL,
    "nights" INTEGER NOT NULL,
    "grossAmount" DECIMAL(12,2) NOT NULL,
    "otaCommission" DECIMAL(12,2),
    "cleaningFee" DECIMAL(12,2),
    "netPayout" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "status" "BookingStatus" NOT NULL DEFAULT 'CONFIRMED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Booking_propertyId_checkIn_idx" ON "Booking"("propertyId", "checkIn");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_source_externalId_key" ON "Booking"("source", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Property_hostawayListingId_key" ON "Property"("hostawayListingId");

-- CreateIndex
CREATE INDEX "Property_propertyType_idx" ON "Property"("propertyType");

-- CreateIndex
CREATE INDEX "Transaction_bookingId_idx" ON "Transaction"("bookingId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

