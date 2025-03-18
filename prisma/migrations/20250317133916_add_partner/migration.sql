-- AlterTable
ALTER TABLE "TournamentParticipants" ADD COLUMN     "partnerId" TEXT;

-- AddForeignKey
ALTER TABLE "TournamentParticipants" ADD CONSTRAINT "TournamentParticipants_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
