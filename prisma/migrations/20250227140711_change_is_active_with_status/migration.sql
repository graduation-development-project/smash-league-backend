/*
  Warnings:

  - You are about to drop the column `isActive` on the `Team` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TeamStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'WAITING_DISBAND');

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "isActive",
ADD COLUMN     "status" "TeamStatus" NOT NULL DEFAULT 'ACTIVE';
