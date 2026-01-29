/*
  Warnings:

  - You are about to drop the column `gateCode` on the `ConcertTicket` table. All the data in the column will be lost.
  - You are about to drop the column `concertCode` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `concertId` on the `Team` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ConcertTicket_gateCode_key";

-- DropIndex
DROP INDEX "Team_concertCode_key";

-- AlterTable
ALTER TABLE "ConcertTicket" DROP COLUMN "gateCode",
ADD COLUMN     "isEnterArena" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "concertCode",
DROP COLUMN "concertId";
