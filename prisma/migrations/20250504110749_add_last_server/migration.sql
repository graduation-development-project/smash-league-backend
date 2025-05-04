-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "lastServerId" TEXT;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_lastServerId_fkey" FOREIGN KEY ("lastServerId") REFERENCES "TournamentParticipants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
