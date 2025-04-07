/*
  Warnings:

  - Added the required column `accountNumber` to the `UserBankAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserBankAccount" ADD COLUMN     "accountNumber" TEXT NOT NULL;
