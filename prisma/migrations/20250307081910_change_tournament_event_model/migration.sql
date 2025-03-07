/*
  Warnings:

  - You are about to drop the column `championPrize` on the `TournamentEvent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TournamentEvent" DROP COLUMN "championPrize",
ADD COLUMN     "championshipPrize" TEXT[];
