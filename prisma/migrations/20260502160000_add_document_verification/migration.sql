-- Document verification fields. We add two nullable columns so the
-- migration is non-blocking on existing data: every Document row
-- starts as "uploaded but not yet verified" until an admin reviews
-- it on /admin/properties/<id>.
--
-- The owner-facing UI reads `verifiedAt` to render the
-- "Pending verification" vs "Verified by Goldstay" pill on each
-- doc the owner uploaded for their property; the property-level
-- verified badge follows from PropertyStatus (admin still flips
-- ONBOARDING → ACTIVE). Adding a real foreign key for
-- verifiedByAdminId would force the existing AdminUser table into
-- the migration's transaction and the field is rarely read; we
-- keep it as a free String so this migration is a single ALTER.

ALTER TABLE "Document"
  ADD COLUMN "verifiedAt" TIMESTAMP(3),
  ADD COLUMN "verifiedByAdminId" TEXT;
