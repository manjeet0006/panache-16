import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Wiping Database...");

  // Order: Child models first to avoid Foreign Key violations
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
  await prisma.judgeAssignment.deleteMany({});
  await prisma.judge.deleteMany({});

  console.log("🏫 Seeding Colleges...");
  const vgu = await prisma.college.create({
    data: { 
      id: 'col_vgu_2026',
      name: 'Vivekananda Global University', 
      city: 'Jaipur', 
      isInternal: true 
    }
  });

  const externalColleges = [
    { name: 'MNIT Jaipur', city: 'Jaipur' },
    { name: 'BITS Pilani', city: 'Pilani' },
    { name: 'IIT Jodhpur', city: 'Jodhpur' }
  ];
  for (const col of externalColleges) {
    await prisma.college.create({ data: { ...col, isInternal: false } });
  }

  console.log("🏢 Seeding VGU Departments...");
  const depts = [
    { name: 'Computer Science & Engineering', code: 'VGUCS26' },
    { name: 'Mechanical Engineering', code: 'VGUME26' },
    { name: 'Design & Arts', code: 'VGUDESIGN26' },
    { name: 'Management (VMS)', code: 'VGUMGMT26' }
  ];
  for (const d of depts) {
    await prisma.department.create({
      data: { name: d.name, secretCode: d.code, collegeId: vgu.id }
    });
  }

  console.log("🎟️ Seeding High-Fidelity Events...");

  const events = [
    {
      id: 'evt_hackathon',
      name: 'Code-X Hackathon',
      category: 'PRAGATI',
      price: "300",
      out: true,
      date: "Feb 12, 09:00 AM",
      rules: [
        "Teams must consist of 2-4 members.",
        "Problem statements will be released on the spot.",
        "Participants must bring their own laptops and chargers.",
        "Use of pre-built templates is strictly prohibited."
      ]
    },
    {
      id: 'evt_fashion',
      name: 'Vogue: Fashion Walk',
      category: 'PANACHE',
      price: "500",
      out: true,
      date: "Feb 14, 06:00 PM",
      rules: [
        "Theme: Ethnic Fusion or Cyberpunk.",
        "Time limit: 8 minutes including setup.",
        "Vulgarity in attire or performance leads to disqualification.",
        "Carry your own music in a Pendrive (MP3 format)."
      ]
    },
    {
      id: 'evt_robowar',
      name: 'Robo-War: Unleashed',
      category: 'PRAGATI',
      price: "400",
      out: true,
      date: "Feb 13, 11:00 AM",
      rules: [
        "Bot weight must not exceed 15kg.",
        "Use of fire, liquids, or explosives is prohibited.",
        "Match duration: 3 minutes per round.",
        "Safety goggles are mandatory for all team members."
      ]
    },
    {
      id: 'evt_dance',
      name: 'Step Up: Solo Dance',
      category: 'PANACHE',
      price: "150",
      out: true,
      date: "Feb 12, 02:00 PM",
      rules: [
        "All dance styles are welcome.",
        "Performance duration: 2 to 3 minutes.",
        "Costumes should be appropriate for a campus environment.",
        "Judging based on rhythm, expression, and stage presence."
      ]
    },
    {
      id: 'evt_talent',
      name: 'Department Talent Hunt',
      category: 'PRATISHTHA',
      price: "0",
      out: false,
      date: "Feb 13, 04:00 PM",
      rules: [
        "Exclusive to VGU Students only.",
        "Showcase any talent: Magic, Comedy, or Mimicry.",
        "Time limit: 5 minutes per department.",
        "Physical ID cards must be presented at the stage entrance."
      ]
    }
  ];

  for (const e of events) {
    await prisma.event.create({
      data: {
        id: e.id,
        name: e.name,
        description: `Official ${e.name} competition at Panache 2026.`,
        category: e.category,
        eventPrice: e.price,
        allowOutside: e.out,
        minPlayers: 1,
        maxPlayers: 10,
        dateLabel: e.date,
        eventDate: new Date(2026, 1, 12), // Placeholder date
        guidelines: e.rules
      }
    });
  }

  console.log("🔑 Generating Secure Invite Codes...");
  const globalEvents = events.filter(e => e.out);
  for (const ev of globalEvents) {
    const prefix = ev.name.substring(0, 3).toUpperCase();
    
    // Create 5 External (Paid) Codes
    for (let i = 1; i <= 5; i++) {
      await prisma.eventInvite.create({
        data: { code: `EXT-${prefix}-${100 + i}`, eventId: ev.id }
      });
    }

    // Create 3 Internal (Dept) Codes for Global Events
    for (let i = 1; i <= 3; i++) {
      await prisma.eventInvite.create({
        data: { code: `VGU-${prefix}-${500 + i}`, eventId: ev.id }
      });
    }
  }

  console.log("🛡️ Seeding Admin & Judges...");
  await prisma.admin.create({
    data: { name: 'Manjeet Kumar', email: 'admin@panache.in', password: 'securepassword2026' }
  });

  const judge = await prisma.judge.create({
    data: { name: 'Dr. Pallavi Singh', email: 'judge01@vgu.ac.in', password: 'judgepassword123' }
  });

  await prisma.judgeAssignment.create({
    data: { judgeId: judge.id, eventId: 'evt_hackathon' }
  });

  console.log("🏁 Seed complete! Panache Era 2026 is ready.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });