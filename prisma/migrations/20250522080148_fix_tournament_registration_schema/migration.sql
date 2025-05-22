/*
  Warnings:

  - Made the column `tournamentId` on table `TournamentRegistration` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TournamentRegistration" ALTER COLUMN "tournamentId" SET NOT NULL;
