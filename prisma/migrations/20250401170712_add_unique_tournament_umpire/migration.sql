/*
  Warnings:

  - A unique constraint covering the columns `[userId,tournamentId]` on the table `TournamentUmpires` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TournamentUmpires_userId_tournamentId_key" ON "TournamentUmpires"("userId", "tournamentId");
