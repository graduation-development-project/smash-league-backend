/*
  Warnings:

  - The values [CANCEL] on the enum `TournamentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "TournamentEventStatus" ADD VALUE 'CANCELED';

-- AlterEnum
BEGIN;
CREATE TYPE "TournamentStatus_new" AS ENUM ('CREATED', 'OPENING', 'OPENING_FOR_REGISTRATION', 'DRAWING', 'ON_GOING', 'FINISHED', 'CANCELED');
ALTER TABLE "Tournament" ALTER COLUMN "status" TYPE "TournamentStatus_new" USING ("status"::text::"TournamentStatus_new");
ALTER TYPE "TournamentStatus" RENAME TO "TournamentStatus_old";
ALTER TYPE "TournamentStatus_new" RENAME TO "TournamentStatus";
DROP TYPE "TournamentStatus_old";
COMMIT;
