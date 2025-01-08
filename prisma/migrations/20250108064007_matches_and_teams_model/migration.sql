/*
  Warnings:

  - You are about to drop the `Article` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Article";

-- CreateTable
CREATE TABLE "Teams" (
    "team_id" SERIAL NOT NULL,
    "team_name" TEXT NOT NULL,

    CONSTRAINT "Teams_pkey" PRIMARY KEY ("team_id")
);

-- CreateTable
CREATE TABLE "Matches" (
    "match_id" SERIAL NOT NULL,
    "stage" INTEGER NOT NULL,
    "team1_id" INTEGER NOT NULL,
    "team2_id" INTEGER NOT NULL,
    "team1_score" INTEGER NOT NULL DEFAULT 0,
    "team2_score" INTEGER NOT NULL DEFAULT 0,
    "winner_id" INTEGER NOT NULL,
    "match_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Matches_pkey" PRIMARY KEY ("match_id")
);
