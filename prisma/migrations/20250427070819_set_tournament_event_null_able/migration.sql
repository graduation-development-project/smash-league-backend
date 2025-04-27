-- DropForeignKey
ALTER TABLE "PaybackFeeList" DROP CONSTRAINT "PaybackFeeList_tournamentEventId_fkey";

-- AlterTable
ALTER TABLE "PaybackFeeList" ALTER COLUMN "tournamentEventId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TournamentEvent" ALTER COLUMN "winningPoint" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "PaybackFeeList" ADD CONSTRAINT "PaybackFeeList_tournamentEventId_fkey" FOREIGN KEY ("tournamentEventId") REFERENCES "TournamentEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
