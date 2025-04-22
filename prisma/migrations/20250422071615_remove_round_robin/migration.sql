/*
  Warnings:

  - The values [ROUND_ROBIN] on the enum `TypeOfFormat` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TypeOfFormat_new" AS ENUM ('SINGLE_ELIMINATION');
ALTER TABLE "TournamentEvent" ALTER COLUMN "typeOfFormat" TYPE "TypeOfFormat_new" USING ("typeOfFormat"::text::"TypeOfFormat_new");
ALTER TYPE "TypeOfFormat" RENAME TO "TypeOfFormat_old";
ALTER TYPE "TypeOfFormat_new" RENAME TO "TypeOfFormat";
DROP TYPE "TypeOfFormat_old";
COMMIT;
