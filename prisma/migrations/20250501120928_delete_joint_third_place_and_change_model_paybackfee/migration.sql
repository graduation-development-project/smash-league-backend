/*
  Warnings:

  - You are about to drop the column `jointThirdPlaceId` on the `TournamentEvent` table. All the data in the column will be lost.
  - You are about to drop the `PaybackFeeList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PaybackFeeList" DROP CONSTRAINT "PaybackFeeList_tournamentEventId_fkey";

-- DropForeignKey
ALTER TABLE "PaybackFeeList" DROP CONSTRAINT "PaybackFeeList_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "PaybackFeeList" DROP CONSTRAINT "PaybackFeeList_userId_fkey";

-- DropForeignKey
ALTER TABLE "TournamentEvent" DROP CONSTRAINT "TournamentEvent_jointThirdPlaceId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_paybackFeeId_fkey";

-- AlterTable
ALTER TABLE "TournamentEvent" DROP COLUMN "jointThirdPlaceId";

-- DropTable
DROP TABLE "PaybackFeeList";

-- CreateTable
CREATE TABLE "PaybackFee" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "tournamentEventId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PaybackFee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaybackFee" ADD CONSTRAINT "PaybackFee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaybackFee" ADD CONSTRAINT "PaybackFee_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaybackFee" ADD CONSTRAINT "PaybackFee_tournamentEventId_fkey" FOREIGN KEY ("tournamentEventId") REFERENCES "TournamentEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_paybackFeeId_fkey" FOREIGN KEY ("paybackFeeId") REFERENCES "PaybackFee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
