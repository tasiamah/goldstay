-- Add OwnerEntityType enum + entityType, companyRegistrationNumber columns
-- on Owner. Both additive; existing rows default to INDIVIDUAL which matches
-- the previous behaviour (companyName treated as optional, never required to
-- mark setup complete).

CREATE TYPE "OwnerEntityType" AS ENUM ('INDIVIDUAL', 'COMPANY');

ALTER TABLE "Owner"
  ADD COLUMN "entityType" "OwnerEntityType" NOT NULL DEFAULT 'INDIVIDUAL',
  ADD COLUMN "companyRegistrationNumber" TEXT;
