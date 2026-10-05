-- Prepaid electricity tokens, water and internet are recurring costs on
-- a unit and were going in as a generic EXPENSE. One type covers all
-- three; which utility it was stays in the description, which the
-- statement now prints on its own line.
--
-- Additive only: existing EXPENSE rows keep their meaning.
ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'UTILITIES' AFTER 'REPAIR';
