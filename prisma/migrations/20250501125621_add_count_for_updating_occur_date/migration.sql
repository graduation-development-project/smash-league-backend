/*
  Warnings:

  - Added the required column `endDateFirstTime` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDateFirstTime` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "countUpdateOccurTime" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "endDateFirstTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDateFirstTime" TIMESTAMP(3) NOT NULL;
