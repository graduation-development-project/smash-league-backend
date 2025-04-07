/*
  Warnings:

  - The primary key for the `Bank` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "UserBankAccount" DROP CONSTRAINT "UserBankAccount_bankId_fkey";

-- AlterTable
ALTER TABLE "Bank" DROP CONSTRAINT "Bank_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Bank_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Bank_id_seq";

-- AlterTable
ALTER TABLE "UserBankAccount" ALTER COLUMN "bankId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "UserBankAccount" ADD CONSTRAINT "UserBankAccount_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
