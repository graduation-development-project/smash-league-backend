/*
  Warnings:

  - Added the required column `currentDiscountByPercent` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isRecommended` to the `Package` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Package" ADD COLUMN     "advantages" TEXT[],
ADD COLUMN     "currentDiscountByPercent" INTEGER NOT NULL,
ADD COLUMN     "isRecommended" BOOLEAN NOT NULL;
