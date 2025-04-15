/*
  Warnings:

  - A unique constraint covering the columns `[tournamentId,tournamentEventId,userId,partnerId]` on the table `TournamentRegistration` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TournamentRegistration_tournamentId_partnerId_key";

-- CreateIndex
CREATE UNIQUE INDEX "TournamentRegistration_tournamentId_tournamentEventId_userI_key" ON "TournamentRegistration"("tournamentId", "tournamentEventId", "userId", "partnerId");
