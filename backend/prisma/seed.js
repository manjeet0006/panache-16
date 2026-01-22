import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Cleaning database...");

  try {
    // 1. DELETE DATA IN REVERSE ORDER OF RELATIONS
    await prisma.entryLog.deleteMany({});
    await prisma.score.deleteMany({});
    await prisma.member.deleteMany({});
    await prisma.eventInvite.deleteMany({});
    await prisma.team.deleteMany({});
    await prisma.judgeAssignment.deleteMany({});
    await prisma.judge.deleteMany({});
    await prisma.registrationRequest.deleteMany({});
    await prisma.department.deleteMany({});
    await prisma.college.deleteMany({});
    await prisma.event.deleteMany({});
    await prisma.admin.deleteMany({});

    console.log("✨ Database cleaned. Creating Colleges & Departments...");

    // 2. CREATE INTERNAL COLLEGE
    const vgu = await prisma.college.create({
      data: {
        name: 'Vivekananda Global University',
        city: 'Jaipur',
        isInternal: true,
      },
    });

    const vguDepts = [
      { name: 'Computer Science & Engineering', code: 'VGUCS26' },
      { name: 'Management', code: 'VGUMGT26' },
      { name: 'Hotel Management', code: 'VGUHM26' },
    ];

    for (const d of vguDepts) {
      await prisma.department.create({
        data: { name: d.name, secretCode: d.code, collegeId: vgu.id },
      });
    }

    console.log("🎟️ Creating Multiple Events...");

    // 3. DEFINE EVENTS
    const eventsToSeed = [
      {
        id: 'panache-main-2026',
        name: 'Panache 2026: Grand Finale',
        description: 'The flagship cultural show.',
        category: 'PANACHE',
        allowOutside: true, // Requires Razorpay for outsiders
        eventPrice: "499",
        minPlayers: 3,
        maxPlayers: 8,
      },
      {
        id: 'coding-warriors-2026',
        name: 'Hack-a-Thon 2.0',
        description: '24-hour coding challenge.',
        category: 'PRAGATI',
        allowOutside: true,
        eventPrice: "299",
        minPlayers: 1,
        maxPlayers: 4,
      },
      {
        id: 'vgu-internal-talent',
        name: 'VGU Talent Hunt (Internal)',
        description: 'Exclusively for VGU students.',
        category: 'PRATISHTHA',
        allowOutside: false, // Only VGU Dept Codes allowed
        eventPrice: "0",
        minPlayers: 1,
        maxPlayers: 1,
      },
    ];

    for (const eventData of eventsToSeed) {
      const createdEvent = await prisma.event.create({ data: eventData });

      // 4. CREATE INVITE CODES FOR OUTSIDE EVENTS
      if (eventData.allowOutside) {
        const codes = [`EXT-${eventData.id.slice(0, 3).toUpperCase()}-1`, `EXT-${eventData.id.slice(0, 3).toUpperCase()}-2` ];
        for (const code of codes) {
          await prisma.eventInvite.create({
            data: { code, eventId: createdEvent.id, isUsed: false },
          });
        }
      }
    }

    // 5. CREATE ADMIN
    await prisma.admin.create({
      data: {
        name: 'Super Admin',
        email: 'admin@panache.in',
        password: 'adminpassword123',
      },
    });

    console.log("🏁 Seeding complete! Database is fresh with multiple events.");
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });