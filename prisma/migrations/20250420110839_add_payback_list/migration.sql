-- AlterEnum
ALTER TYPE "TournamentStatus" ADD VALUE 'CANCEL';

-- CreateTable
CREATE TABLE "PaybackFeeList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "tournamentEventId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "PaybackFeeList_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaybackFeeList" ADD CONSTRAINT "PaybackFeeList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaybackFeeList" ADD CONSTRAINT "PaybackFeeList_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaybackFeeList" ADD CONSTRAINT "PaybackFeeList_tournamentEventId_fkey" FOREIGN KEY ("tournamentEventId") REFERENCES "TournamentEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
