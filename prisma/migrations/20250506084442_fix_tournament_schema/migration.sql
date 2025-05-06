/*
  Warnings:

  - You are about to drop the column `hasLiveStream` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `isLiveDraw` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `isPrivate` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `isRegister` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfUmpireToRecruit` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `umpirePerMatch` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `jointThirdPlacePrize` on the `TournamentEvent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "hasLiveStream",
DROP COLUMN "isLiveDraw",
DROP COLUMN "isPrivate",
DROP COLUMN "isRegister",
DROP COLUMN "numberOfUmpireToRecruit",
DROP COLUMN "umpirePerMatch",
ADD COLUMN     "numberOfUmpires" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "TournamentEvent" DROP COLUMN "jointThirdPlacePrize";
