/*
  Warnings:

  - A unique constraint covering the columns `[accountNumber,bankId,userId]` on the table `UserBankAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserBankAccount_accountNumber_bankId_userId_key" ON "UserBankAccount"("accountNumber", "bankId", "userId");
