/*
  Warnings:

  - You are about to drop the `Rejection` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ReasonStatus" AS ENUM ('APPROVE', 'REJECT');

-- CreateEnum
CREATE TYPE "ReasonType" AS ENUM ('TOURNAMENT_REGISTRATION', 'USER_VERIFICATION', 'REMOVE_TEAM_MEMBER', 'OUT_TEAM');

-- DropForeignKey
ALTER TABLE "Rejection" DROP CONSTRAINT "Rejection_tournamentRegistrationId_fkey";

-- DropForeignKey
ALTER TABLE "Rejection" DROP CONSTRAINT "Rejection_userVerificationId_fkey";

-- AlterTable
ALTER TABLE "TournamentRegistration" ADD COLUMN     "reasonId" TEXT;

-- AlterTable
ALTER TABLE "UserVerification" ADD COLUMN     "reasonId" TEXT;

-- DropTable
DROP TABLE "Rejection";

-- CreateTable
CREATE TABLE "Reason" (
    "id" TEXT NOT NULL,
    "userVerificationId" TEXT,
    "tournamentRegistrationId" TEXT,
    "reason" TEXT NOT NULL,
    "status" "ReasonStatus",
    "type" "ReasonType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reason_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reason_userVerificationId_key" ON "Reason"("userVerificationId");

-- CreateIndex
CREATE UNIQUE INDEX "Reason_tournamentRegistrationId_key" ON "Reason"("tournamentRegistrationId");

-- AddForeignKey
ALTER TABLE "Reason" ADD CONSTRAINT "Reason_userVerificationId_fkey" FOREIGN KEY ("userVerificationId") REFERENCES "UserVerification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reason" ADD CONSTRAINT "Reason_tournamentRegistrationId_fkey" FOREIGN KEY ("tournamentRegistrationId") REFERENCES "TournamentRegistration"("id") ON DELETE SET NULL ON UPDATE CASCADE;
