/*
  Warnings:

  - You are about to drop the column `tournamentEventId` on the `UserReport` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserReport" DROP CONSTRAINT "UserReport_tournamentEventId_fkey";

-- AlterTable
ALTER TABLE "UserReport" DROP COLUMN "tournamentEventId";
