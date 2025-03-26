/*
  Warnings:

  - Added the required column `tournamentEventId` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "tournamentEventId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_tournamentEventId_fkey" FOREIGN KEY ("tournamentEventId") REFERENCES "TournamentEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
