/*
  Warnings:

  - Added the required column `isByeMatch` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "isByeMatch" BOOLEAN NOT NULL;
