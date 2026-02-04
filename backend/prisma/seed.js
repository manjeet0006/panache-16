import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();


async function main() {
  console.log('🧹 Wiping Database...');

  // await prisma.entryLog.deleteMany({});
  // await prisma.score.deleteMany({});
  await prisma.member.deleteMany({});
  // await prisma.concertTicket.deleteMany({});
  // await prisma.concertTierDetails.deleteMany({});
  // await prisma.eventInvite.deleteMany({});
  await prisma.team.deleteMany({});
  // await prisma.registrationRequest.deleteMany({});
  // await prisma.judgeAssignment.deleteMany({});
  // await prisma.concert.deleteMany({});
  // await prisma.event.deleteMany({});
  // await prisma.department.deleteMany({});
  // await prisma.college.deleteMany({});
  // await prisma.admin.deleteMany({});
  // await prisma.judge.deleteMany({});

  console.log('✨ Database wiped. Starting Seed...');


  console.log('\n✅ Seed complete! Database is hydrated.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });