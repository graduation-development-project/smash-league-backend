/*
  Warnings:

  - Added the required column `minimumAthlete` to the `TournamentEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "mainColor" TEXT;

-- AlterTable
ALTER TABLE "TournamentEvent" ADD COLUMN     "minimumAthlete" INTEGER NOT NULL;
