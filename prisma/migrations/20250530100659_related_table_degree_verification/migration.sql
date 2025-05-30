-- AlterTable
ALTER TABLE "UmpireDegree" ADD COLUMN     "userVerificationId" TEXT;

-- AddForeignKey
ALTER TABLE "UmpireDegree" ADD CONSTRAINT "UmpireDegree_userVerificationId_fkey" FOREIGN KEY ("userVerificationId") REFERENCES "UserVerification"("id") ON DELETE SET NULL ON UPDATE CASCADE;
