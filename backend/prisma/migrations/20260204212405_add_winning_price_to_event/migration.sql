-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "outsiderPrice" TEXT NOT NULL DEFAULT '0',
ADD COLUMN     "vguPrice" TEXT NOT NULL DEFAULT '0';
