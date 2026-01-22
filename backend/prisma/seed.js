import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- 🧹 1. Cleaning Database ---');
  // Order is critical to avoid Foreign Key constraint errors
  const tablenames = [
    'Score', 'JudgeAssignment', 'Member', 'EntryLog', 'EventInvite', 
    'Team', 'RegistrationRequest', 'Department', 'Event', 'Judge', 
    'Admin', 'College'
  ];

  for (const table of tablenames) {
    await prisma[table].deleteMany();
  }

  console.log('--- 🏛️ 2. Seeding Colleges ---');
  const vgu = await prisma.college.create({
    data: { name: 'Vivekananda Global University', city: 'Jaipur', isInternal: true },
  });

  const mnit = await prisma.college.create({
    data: { name: 'MNIT Jaipur', city: 'Jaipur', isInternal: false },
  });

  const jecrc = await prisma.college.create({
    data: { name: 'JECRC University', city: 'Jaipur', isInternal: false },
  });

  console.log('--- 🏢 3. Seeding Departments (Internal VGU) ---');
  // These codes only work for events where allowOutside = false
  const cse = await prisma.department.create({
    data: { name: 'Computer Science', secretCode: 'VGU-CSE-2026', collegeId: vgu.id },
  });
  const me = await prisma.department.create({
    data: { name: 'Mechanical Engineering', secretCode: 'VGU-ME-2026', collegeId: vgu.id },
  });
  const hm = await prisma.department.create({
    data: { name: 'Hotel Management', secretCode: 'VGU-HM-2026', collegeId: vgu.id },
  });

  console.log('--- 🏆 4. Seeding Events ---');

  // TYPE A: INTERNAL ONLY (Panache Category)
  const fashionShow = await prisma.event.create({
    data: {
      name: 'Panache Fashion Show',
      description: 'The signature ramp walk competition for VGU students.',
      category: 'PANACHE',
      minPlayers: 8,
      maxPlayers: 15,
      allowOutside: false, // Path: Dept Secret Code
      criteria: ['Walk', 'Costume', 'Confidence'],
    },
  });

  // TYPE B: OPEN EVENTS (Pragati Category)
  const codeathon = await prisma.event.create({
    data: {
      name: 'Code-A-Thon 2026',
      description: '24-hour national level hackathon.',
      category: 'PRAGATI',
      minPlayers: 2,
      maxPlayers: 4,
      allowOutside: true, // Path: Invite Code for EVERYONE
      criteria: ['Logic', 'UI/UX', 'Functionality'],
    },
  });

  const sharkTank = await prisma.event.create({
    data: {
      name: 'VGU Shark Tank',
      description: 'Pitching ideas to venture capitalists.',
      category: 'PRATISHTHA',
      minPlayers: 1,
      maxPlayers: 3,
      allowOutside: true, // Path: Invite Code for EVERYONE
      criteria: ['Innovation', 'Scalability', 'Revenue Model'],
    },
  });

  console.log('--- 🎟️ 5. Seeding Invite Codes ---');
  await prisma.eventInvite.createMany({
    data: [
      // For Codeathon
      { code: 'MNIT-HACK-77', eventId: codeathon.id },
      { code: 'JECRC-HACK-12', eventId: codeathon.id },
      { code: 'VGU-TEAM-HACK-01', eventId: codeathon.id }, // Specifically for VGU Team
      
      // For Shark Tank
      { code: 'GUEST-PITCH-01', eventId: sharkTank.id },
      { code: 'VGU-SHARK-01', eventId: sharkTank.id },
    ],
  });

  console.log('--- ⚖️ 6. Seeding Judges & Admin ---');
  const admin = await prisma.admin.create({
    data: {
      name: 'Main Admin',
      email: 'admin@vgu.ac.in',
      password: 'hashed_password_here', // Use bcrypt in production
    },
  });

  const judge = await prisma.judge.create({
    data: {
      name: 'Dr. Satish Kumar',
      email: 'satish@vgu.ac.in',
      password: 'judge_password_here',
    },
  });

  // Assign judge to the hackathon
  await prisma.judgeAssignment.create({
    data: { judgeId: judge.id, eventId: codeathon.id },
  });

  console.log('✅ Full Seeding Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });