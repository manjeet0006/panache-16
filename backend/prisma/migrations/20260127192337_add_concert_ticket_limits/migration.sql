-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('ENTRY', 'EXIT');

-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('PANACHE', 'PRATISTHA', 'PRAGATI');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('PENDING', 'CALLED', 'CODE_SENT', 'REGISTERED', 'REJECTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "TicketTier" AS ENUM ('SILVER', 'GOLD', 'PLATINUM');

-- CreateTable
CREATE TABLE "College" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "secretCode" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "EventCategory" NOT NULL,
    "minPlayers" INTEGER NOT NULL DEFAULT 1,
    "maxPlayers" INTEGER NOT NULL DEFAULT 1,
    "allowOutside" BOOLEAN NOT NULL DEFAULT false,
    "eventPrice" TEXT NOT NULL DEFAULT '0',
    "criteria" TEXT[] DEFAULT ARRAY['General']::TEXT[],
    "eventDate" TIMESTAMP(3),
    "dateLabel" TEXT,
    "guidelines" TEXT[],
    "registrationOpen" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventInvite" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "usedByTeamId" TEXT,

    CONSTRAINT "EventInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "departmentId" TEXT,
    "inviteId" TEXT,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentImage" TEXT,
    "transactionId" TEXT,
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "ticketCode" TEXT,
    "concertCode" TEXT,
    "concertId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enrollment" TEXT,
    "phone" TEXT NOT NULL,
    "isLeader" BOOLEAN NOT NULL DEFAULT false,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Judge" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Judge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JudgeAssignment" (
    "id" TEXT NOT NULL,
    "judgeId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "JudgeAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "judgeId" TEXT NOT NULL,
    "criteriaScores" JSONB NOT NULL,
    "totalPoints" DOUBLE PRECISION NOT NULL,
    "comments" TEXT,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntryLog" (
    "id" TEXT NOT NULL,
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scannerId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "type" "LogType" NOT NULL,
    "teamId" TEXT,
    "concertTicketId" TEXT,

    CONSTRAINT "EntryLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistrationRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "collegeName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegistrationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Concert" (
    "id" TEXT NOT NULL,
    "artistName" TEXT NOT NULL,
    "dayLabel" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "soldOut" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Concert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConcertTierDetails" (
    "id" TEXT NOT NULL,
    "concertId" TEXT NOT NULL,
    "tier" "TicketTier" NOT NULL,
    "price" TEXT NOT NULL,
    "ticketLimit" INTEGER NOT NULL,
    "ticketsSold" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ConcertTierDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConcertTicket" (
    "id" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "guestEmail" TEXT NOT NULL,
    "guestPhone" TEXT NOT NULL,
    "concertId" TEXT NOT NULL,
    "tier" "TicketTier" NOT NULL,
    "pricePaid" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "signature" TEXT,
    "gateCode" TEXT NOT NULL,
    "arenaCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConcertTicket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_collegeId_key" ON "Department"("name", "collegeId");

-- CreateIndex
CREATE UNIQUE INDEX "EventInvite_code_key" ON "EventInvite"("code");

-- CreateIndex
CREATE UNIQUE INDEX "EventInvite_usedByTeamId_key" ON "EventInvite"("usedByTeamId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_inviteId_key" ON "Team"("inviteId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_razorpayOrderId_key" ON "Team"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_razorpayPaymentId_key" ON "Team"("razorpayPaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_ticketCode_key" ON "Team"("ticketCode");

-- CreateIndex
CREATE UNIQUE INDEX "Team_concertCode_key" ON "Team"("concertCode");

-- CreateIndex
CREATE UNIQUE INDEX "Team_eventId_departmentId_key" ON "Team"("eventId", "departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Judge_email_key" ON "Judge"("email");

-- CreateIndex
CREATE UNIQUE INDEX "JudgeAssignment_judgeId_eventId_key" ON "JudgeAssignment"("judgeId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Score_teamId_judgeId_key" ON "Score"("teamId", "judgeId");

-- CreateIndex
CREATE INDEX "EntryLog_teamId_scannedAt_idx" ON "EntryLog"("teamId", "scannedAt");

-- CreateIndex
CREATE INDEX "EntryLog_concertTicketId_scannedAt_idx" ON "EntryLog"("concertTicketId", "scannedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ConcertTierDetails_concertId_tier_key" ON "ConcertTierDetails"("concertId", "tier");

-- CreateIndex
CREATE UNIQUE INDEX "ConcertTicket_paymentId_key" ON "ConcertTicket"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "ConcertTicket_orderId_key" ON "ConcertTicket"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "ConcertTicket_gateCode_key" ON "ConcertTicket"("gateCode");

-- CreateIndex
CREATE UNIQUE INDEX "ConcertTicket_arenaCode_key" ON "ConcertTicket"("arenaCode");

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventInvite" ADD CONSTRAINT "EventInvite_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventInvite" ADD CONSTRAINT "EventInvite_usedByTeamId_fkey" FOREIGN KEY ("usedByTeamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JudgeAssignment" ADD CONSTRAINT "JudgeAssignment_judgeId_fkey" FOREIGN KEY ("judgeId") REFERENCES "Judge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JudgeAssignment" ADD CONSTRAINT "JudgeAssignment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_judgeId_fkey" FOREIGN KEY ("judgeId") REFERENCES "Judge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryLog" ADD CONSTRAINT "EntryLog_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryLog" ADD CONSTRAINT "EntryLog_concertTicketId_fkey" FOREIGN KEY ("concertTicketId") REFERENCES "ConcertTicket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistrationRequest" ADD CONSTRAINT "RegistrationRequest_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConcertTierDetails" ADD CONSTRAINT "ConcertTierDetails_concertId_fkey" FOREIGN KEY ("concertId") REFERENCES "Concert"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConcertTicket" ADD CONSTRAINT "ConcertTicket_concertId_fkey" FOREIGN KEY ("concertId") REFERENCES "Concert"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
