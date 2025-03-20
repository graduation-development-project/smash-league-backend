/*
  Warnings:

  - Added the required column `belongsToUserId` to the `TournamentSerie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tournament" ALTER COLUMN "tournamentSerieId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TournamentSerie" ADD COLUMN     "belongsToUserId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TournamentSerie" ADD CONSTRAINT "TournamentSerie_belongsToUserId_fkey" FOREIGN KEY ("belongsToUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
