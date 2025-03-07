/*
  Warnings:

  - You are about to drop the column `tournamentSerie` on the `TournamentSerie` table. All the data in the column will be lost.
  - Added the required column `tournamentSerieName` to the `TournamentSerie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TournamentSerie" DROP COLUMN "tournamentSerie",
ADD COLUMN     "tournamentSerieName" TEXT NOT NULL;
