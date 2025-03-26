/*
  Warnings:

  - You are about to drop the column `forfeitCompetitor` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `leftCompetitor` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `matchWonByCompetitor` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `rightCompetitor` on the `Match` table. All the data in the column will be lost.
  - Added the required column `currentServerId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameWonByCompetitorId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leftCompetitorId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matchWonByCompetitorId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rightCompetitorId` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "currentServerId" TEXT NOT NULL,
ADD COLUMN     "gameWonByCompetitorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "forfeitCompetitor",
DROP COLUMN "leftCompetitor",
DROP COLUMN "matchWonByCompetitor",
DROP COLUMN "rightCompetitor",
ADD COLUMN     "forfeitCompetitorId" TEXT,
ADD COLUMN     "leftCompetitorId" TEXT NOT NULL,
ADD COLUMN     "matchWonByCompetitorId" TEXT NOT NULL,
ADD COLUMN     "rightCompetitorId" TEXT NOT NULL,
ALTER COLUMN "leftCompetitorAttendance" DROP NOT NULL,
ALTER COLUMN "leftCompetitorAttendance" SET DEFAULT false,
ALTER COLUMN "rightCompetitorAttendance" DROP NOT NULL,
ALTER COLUMN "rightCompetitorAttendance" SET DEFAULT false,
ALTER COLUMN "startedWhen" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Point" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Point_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_leftCompetitorId_fkey" FOREIGN KEY ("leftCompetitorId") REFERENCES "TournamentParticipants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_rightCompetitorId_fkey" FOREIGN KEY ("rightCompetitorId") REFERENCES "TournamentParticipants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_forfeitCompetitorId_fkey" FOREIGN KEY ("forfeitCompetitorId") REFERENCES "TournamentParticipants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_matchWonByCompetitorId_fkey" FOREIGN KEY ("matchWonByCompetitorId") REFERENCES "TournamentParticipants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_umpireId_fkey" FOREIGN KEY ("umpireId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_currentServerId_fkey" FOREIGN KEY ("currentServerId") REFERENCES "TournamentParticipants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_gameWonByCompetitorId_fkey" FOREIGN KEY ("gameWonByCompetitorId") REFERENCES "TournamentParticipants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
