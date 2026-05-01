-- Free-form postal address on Owner. Nullable so existing rows
-- don't need a backfill — owners populate it via /owner/profile.
ALTER TABLE "Owner" ADD COLUMN "address" TEXT;
