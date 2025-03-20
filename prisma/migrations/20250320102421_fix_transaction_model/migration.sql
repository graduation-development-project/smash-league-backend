/*
  Warnings:

  - Added the required column `transactionImage` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionPaymentLink` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "transactionImage" TEXT NOT NULL,
ADD COLUMN     "transactionPaymentLink" TEXT NOT NULL;
