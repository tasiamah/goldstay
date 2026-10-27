-- A second landlord who can see a unit they co-own, without becoming
-- the owner of record who gets paid.
--
-- Additive only. Property.clientId is untouched, so a deploy running
-- the old code against this schema behaves exactly as before.

CREATE TABLE "PropertyCoOwner" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "relationship" TEXT,
    "addedByEmail" TEXT,
    "removedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyCoOwner_pkey" PRIMARY KEY ("id")
);

-- One row per client per property: re-adding someone previously
-- removed clears removedAt rather than making a second row.
CREATE UNIQUE INDEX "PropertyCoOwner_propertyId_clientId_key"
    ON "PropertyCoOwner"("propertyId", "clientId");

-- Supports the hot path: "which properties may this client see?"
CREATE INDEX "PropertyCoOwner_clientId_removedAt_idx"
    ON "PropertyCoOwner"("clientId", "removedAt");
CREATE INDEX "PropertyCoOwner_propertyId_idx"
    ON "PropertyCoOwner"("propertyId");

ALTER TABLE "PropertyCoOwner"
    ADD CONSTRAINT "PropertyCoOwner_propertyId_fkey"
    FOREIGN KEY ("propertyId") REFERENCES "Property"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- The physical clients table predates the owner -> client rename.
ALTER TABLE "PropertyCoOwner"
    ADD CONSTRAINT "PropertyCoOwner_clientId_fkey"
    FOREIGN KEY ("clientId") REFERENCES "Owner"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
