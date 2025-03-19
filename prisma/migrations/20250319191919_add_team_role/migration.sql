-- CreateEnum
CREATE TYPE "TeamRole" AS ENUM ('LEADER', 'MEMBER');

-- AlterTable
ALTER TABLE "UserTeam" ADD COLUMN     "role" "TeamRole" NOT NULL DEFAULT 'MEMBER';
