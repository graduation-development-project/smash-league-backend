-- CreateTable
CREATE TABLE "TournamentUmpires" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TournamentUmpires_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TournamentUmpires" ADD CONSTRAINT "TournamentUmpires_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentUmpires" ADD CONSTRAINT "TournamentUmpires_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
