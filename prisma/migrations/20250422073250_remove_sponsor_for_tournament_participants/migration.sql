/*
  Warnings:

  - You are about to drop the column `sponsorId` on the `TournamentParticipants` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TournamentParticipants" DROP CONSTRAINT "TournamentParticipants_sponsorId_fkey";

-- AlterTable
ALTER TABLE "TournamentParticipants" DROP COLUMN "sponsorId";
