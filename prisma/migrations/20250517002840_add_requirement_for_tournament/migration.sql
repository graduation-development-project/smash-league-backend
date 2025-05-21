-- CreateTable
CREATE TABLE "Requirement" (
    "id" TEXT NOT NULL,
    "requirementName" TEXT NOT NULL,
    "requirementDescription" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,

    CONSTRAINT "Requirement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;
