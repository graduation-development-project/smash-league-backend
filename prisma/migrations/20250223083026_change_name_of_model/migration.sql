/*
  Warnings:

  - You are about to drop the column `tournamentDisciplineId` on the `TournamentRegistration` table. All the data in the column will be lost.
  - You are about to drop the `TournamentDiscipline` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tournamentId,userId,tournamentEventId]` on the table `TournamentRegistration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tournamentSerieId` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tournamentEventId` to the `TournamentRegistration` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TypeOfFormat" AS ENUM ('SINGLE_ELIMINATION', 'ROUND_ROBIN');

-- CreateEnum
CREATE TYPE "BadmintonParticipantType" AS ENUM ('MENS_SINGLE', 'WOMEN_SINGLE', 'MENS_DOUBLE', 'WOMENS_DOUBLE', 'MIXED_DOUBLE');

-- DropForeignKey
ALTER TABLE "TournamentDiscipline" DROP CONSTRAINT "TournamentDiscipline_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "TournamentRegistration" DROP CONSTRAINT "TournamentRegistration_tournamentDisciplineId_fkey";

-- DropIndex
DROP INDEX "TournamentRegistration_tournamentId_userId_tournamentDiscip_key";

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "tournamentSerieId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TournamentRegistration" DROP COLUMN "tournamentDisciplineId",
ADD COLUMN     "tournamentEventId" TEXT NOT NULL;

-- DropTable
DROP TABLE "TournamentDiscipline";

-- DropEnum
DROP TYPE "BadmintonDiscipline";

-- CreateTable
CREATE TABLE "TournamentSerie" (
    "id" TEXT NOT NULL,
    "tournamentSerie" TEXT NOT NULL,
    "serieBackgroundImageURL" TEXT NOT NULL,

    CONSTRAINT "TournamentSerie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentEvent" (
    "id" TEXT NOT NULL,
    "tournamentEvent" "BadmintonParticipantType" NOT NULL,
    "fromAge" INTEGER DEFAULT 6,
    "toAge" INTEGER DEFAULT 90,
    "winningPoint" INTEGER DEFAULT 21,
    "lastPoint" INTEGER NOT NULL DEFAULT 31,
    "numberOfSets" INTEGER NOT NULL DEFAULT 3,
    "typeOfFormat" "TypeOfFormat" NOT NULL,
    "tournamentId" TEXT NOT NULL,

    CONSTRAINT "TournamentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TournamentRegistration_tournamentId_userId_tournamentEventI_key" ON "TournamentRegistration"("tournamentId", "userId", "tournamentEventId");

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_tournamentSerieId_fkey" FOREIGN KEY ("tournamentSerieId") REFERENCES "TournamentSerie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentEvent" ADD CONSTRAINT "TournamentEvent_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentRegistration" ADD CONSTRAINT "TournamentRegistration_tournamentEventId_fkey" FOREIGN KEY ("tournamentEventId") REFERENCES "TournamentEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
