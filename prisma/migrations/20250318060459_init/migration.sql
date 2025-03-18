/*
  Warnings:

  - You are about to drop the `TournamentParticipants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TournamentParticipants" DROP CONSTRAINT "TournamentParticipants_partnerId_fkey";

-- DropForeignKey
ALTER TABLE "TournamentParticipants" DROP CONSTRAINT "TournamentParticipants_tournamentEventId_fkey";

-- DropForeignKey
ALTER TABLE "TournamentParticipants" DROP CONSTRAINT "TournamentParticipants_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "TournamentParticipants" DROP CONSTRAINT "TournamentParticipants_userId_fkey";

-- DropTable
DROP TABLE "TournamentParticipants";
