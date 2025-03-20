/*
  Warnings:

  - You are about to drop the column `transactionName` on the `TransactionType` table. All the data in the column will be lost.
  - Added the required column `transactionTypeName` to the `TransactionType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TransactionType" DROP COLUMN "transactionName",
ADD COLUMN     "transactionTypeName" TEXT NOT NULL;
