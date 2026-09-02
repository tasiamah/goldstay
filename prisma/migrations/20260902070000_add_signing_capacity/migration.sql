-- Records the capacity in which a client signs the management
-- agreement for a property: registered owner, rent-to-rent leaseholder
-- letting with the owner's written consent, or someone signing on the
-- owner's behalf under a power of attorney / directorship.
--
-- Purely additive. Both columns default to REGISTERED_OWNER, which is
-- the warranty every existing row was already signed under, so no
-- backfill is required.
--
-- Note: the owner -> client rename that landed alongside this migration
-- is Prisma-level only (@@map / @map), so no tables, columns or enums
-- are renamed here.

-- CreateEnum
CREATE TYPE "SigningCapacity" AS ENUM ('REGISTERED_OWNER', 'AUTHORISED_LEASEHOLDER', 'AUTHORISED_REPRESENTATIVE');

-- AlterTable
ALTER TABLE "Property" ADD COLUMN "signingCapacity" "SigningCapacity" NOT NULL DEFAULT 'REGISTERED_OWNER';

-- AlterTable
ALTER TABLE "ManagementAgreement" ADD COLUMN "signingCapacity" "SigningCapacity" NOT NULL DEFAULT 'REGISTERED_OWNER';
