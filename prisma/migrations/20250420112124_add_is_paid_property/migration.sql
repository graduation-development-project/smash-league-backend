/*
  Warnings:

  - Added the required column `isPaid` to the `PaybackFeeList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaybackFeeList" ADD COLUMN     "isPaid" BOOLEAN NOT NULL;
