/*
  Warnings:

  - Made the column `tournamentEventStatus` on table `TournamentEvent` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TournamentEvent" ALTER COLUMN "tournamentEventStatus" SET NOT NULL;

-- AlterTable
ALTER TABLE "TournamentRegistration" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
