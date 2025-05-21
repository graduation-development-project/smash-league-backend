/*
  Warnings:

  - Added the required column `requirementType` to the `Requirement` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RequirementType" AS ENUM ('Selection', 'FillIn');

-- AlterTable
ALTER TABLE "Requirement" ADD COLUMN     "requirementType" "RequirementType" NOT NULL,
ADD COLUMN     "tournamentEventId" TEXT,
ALTER COLUMN "tournamentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_tournamentEventId_fkey" FOREIGN KEY ("tournamentEventId") REFERENCES "TournamentEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
