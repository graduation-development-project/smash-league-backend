/*
  Warnings:

  - Added the required column `degreeTitle` to the `UmpireDegree` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UmpireDegree" ADD COLUMN     "degreeTitle" TEXT NOT NULL;
