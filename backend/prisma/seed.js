import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Configuration Data
const VGU_DEPARTMENTS = [
  { name: 'Computer Science (CSE)', code: 'CSE' },
  { name: 'Information Technology (IT)', code: 'IT' },
  { name: 'Mechanical Engineering (ME)', code: 'ME' },
  { name: 'Civil Engineering (CE)', code: 'CE' },
  { name: 'Electrical Engineering (EE)', code: 'EE' },
  { name: 'Electronics & Comm (ECE)', code: 'ECE' },
  { name: 'Robotics & Automation', code: 'ROBO' },
  { name: 'Artificial Intelligence', code: 'AI' },
  { name: 'Architecture', code: 'ARCH' },
  { name: 'Design & Arts', code: 'DES' },
  { name: 'Management (BBA/MBA)', code: 'MGMT' },
  { name: 'Law', code: 'LAW' },
  { name: 'Hotel Management', code: 'HM' },
  { name: 'Agriculture', code: 'AGRI' },
  { name: 'Forensic Science', code: 'FOR' },
];

const JAIPUR_COLLEGES = [
  'Malaviya National Institute of Technology (MNIT)',
  'Manipal University Jaipur',
  'JECRC University',
  'Amity University Jaipur',
  'Poornima University',
  'Swami Keshvanand Institute of Technology (SKIT)',
  'IIS University',
  'JK Lakshmipat University',
  'NIMS University',
  'Suresh Gyan Vihar University',
];

const EVENT_CATEGORIES = ['PANACHE', 'PRAGATI', 'PRATISHTHA'];
const TICKET_TIERS = { SILVER: 'SILVER', GOLD: 'GOLD', PLATINUM: 'PLATINUM' };
const PAYMENT_STATUS = { PENDING: 'PENDING', APPROVED: 'APPROVED', REJECTED: 'REJECTED' };

async function main() {
  console.log('🧹 Wiping Database...');

  // 1. CLEANUP
  await prisma.entryLog.deleteMany({});
  await prisma.score.deleteMany({});
  await prisma.member.deleteMany({});
  await prisma.concertTicket.deleteMany({});
  await prisma.concertTierDetails.deleteMany({});
  await prisma.eventInvite.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.registrationRequest.deleteMany({});
  await prisma.judgeAssignment.deleteMany({});
  await prisma.concert.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.college.deleteMany({});
  await prisma.admin.deleteMany({});
  await prisma.judge.deleteMany({});

  console.log('✨ Database wiped. Starting Seed...');

  // ==========================================
  // 1. SEED COLLEGES (1 VGU + 10 Jaipur)
  // ==========================================
  console.log('🏫 Seeding Colleges...');

  const vgu = await prisma.college.create({
    data: {
      name: 'Vivekananda Global University',
      city: 'Jaipur',
      isInternal: true,
    },
  });

  const externalColleges = [];
  for (const collegeName of JAIPUR_COLLEGES) {
    const col = await prisma.college.create({
      data: {
        name: collegeName,
        city: 'Jaipur',
        isInternal: false,
      },
    });
    externalColleges.push(col);
  }

  // ==========================================
  // 2. SEED DEPARTMENTS (15 for VGU)
  // ==========================================
  console.log('🏢 Seeding 15 VGU Departments...');
  
  const vguDepartments = [];
  for (const dept of VGU_DEPARTMENTS) {
    const d = await prisma.department.create({
      data: {
        name: dept.name,
        secretCode: `VGU-${dept.code}-2026`,
        collegeId: vgu.id,
      },
    });
    vguDepartments.push(d);
  }

  // ==========================================
  // 3. SEED EVENTS (20 Events)
  // ==========================================
  console.log('🎟️ Seeding 20 Events...');

  const events = [];
  
  // Possible dates: Feb 3 or Feb 4 at 00:30:00
  const possibleDates = [
    new Date('2026-02-03T00:30:00.000Z'),
    new Date('2026-02-04T00:30:00.000Z')
  ];

  for (let i = 0; i < 20; i++) {
    const category = faker.helpers.arrayElement(EVENT_CATEGORIES);
    const selectedDate = faker.helpers.arrayElement(possibleDates);

    const event = await prisma.event.create({
      data: {
        name: `${faker.word.adjective()} ${faker.word.noun()}`.toUpperCase(), 
        description: faker.lorem.sentence(),
        category: category,
        // ✅ UPDATED: Small team sizes
        minPlayers: 2,
        maxPlayers: 3,
        allowOutside: true,
        eventPrice: faker.commerce.price({ min: 100, max: 1000 }),
        dateLabel: selectedDate.getDate() === 3 ? "Feb 3, 12:30 AM" : "Feb 4, 12:30 AM",
        // ✅ UPDATED: Specific Date & Time
        eventDate: selectedDate,
        guidelines: [faker.lorem.sentence(), faker.lorem.sentence()],
      },
    });
    events.push(event);
  }

  // ==========================================
  // 4. SEED EVENT INVITES
  // ==========================================
  console.log('📩 Seeding Invites...');

  for (const event of events) {
    const prefix = event.name.substring(0, 2).toUpperCase().replace(/[^A-Z]/g, 'X');
    for (let i = 1; i <= 10; i++) {
      const randomSuffix = faker.string.alphanumeric(6).toUpperCase();
      const code = `EXT-${prefix}${randomSuffix}`;

      await prisma.eventInvite.create({
        data: {
          code: code,
          eventId: event.id,
        },
      });
    }
  }

  // ==========================================
  // 5. SEED CONCERTS
  // ==========================================
  console.log('🎸 Seeding 5 Concerts...');

  const concertArtists = ['Divine', 'Arijit Singh', 'King', 'Darshan Raval', 'Nucleya'];
  
  for (let i = 0; i < 5; i++) {
    await prisma.concert.create({
      data: {
        artistName: concertArtists[i],
        dayLabel: `Day ${i + 1} - Live`,
        date: new Date(`2026-02-${12 + i}T19:00:00Z`),
        imageUrl: faker.image.urlLoremFlickr({ category: 'music' }),
        tierDetails: {
          create: [
            { tier: TICKET_TIERS.SILVER, price: "499", ticketLimit: 500 },
            { tier: TICKET_TIERS.GOLD, price: "999", ticketLimit: 200 },
            { tier: TICKET_TIERS.PLATINUM, price: "1999", ticketLimit: 50 },
          ],
        },
      },
    });
  }

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