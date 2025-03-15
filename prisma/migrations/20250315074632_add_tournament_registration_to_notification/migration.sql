-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "tournamentRegistrationId" TEXT;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_tournamentRegistrationId_fkey" FOREIGN KEY ("tournamentRegistrationId") REFERENCES "TournamentRegistration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
