/*
  Warnings:

  - You are about to drop the column `linemanPerMatch` on the `Tournament` table. All the data in the column will be lost.
  - Added the required column `backgroundTournament` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `prizePool` on the `Tournament` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "linemanPerMatch",
ADD COLUMN     "backgroundTournament" TEXT NOT NULL,
DROP COLUMN "prizePool",
ADD COLUMN     "prizePool" INTEGER NOT NULL;
