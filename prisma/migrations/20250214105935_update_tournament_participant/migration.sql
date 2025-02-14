/*
  Warnings:

  - A unique constraint covering the columns `[tournamentId,userId,eventType]` on the table `TournamentParticipant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TournamentParticipant_tournamentId_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "TournamentParticipant_tournamentId_userId_eventType_key" ON "TournamentParticipant"("tournamentId", "userId", "eventType");
