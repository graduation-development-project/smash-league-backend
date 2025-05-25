/*
  Warnings:

  - Added the required column `winningParticipantId` to the `EventPrize` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventPrize" ADD COLUMN     "winningParticipantId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "EventPrize" ADD CONSTRAINT "EventPrize_winningParticipantId_fkey" FOREIGN KEY ("winningParticipantId") REFERENCES "TournamentParticipants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
