import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Cleaning database...");

  // Delete in order to satisfy foreign key constraints
  await prisma.entryLog.deleteMany({});
  await prisma.score.deleteMany({});
  await prisma.member.deleteMany({});
  await prisma.eventInvite.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.registrationRequest.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.college.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.admin.deleteMany({});

  console.log("✨ Seeding Colleges...");

  // 1. Internal College (VGU)
  const vgu = await prisma.college.create({
    data: { name: 'Vivekananda Global University', city: 'Jaipur', isInternal: true }
  });

  // 2. Jaipur External Colleges
  const jaipurColleges = [
    'Malaviya National Institute of Technology (MNIT)',
    'Manipal University Jaipur',
    'Amity University Jaipur',
    'JECRC University',
    'Suresh Gyan Vihar University',
    'SKIT Jaipur',
    'JK Lakshmipat University'
  ];

  for (const name of jaipurColleges) {
    await prisma.college.create({ data: { name, city: 'Jaipur', isInternal: false } });
  }

  console.log("🏢 Seeding VGU Departments...");

  // 3. All VGU Departments with Internal Secret Codes
  const depts = [
    { name: 'Computer Science & Engineering', code: 'VGUCS26' },
    { name: 'Mechanical Engineering', code: 'VGUME26' },
    { name: 'Management (MBA/BBA)', code: 'VGUMGT26' },
    { name: 'Hotel Management', code: 'VGUHM26' },
    { name: 'Design & Arts', code: 'VGUDESIGN26' },
    { name: 'Agriculture', code: 'VGUAGRI26' },
    { name: 'Law', code: 'VGULAW26' },
    { name: 'Physiotherapy', code: 'VGUPHY26' },
    { name: 'Basic & Applied Sciences', code: 'VGUSCI26' }
  ];

  for (const d of depts) {
    await prisma.department.create({
      data: { name: d.name, secretCode: d.code, collegeId: vgu.id }
    });
  }

  console.log("🎟️ Seeding 15+ Events...");

  // 4. Variety of Events (Technical, Cultural, Sports)
  const eventTemplates = [
    { name: 'Panache 2026: Grand Finale', cat: 'PANACHE', price: "499", out: true, min: 3, max: 8 },
    { name: 'Hack-a-Thon 2.0', cat: 'PRAGATI', price: "299", out: true, min: 2, max: 4 },
    { name: 'Street Dance Battle', cat: 'PANACHE', price: "199", out: true, min: 1, max: 6 },
    { name: 'Robo-War', cat: 'PRAGATI', price: "399", out: true, min: 2, max: 5 },
    { name: 'VGU Talent Hunt', cat: 'PRATISHTHA', price: "0", out: false, min: 1, max: 1 },
    { name: 'E-Sports: Valorant', cat: 'PRAGATI', price: "500", out: true, min: 5, max: 5 },
    { name: 'E-Sports: BGMI', cat: 'PRAGATI', price: "400", out: true, min: 4, max: 4 },
    { name: 'Fashion Walk', cat: 'PANACHE', price: "300", out: true, min: 1, max: 12 },
    { name: 'Idea Pitching', cat: 'PRAGATI', price: "150", out: true, min: 1, max: 3 },
    { name: 'Solo Singing', cat: 'PANACHE', price: "100", out: true, min: 1, max: 1 },
    { name: 'Photography Contest', cat: 'PANACHE', price: "50", out: true, min: 1, max: 1 },
    { name: 'Treasure Hunt', cat: 'PRATISHTHA', price: "200", out: true, min: 2, max: 4 },
    { name: 'Standup Comedy', cat: 'PANACHE', price: "150", out: true, min: 1, max: 1 },
    { name: 'Quiz Bowl', cat: 'PRAGATI', price: "100", out: true, min: 2, max: 2 },
    { name: 'Live Painting', cat: 'PANACHE', price: "0", out: true, min: 1, max: 1 },
    { name: 'Mime Act', cat: 'PRATISHTHA', price: "250", out: true, min: 4, max: 10 }
  ];

  const createdEvents = [];
  for (const e of eventTemplates) {
    const ev = await prisma.event.create({
      data: {
        name: e.name,
        description: `Exciting ${e.name} competition at Panache 2026.`,
        category: e.cat,
        eventPrice: e.price,
        allowOutside: e.out,
        minPlayers: e.min,
        maxPlayers: e.max
      }
    });
    createdEvents.push(ev);
  }

  console.log("🔑 Generating 50+ EXT Invite Codes...");

  // 5. Mass Invite Code Generation
  const inviteCodes = [];
  for (let i = 1; i <= 60; i++) {
    // Distribute codes across outside-allowed events
    const targetEvent = createdEvents.filter(e => e.allowOutside)[i % createdEvents.filter(e => e.allowOutside).length];
    
    inviteCodes.push({
      code: `EXT-${targetEvent.name.substring(0, 3).toUpperCase()}-${1000 + i}`,
      eventId: targetEvent.id,
      isUsed: false
    });
  }

  await prisma.eventInvite.createMany({ data: inviteCodes });

  // 6. Admin Account
  await prisma.admin.create({
    data: { name: 'Super Admin', email: 'admin@panache.in', password: 'adminpassword123' }
  });

  console.log(`🏁 Seed Success: ${createdEvents.length} Events, ${jaipurColleges.length + 1} Colleges, 60 EXT Codes.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });