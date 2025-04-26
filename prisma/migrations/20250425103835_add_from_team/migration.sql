-- AlterTable
ALTER TABLE "TournamentParticipants" ADD COLUMN     "fromTeamId" TEXT;

-- AddForeignKey
ALTER TABLE "TournamentParticipants" ADD CONSTRAINT "TournamentParticipants_fromTeamId_fkey" FOREIGN KEY ("fromTeamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
