/*
  Warnings:

  - Added the required column `type` to the `UserReport` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('TOURNAMENT', 'ATHLETE');

-- AlterTable
ALTER TABLE "UserReport" ADD COLUMN     "reportToUserId" TEXT,
ADD COLUMN     "tournamentEventId" TEXT,
ADD COLUMN     "type" "ReportType" NOT NULL;

-- AddForeignKey
ALTER TABLE "UserReport" ADD CONSTRAINT "UserReport_reportToUserId_fkey" FOREIGN KEY ("reportToUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReport" ADD CONSTRAINT "UserReport_tournamentEventId_fkey" FOREIGN KEY ("tournamentEventId") REFERENCES "TournamentEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
