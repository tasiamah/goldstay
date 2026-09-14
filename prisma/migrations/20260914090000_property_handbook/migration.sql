-- Operating notes for a short let, owned by the client: access
-- instructions, WiFi, electricity tokens, water and pump, security
-- contact, parking, building rules and appliance quirks.
--
-- Additive only. One new table, no change to any existing column or
-- type, so it is safe to apply ahead of the deploy that reads it —
-- which is the order AGENTS.md requires regardless.
--
-- The rationale for a separate table rather than ten more columns on
-- Property is in the PropertyHandbook comment in
-- prisma/schema.prisma. In short: Property already carries thirty-odd
-- fields and these would be null on every long-let row, and the
-- handbook needs an `updatedAt` that means "when was this last
-- confirmed" rather than "when did a booking last land".

-- CreateTable
CREATE TABLE "PropertyHandbook" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "checkInNotes" TEXT,
    "wifiNetwork" TEXT,
    "wifiPassword" TEXT,
    "electricityNotes" TEXT,
    "waterNotes" TEXT,
    "securityContact" TEXT,
    "parkingNotes" TEXT,
    "buildingRules" TEXT,
    "applianceNotes" TEXT,
    "otherNotes" TEXT,
    "updatedByEmail" TEXT,
    "updatedByAdminId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyHandbook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
-- One handbook per property. The unique constraint is what makes the
-- write path a plain upsert on propertyId rather than a read-then-
-- decide, so two operators saving the same handbook at once cannot
-- leave two rows behind.
CREATE UNIQUE INDEX "PropertyHandbook_propertyId_key" ON "PropertyHandbook"("propertyId");

-- AddForeignKey
-- Cascade: a handbook describes one property and means nothing
-- without it.
ALTER TABLE "PropertyHandbook" ADD CONSTRAINT "PropertyHandbook_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
