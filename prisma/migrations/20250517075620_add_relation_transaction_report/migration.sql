-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "reportId" TEXT;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "UserReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
