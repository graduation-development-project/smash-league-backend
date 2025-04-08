/*
  Warnings:

  - You are about to drop the column `tournamentEventStatus` on the `TournamentEvent` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TournamentEvent" DROP COLUMN "tournamentEventStatus";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "userId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "TournamentEventStatus";

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
