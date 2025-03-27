/*
  Warnings:

  - The values [WOMEN_SINGLE] on the enum `BadmintonParticipantType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BadmintonParticipantType_new" AS ENUM ('MENS_SINGLE', 'WOMENS_SINGLE', 'MENS_DOUBLE', 'WOMENS_DOUBLE', 'MIXED_DOUBLE');
ALTER TABLE "TournamentEvent" ALTER COLUMN "tournamentEvent" TYPE "BadmintonParticipantType_new" USING ("tournamentEvent"::text::"BadmintonParticipantType_new");
ALTER TYPE "BadmintonParticipantType" RENAME TO "BadmintonParticipantType_old";
ALTER TYPE "BadmintonParticipantType_new" RENAME TO "BadmintonParticipantType";
DROP TYPE "BadmintonParticipantType_old";
COMMIT;
