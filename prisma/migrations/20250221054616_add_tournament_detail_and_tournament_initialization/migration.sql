/*
  Warnings:

  - You are about to drop the column `tournamentRules` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `eventType` on the `TournamentParticipant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tournamentId,userId,tournamentDisciplineId]` on the table `TournamentParticipant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `drawDate` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `protestFeePerTime` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registrationClosingDate` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registrationFeePerPerson` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registrationOpeningDate` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Tournament` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `tournamentDisciplineId` to the `TournamentParticipant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `backgroundImage` to the `TournamentPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdByUserId` to the `TournamentPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedByUserId` to the `TournamentPost` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TournamentStatus" AS ENUM ('OPENING', 'OPENING_FOR_REGISTRATION', 'DRAWING', 'ON_GOING', 'FINISHED');

-- CreateEnum
CREATE TYPE "BadmintonDiscipline" AS ENUM ('MENS_SINGLE', 'WOMEN_SINGLE', 'MENS_DOUBLE', 'WOMENS_DOUBLE', 'MIXED_DOUBLE');

-- DropIndex
DROP INDEX "TournamentParticipant_tournamentId_userId_eventType_key";

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "tournamentRules",
ADD COLUMN     "drawDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "protestFeePerTime" INTEGER NOT NULL,
ADD COLUMN     "registrationClosingDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "registrationFeePerPair" INTEGER,
ADD COLUMN     "registrationFeePerPerson" INTEGER NOT NULL,
ADD COLUMN     "registrationOpeningDate" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "TournamentStatus" NOT NULL;

-- AlterTable
ALTER TABLE "TournamentParticipant" DROP COLUMN "eventType",
ADD COLUMN     "fromTeamId" TEXT,
ADD COLUMN     "tournamentDisciplineId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TournamentPost" ADD COLUMN     "backgroundImage" TEXT NOT NULL,
ADD COLUMN     "createdByUserId" TEXT NOT NULL,
ADD COLUMN     "updatedByUserId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TournamentDiscipline" (
    "id" TEXT NOT NULL,
    "tournamentDiscipline" "BadmintonDiscipline" NOT NULL,
    "fromAge" INTEGER NOT NULL DEFAULT 6,
    "toAge" INTEGER NOT NULL DEFAULT 90,
    "winningPoint" INTEGER NOT NULL DEFAULT 21,
    "lastPoint" INTEGER NOT NULL DEFAULT 31,
    "numberOfSets" INTEGER NOT NULL DEFAULT 3,
    "tournamentId" TEXT NOT NULL,

    CONSTRAINT "TournamentDiscipline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TournamentParticipant_tournamentId_userId_tournamentDiscipl_key" ON "TournamentParticipant"("tournamentId", "userId", "tournamentDisciplineId");

-- AddForeignKey
ALTER TABLE "TournamentDiscipline" ADD CONSTRAINT "TournamentDiscipline_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentParticipant" ADD CONSTRAINT "TournamentParticipant_tournamentDisciplineId_fkey" FOREIGN KEY ("tournamentDisciplineId") REFERENCES "TournamentDiscipline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentParticipant" ADD CONSTRAINT "TournamentParticipant_fromTeamId_fkey" FOREIGN KEY ("fromTeamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
