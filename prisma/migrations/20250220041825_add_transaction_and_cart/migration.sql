/*
  Warnings:

  - You are about to drop the column `currencyId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `isCancelled` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `Currency` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cartId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'SUCCESSFUL', 'FAILED');

-- CreateEnum
CREATE TYPE "CartStatus" AS ENUM ('PAID', 'PENDING', 'FAILED');

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_currencyId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "currencyId",
DROP COLUMN "isCancelled",
ADD COLUMN     "cartId" TEXT NOT NULL,
ADD COLUMN     "status" "TransactionStatus" NOT NULL;

-- DropTable
DROP TABLE "Currency";

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "cartId" TEXT NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "cartStatus" "CartStatus" NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
