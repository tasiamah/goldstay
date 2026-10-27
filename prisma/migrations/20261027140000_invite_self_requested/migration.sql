-- Lets an expired welcome link offer "send me a new one", and records
-- that the landlord asked rather than an operator noticing.
--
-- Additive: existing rows keep their reason, and code that does not
-- know this value still reads every row fine.
ALTER TYPE "ClientInviteReason" ADD VALUE IF NOT EXISTS 'SELF_REQUESTED';
