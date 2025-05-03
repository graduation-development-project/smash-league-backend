/*
  Warnings:

  - You are about to drop the `Point` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `timeStart` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('WARNING', 'MEDICAL', 'FAULT', 'MISCONDUCT', 'COACHING_VIOLATION');

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "timeEnd" TIMESTAMP(3),
ADD COLUMN     "timeStart" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "timeEnd" TIMESTAMP(3),
ADD COLUMN     "timeStart" TIMESTAMP(3);

-- DropTable
DROP TABLE "Point";

-- CreateTable
CREATE TABLE "MatchLog" (
    "id" TEXT NOT NULL,
    "log" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "logType" "LogType" NOT NULL,
    "matchId" TEXT NOT NULL,

    CONSTRAINT "MatchLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MatchLog" ADD CONSTRAINT "MatchLog_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;
