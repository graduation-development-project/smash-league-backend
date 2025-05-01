/*
  Warnings:

  - Made the column `tournamentEventId` on table `PaybackFeeList` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'HANDLED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "PaybackFeeList" DROP CONSTRAINT "PaybackFeeList_tournamentEventId_fkey";

-- AlterTable
ALTER TABLE "PaybackFeeList" ALTER COLUMN "tournamentEventId" SET NOT NULL;

-- CreateTable
CREATE TABLE "UserReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaybackFeeList" ADD CONSTRAINT "PaybackFeeList_tournamentEventId_fkey" FOREIGN KEY ("tournamentEventId") REFERENCES "TournamentEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReport" ADD CONSTRAINT "UserReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReport" ADD CONSTRAINT "UserReport_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;
