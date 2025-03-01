/*
  Warnings:

  - You are about to drop the column `CreditsRemain` on the `User` table. All the data in the column will be lost.
  - Added the required column `checkInBeforeStart` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasMerchandise` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `linemanPerMatch` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `merchandise` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfMerchandise` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `umpirePerMatch` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creditsRemain` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "checkInBeforeStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "hasMerchandise" BOOLEAN NOT NULL,
ADD COLUMN     "linemanPerMatch" INTEGER NOT NULL,
ADD COLUMN     "merchandise" TEXT NOT NULL,
ADD COLUMN     "merchandiseImageContent" TEXT[],
ADD COLUMN     "numberOfMerchandise" INTEGER NOT NULL,
ADD COLUMN     "prizePool" TEXT[],
ADD COLUMN     "umpirePerMatch" INTEGER NOT NULL,
ALTER COLUMN "shortName" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TournamentEvent" ADD COLUMN     "championPrize" TEXT[],
ADD COLUMN     "jointThirdPlacePrize" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "runnerUpPrize" TEXT[],
ADD COLUMN     "thirdPlacePrize" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "CreditsRemain",
ADD COLUMN     "creditsRemain" INTEGER NOT NULL;
