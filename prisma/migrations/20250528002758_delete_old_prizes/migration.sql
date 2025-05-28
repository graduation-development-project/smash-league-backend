/*
  Warnings:

  - You are about to drop the column `championshipId` on the `TournamentEvent` table. All the data in the column will be lost.
  - You are about to drop the column `championshipPrize` on the `TournamentEvent` table. All the data in the column will be lost.
  - You are about to drop the column `runnerUpId` on the `TournamentEvent` table. All the data in the column will be lost.
  - You are about to drop the column `runnerUpPrize` on the `TournamentEvent` table. All the data in the column will be lost.
  - You are about to drop the column `thirdPlaceId` on the `TournamentEvent` table. All the data in the column will be lost.
  - You are about to drop the column `thirdPlacePrize` on the `TournamentEvent` table. All the data in the column will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RolePermission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_roleId_fkey";

-- DropForeignKey
ALTER TABLE "TournamentEvent" DROP CONSTRAINT "TournamentEvent_championshipId_fkey";

-- DropForeignKey
ALTER TABLE "TournamentEvent" DROP CONSTRAINT "TournamentEvent_runnerUpId_fkey";

-- DropForeignKey
ALTER TABLE "TournamentEvent" DROP CONSTRAINT "TournamentEvent_thirdPlaceId_fkey";

-- AlterTable
ALTER TABLE "TournamentEvent" DROP COLUMN "championshipId",
DROP COLUMN "championshipPrize",
DROP COLUMN "runnerUpId",
DROP COLUMN "runnerUpPrize",
DROP COLUMN "thirdPlaceId",
DROP COLUMN "thirdPlacePrize";

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "RolePermission";
