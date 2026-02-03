-- AlterTable
ALTER TABLE "EntryLog" ADD COLUMN     "memberId" TEXT;

-- CreateIndex
CREATE INDEX "EntryLog_memberId_scannedAt_idx" ON "EntryLog"("memberId", "scannedAt");

-- AddForeignKey
ALTER TABLE "EntryLog" ADD CONSTRAINT "EntryLog_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
