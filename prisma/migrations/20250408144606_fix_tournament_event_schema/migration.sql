-- CreateEnum
CREATE TYPE "TournamentEventStatus" AS ENUM ('CREATED', 'ON_GOING', 'ENDED');

-- AlterTable
ALTER TABLE "TournamentEvent" ADD COLUMN     "tournamentEventStatus" "TournamentEventStatus" NOT NULL DEFAULT 'CREATED';
