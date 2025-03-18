/*
  Warnings:

  - You are about to drop the column `merchandise` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `merchandiseImageContent` on the `Tournament` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "merchandise",
DROP COLUMN "merchandiseImageContent",
ADD COLUMN     "merchandiseImages" TEXT[] DEFAULT ARRAY[]::TEXT[];
