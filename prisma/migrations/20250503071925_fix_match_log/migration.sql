/*
  Warnings:

  - You are about to drop the column `matchId` on the `MatchLog` table. All the data in the column will be lost.
  - Added the required column `gameId` to the `MatchLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MatchLog" DROP CONSTRAINT "MatchLog_matchId_fkey";

-- AlterTable
ALTER TABLE "MatchLog" DROP COLUMN "matchId",
ADD COLUMN     "gameId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "MatchLog" ADD CONSTRAINT "MatchLog_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
