/*
  Warnings:

  - Added the required column `contactEmail` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactPhone` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasLiveStream` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isLiveDraw` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPrivate` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isRecruit` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isRegister` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Hands" AS ENUM ('LEFT', 'RIGHT');

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "contactEmail" TEXT NOT NULL,
ADD COLUMN     "contactPhone" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "hasLiveStream" BOOLEAN NOT NULL,
ADD COLUMN     "isLiveDraw" BOOLEAN NOT NULL,
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL,
ADD COLUMN     "isRecruit" BOOLEAN NOT NULL,
ADD COLUMN     "isRegister" BOOLEAN NOT NULL,
ALTER COLUMN "numberOfMerchandise" DROP NOT NULL,
ALTER COLUMN "merchandiseImageContent" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "TournamentRegistration" ALTER COLUMN "registrationDocumentCreator" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "hands" "Hands";
