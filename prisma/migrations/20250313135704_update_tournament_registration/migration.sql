/*
  Warnings:

  - Added the required column `RegistrationRole` to the `TournamentRegistration` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TournamentRegistrationRole" AS ENUM ('ATHLETE', 'UMPIRE');

-- AlterTable
ALTER TABLE "TournamentRegistration" ADD COLUMN     "IsPayForTheRegistrationFee" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "RegistrationDocumentCreator" TEXT[],
ADD COLUMN     "RegistrationDocumentPartner" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "RegistrationRole" "TournamentRegistrationRole" NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
