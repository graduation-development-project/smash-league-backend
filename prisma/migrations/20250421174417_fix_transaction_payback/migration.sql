/*
  Warnings:

  - You are about to drop the column `tournamentRegistrationId` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_tournamentRegistrationId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "tournamentRegistrationId",
ADD COLUMN     "paybackFeeId" TEXT;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_paybackFeeId_fkey" FOREIGN KEY ("paybackFeeId") REFERENCES "PaybackFeeList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
