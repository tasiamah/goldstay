-- Record where a lead came from.
--
-- Additive only: eleven nullable columns and one index on an existing
-- table, no default backfill and no change to any row, so it is safe
-- to apply ahead of the deploy that writes it.
--
-- Why. In September 2026 the question "which search term did the
-- clients who found us at the top of Google actually use" turned out
-- to be unanswerable. Search Console had been created days earlier
-- and does not backfill queries from before verification, Analytics
-- had never been switched on, and the form recorded nothing at all
-- about origin. The Lead table held one row. The customers were the
-- last surviving copy of the answer and had to be asked by hand.
--
-- Note what these columns can and cannot hold. Google strips the
-- query from its organic referrer, so `referrer` will read
-- "https://www.google.com" and never the keyword. `searchTerm` is
-- populated from a question the landlord answers on the form, and
-- `utmTerm` from paid clicks we tag ourselves. Those two are the only
-- places an actual search phrase can come from.

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN "foundVia" TEXT;
ALTER TABLE "Lead" ADD COLUMN "searchTerm" TEXT;
ALTER TABLE "Lead" ADD COLUMN "channel" TEXT;
ALTER TABLE "Lead" ADD COLUMN "landingPath" TEXT;
ALTER TABLE "Lead" ADD COLUMN "referrer" TEXT;
ALTER TABLE "Lead" ADD COLUMN "utmSource" TEXT;
ALTER TABLE "Lead" ADD COLUMN "utmMedium" TEXT;
ALTER TABLE "Lead" ADD COLUMN "utmCampaign" TEXT;
ALTER TABLE "Lead" ADD COLUMN "utmTerm" TEXT;
ALTER TABLE "Lead" ADD COLUMN "utmContent" TEXT;
ALTER TABLE "Lead" ADD COLUMN "landedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Lead_channel_createdAt_idx" ON "Lead"("channel", "createdAt");
