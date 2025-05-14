-- CreateEnum
CREATE TYPE "PrizeType" AS ENUM ('ChampionshipPrize', 'RunnerUpPrize', 'ThirdPlacePrize', 'Others');

-- CreateTable
CREATE TABLE "EventPrize" (
    "id" TEXT NOT NULL,
    "prizeName" TEXT NOT NULL,
    "prize" TEXT NOT NULL,
    "prizeType" "PrizeType" NOT NULL,
    "tournamentEventId" TEXT NOT NULL,

    CONSTRAINT "EventPrize_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventPrize" ADD CONSTRAINT "EventPrize_tournamentEventId_fkey" FOREIGN KEY ("tournamentEventId") REFERENCES "TournamentEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
