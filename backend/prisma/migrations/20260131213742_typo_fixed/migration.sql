/*
  Warnings:

  - You are about to drop the column `collageName` on the `LeaderBoard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LeaderBoard" DROP COLUMN "collageName",
ADD COLUMN     "collegeName" TEXT;
