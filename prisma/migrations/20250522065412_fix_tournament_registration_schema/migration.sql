/*
  Warnings:

  - You are about to drop the column `submittedAnswers` on the `TournamentRegistration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TournamentRegistration" DROP COLUMN "submittedAnswers",
ADD COLUMN     "submittedAnswersForEvent" JSONB,
ADD COLUMN     "submittedAnswersForTournament" JSONB;
