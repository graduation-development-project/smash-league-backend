-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('ON_GOING', 'ENDED');

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "status" "GameStatus" NOT NULL DEFAULT 'ON_GOING';
