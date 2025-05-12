-- CreateEnum
CREATE TYPE "TypeOfUmpireDegree" AS ENUM ('UmpireDegree');

-- CreateTable
CREATE TABLE "UmpireDegree" (
    "id" TEXT NOT NULL,
    "typeOfDegree" "TypeOfUmpireDegree" NOT NULL,
    "degree" TEXT[],
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UmpireDegree_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UmpireDegree" ADD CONSTRAINT "UmpireDegree_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
