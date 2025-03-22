-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('NOT_STARTED', 'ON_GOING', 'INTERVAL', 'ENDED');

-- CreateTable
CREATE TABLE "Stage" (
    "id" TEXT NOT NULL,
    "stageName" TEXT NOT NULL,

    CONSTRAINT "Stage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "matchStatus" "MatchStatus" NOT NULL,
    "leftCompetitor" TEXT NOT NULL,
    "rightCompetitor" TEXT NOT NULL,
    "leftCompetitorAttendance" BOOLEAN NOT NULL,
    "rightCompetitorAttendance" BOOLEAN NOT NULL,
    "startedWhen" TIMESTAMP(3) NOT NULL,
    "forfeitCompetitor" TEXT NOT NULL,
    "matchWonByCompetitor" TEXT NOT NULL,
    "umpireId" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "leftCompetitorPoint" INTEGER NOT NULL,
    "rightCompetitorPoint" INTEGER NOT NULL,
    "gameNumber" INTEGER NOT NULL,
    "matchId" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;
