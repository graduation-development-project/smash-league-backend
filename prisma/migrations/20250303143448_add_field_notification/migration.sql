/*
  Warnings:

  - A unique constraint covering the columns `[teamRequestId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "teamRequestId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Notification_teamRequestId_key" ON "Notification"("teamRequestId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_teamRequestId_fkey" FOREIGN KEY ("teamRequestId") REFERENCES "TeamRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
