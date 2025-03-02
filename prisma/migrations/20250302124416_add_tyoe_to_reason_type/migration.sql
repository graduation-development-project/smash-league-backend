/*
  Warnings:

  - The values [OUT_TEAM] on the enum `ReasonType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReasonType_new" AS ENUM ('TOURNAMENT_REGISTRATION_REJECTION', 'USER_VERIFICATION_REJECTION', 'REMOVE_TEAM_MEMBER', 'OUT_TEAM_REJECTION', 'JOIN_TEAM_REJECTION');
ALTER TABLE "Reason" ALTER COLUMN "type" TYPE "ReasonType_new" USING ("type"::text::"ReasonType_new");
ALTER TYPE "ReasonType" RENAME TO "ReasonType_old";
ALTER TYPE "ReasonType_new" RENAME TO "ReasonType";
DROP TYPE "ReasonType_old";
COMMIT;
