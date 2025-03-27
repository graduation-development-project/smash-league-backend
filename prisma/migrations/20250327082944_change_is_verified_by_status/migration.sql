/*
  Warnings:

  - You are about to drop the column `isVerified` on the `UserVerification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserVerification" DROP COLUMN "isVerified",
ADD COLUMN     "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING';
