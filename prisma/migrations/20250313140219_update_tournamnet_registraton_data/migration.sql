/*
  Warnings:

  - You are about to drop the column `IsPayForTheRegistrationFee` on the `TournamentRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `RegistrationDocumentCreator` on the `TournamentRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `RegistrationDocumentPartner` on the `TournamentRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `RegistrationRole` on the `TournamentRegistration` table. All the data in the column will be lost.
  - Added the required column `registrationRole` to the `TournamentRegistration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TournamentRegistration" DROP COLUMN "IsPayForTheRegistrationFee",
DROP COLUMN "RegistrationDocumentCreator",
DROP COLUMN "RegistrationDocumentPartner",
DROP COLUMN "RegistrationRole",
ADD COLUMN     "isPayForTheRegistrationFee" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "registrationDocumentCreator" TEXT[],
ADD COLUMN     "registrationDocumentPartner" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "registrationRole" "TournamentRegistrationRole" NOT NULL;
