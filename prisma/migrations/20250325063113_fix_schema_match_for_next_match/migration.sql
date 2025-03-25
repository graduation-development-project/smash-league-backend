/*
  Warnings:

  - Added the required column `nextMatchId` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "currentServerId" DROP NOT NULL,
ALTER COLUMN "gameWonByCompetitorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "nextMatchId" TEXT NOT NULL,
ALTER COLUMN "umpireId" DROP NOT NULL,
ALTER COLUMN "leftCompetitorId" DROP NOT NULL,
ALTER COLUMN "matchWonByCompetitorId" DROP NOT NULL,
ALTER COLUMN "rightCompetitorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_nextMatchId_fkey" FOREIGN KEY ("nextMatchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;
