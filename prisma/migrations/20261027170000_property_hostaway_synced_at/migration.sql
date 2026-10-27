-- Records when a Hostaway listing last produced reservations, so a
-- listing that was linked but never synced can be told apart from one
-- that is genuinely empty.
ALTER TABLE "Property" ADD COLUMN "hostawaySyncedAt" TIMESTAMP(3);
