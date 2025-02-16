/*
  Warnings:

  - You are about to drop the column `otpExpriresAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "otpExpriresAt",
ADD COLUMN     "otpExpiresTime" TIMESTAMP(3);
