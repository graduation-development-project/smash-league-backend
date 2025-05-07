-- DropForeignKey
ALTER TABLE "PaybackFee" DROP CONSTRAINT "PaybackFee_tournamentEventId_fkey";

-- AlterTable
ALTER TABLE "PaybackFee" ALTER COLUMN "tournamentEventId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PaybackFee" ADD CONSTRAINT "PaybackFee_tournamentEventId_fkey" FOREIGN KEY ("tournamentEventId") REFERENCES "TournamentEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
