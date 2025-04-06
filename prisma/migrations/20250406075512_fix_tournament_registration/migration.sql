/*
  Warnings:

  - You are about to drop the column `isPayForTheRegistrationFee` on the `TournamentRegistration` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "TournamentRegistrationStatus" ADD VALUE 'ON_WAITING_REGISTRATION_FEE';

-- AlterTable
ALTER TABLE "TournamentRegistration" DROP COLUMN "isPayForTheRegistrationFee";
