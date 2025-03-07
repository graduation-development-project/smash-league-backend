/*
  Warnings:

  - You are about to drop the column `numberOfSets` on the `TournamentEvent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TournamentEvent" DROP COLUMN "numberOfSets",
ADD COLUMN     "numberOfGames" INTEGER NOT NULL DEFAULT 3;
