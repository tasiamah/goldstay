-- Server-side record of WhatsApp CTA clicks, plus the Google Ads
-- click id on leads.
--
-- Additive only: one new table, one nullable column on Lead and two
-- indexes. No row is changed and nothing is backfilled, so it is safe
-- to apply ahead of the deploy that writes it.
--
-- Why the column. Google Ads auto-tagging appends `gclid` to the
-- landing URL and nothing else. It does not set utm_medium, which is
-- what classifyReferrer used to decide "paid", so before this every ad
-- click was being filed as organic search. More importantly the funnel
-- ends in WhatsApp: Google can observe a button press but not the
-- client who signs six weeks later, and uploading a conversion against
-- this gclid is the only way to let the campaign optimise for real
-- business rather than for cheap clicks. 90 days is the longest window
-- Ads accepts an upload for, which is why the cookie behind it expires
-- then too.
--
-- Why the table, when GA4 already fires generate_lead on these clicks.
-- Client-side analytics is dropped by ad blockers, iOS Safari and
-- in-app browsers at a rate we cannot measure, and an underreported
-- campaign looks exactly like a campaign that is not working. A row
-- written by our own server on the redirect request itself cannot be
-- blocked, so the two counts read together show the shortfall. GA4
-- also keeps no click id.
--
-- No foreign key to Lead on purpose. Most clicks never become a lead,
-- and the ones that do are joined afterwards on gclid or by an
-- operator reading the "(Sent from ...)" footnote in the thread. A
-- foreign key would mean inventing a Lead per click or leaving the
-- column almost entirely null.

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN "gclid" TEXT;

-- CreateIndex
CREATE INDEX "Lead_gclid_idx" ON "Lead"("gclid");

-- CreateTable
CREATE TABLE "WhatsAppClick" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "intent" TEXT NOT NULL,
    "pagePath" TEXT,
    "gclid" TEXT,
    "wbraid" TEXT,
    "gbraid" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmTerm" TEXT,
    "utmContent" TEXT,
    "landingPath" TEXT,
    "referrer" TEXT,
    "channel" TEXT,
    "ipCountry" TEXT,
    "device" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhatsAppClick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WhatsAppClick_createdAt_idx" ON "WhatsAppClick"("createdAt");
CREATE INDEX "WhatsAppClick_source_createdAt_idx" ON "WhatsAppClick"("source", "createdAt");
CREATE INDEX "WhatsAppClick_gclid_idx" ON "WhatsAppClick"("gclid");
CREATE INDEX "WhatsAppClick_utmCampaign_createdAt_idx" ON "WhatsAppClick"("utmCampaign", "createdAt");
