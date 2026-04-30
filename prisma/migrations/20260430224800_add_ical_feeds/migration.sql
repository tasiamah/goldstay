-- CreateTable
CREATE TABLE "PropertyIcalFeed" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "source" "BookingSource" NOT NULL,
    "url" TEXT NOT NULL,
    "lastSyncedAt" TIMESTAMP(3),
    "lastSuccessAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyIcalFeed_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PropertyIcalFeed_propertyId_idx" ON "PropertyIcalFeed"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyIcalFeed_propertyId_source_key" ON "PropertyIcalFeed"("propertyId", "source");

-- AddForeignKey
ALTER TABLE "PropertyIcalFeed" ADD CONSTRAINT "PropertyIcalFeed_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

