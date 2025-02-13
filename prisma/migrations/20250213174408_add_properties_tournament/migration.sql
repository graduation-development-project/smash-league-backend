/*
  Warnings:

  - Added the required column `endDate` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortName` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "shortName" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;
