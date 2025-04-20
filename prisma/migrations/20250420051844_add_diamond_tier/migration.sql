/*
  Warnings:

  - The values [PLATINUM,OTHER] on the enum `SponsorTier` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SponsorTier_new" AS ENUM ('DIAMOND', 'GOLD', 'SILVER', 'BRONZE');
ALTER TABLE "TournamentSponsor" ALTER COLUMN "tier" TYPE "SponsorTier_new" USING ("tier"::text::"SponsorTier_new");
ALTER TYPE "SponsorTier" RENAME TO "SponsorTier_old";
ALTER TYPE "SponsorTier_new" RENAME TO "SponsorTier";
DROP TYPE "SponsorTier_old";
COMMIT;
