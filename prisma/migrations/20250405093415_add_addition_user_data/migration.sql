-- AlterTable
ALTER TABLE "User" ADD COLUMN     "location" TEXT,
ADD COLUMN     "placeOfBirth" TEXT,
ADD COLUMN     "sportAmbitions" TEXT,
ADD COLUMN     "startPlayingCompetitively" TIMESTAMP(3),
ADD COLUMN     "startPlayingSport" TIMESTAMP(3);
