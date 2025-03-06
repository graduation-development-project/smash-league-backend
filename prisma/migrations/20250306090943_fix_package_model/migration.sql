/*
  Warnings:

  - You are about to drop the column `currentDiscountByPercent` on the `Package` table. All the data in the column will be lost.
  - Added the required column `currentDiscountByAmount` to the `Package` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Package" DROP COLUMN "currentDiscountByPercent",
ADD COLUMN     "currentDiscountByAmount" INTEGER NOT NULL;
