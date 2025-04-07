-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "paybackImage" TEXT,
ADD COLUMN     "paybackToUserId" TEXT;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_paybackToUserId_fkey" FOREIGN KEY ("paybackToUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
