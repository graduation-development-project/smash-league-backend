-- CreateTable
CREATE TABLE "TournamentParticipants" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tournamentEventId" TEXT NOT NULL,
    "partnerId" TEXT,

    CONSTRAINT "TournamentParticipants_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TournamentParticipants" ADD CONSTRAINT "TournamentParticipants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentParticipants" ADD CONSTRAINT "TournamentParticipants_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentParticipants" ADD CONSTRAINT "TournamentParticipants_tournamentEventId_fkey" FOREIGN KEY ("tournamentEventId") REFERENCES "TournamentEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentParticipants" ADD CONSTRAINT "TournamentParticipants_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;
