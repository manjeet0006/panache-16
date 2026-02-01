// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// async function main() {
//   console.log("🧹 Wiping Database...");

//   // ==========================================
//   // 1. CLEANUP (Children FIRST, Parents LAST)
//   // ==========================================

//   // 1. Logs & Transactions (Depend on Tickets/Teams)
//   await prisma.entryLog.deleteMany({});
//   await prisma.score.deleteMany({});

//   // 2. Tickets & Tiers (Depend on Concerts)
//   await prisma.concertTicket.deleteMany({});       // <--- Delete Children First
//   await prisma.concertTierDetails.deleteMany({});  // <--- Delete Children First

//   // 3. Team & Registration (Depend on Events/Colleges)
//   await prisma.member.deleteMany({});
//   await prisma.registrationRequest.deleteMany({});
//   await prisma.judgeAssignment.deleteMany({});
//   await prisma.eventInvite.deleteMany({});
//   await prisma.team.deleteMany({});

//   // 4. Core Models (The Parents)
//   await prisma.concert.deleteMany({});             // <--- Delete Parent Last
//   await prisma.event.deleteMany({});
//   await prisma.judge.deleteMany({});
//   await prisma.department.deleteMany({});
//   await prisma.college.deleteMany({});
//   await prisma.admin.deleteMany({});

//   console.log("✨ Database wiped. Starting Seed...");

//   // ==========================================
//   // 2. SEED CORE DATA
//   // ==========================================

//   console.log("🏫 Seeding Colleges...");
//   const vgu = await prisma.college.create({
//     data: { 
//       id: 'col_vgu_2026',
//       name: 'Vivekananda Global University', 
//       city: 'Jaipur', 
//       isInternal: true 
//     }
//   });

//   const externalColleges = [
//     { name: 'MNIT Jaipur', city: 'Jaipur' },
//     { name: 'BITS Pilani', city: 'Pilani' },
//     { name: 'IIT Jodhpur', city: 'Jodhpur' }
//   ];
//   for (const col of externalColleges) {
//     await prisma.college.create({ data: { ...col, isInternal: false } });
//   }

//   console.log("🏢 Seeding VGU Departments...");
//   const depts = [
//     { name: 'Computer Science & Engineering', code: 'VGUCS26' },
//     { name: 'Mechanical Engineering', code: 'VGUME26' },
//     { name: 'Design & Arts', code: 'VGUDESIGN26' },
//     { name: 'Management (VMS)', code: 'VGUMGMT26' }
//   ];
//   for (const d of depts) {
//     await prisma.department.create({
//       data: { name: d.name, secretCode: d.code, collegeId: vgu.id }
//     });
//   }

//   // ==========================================
//   // 3. SEED EVENTS
//   // ==========================================
//   console.log("🎟️ Seeding Events...");

//   const events = [
//     {
//       id: 'evt_hackathon',
//       name: 'Code-X Hackathon',
//       category: 'PRAGATI',
//       price: "300",
//       out: true,
//       date: "Feb 12, 09:00 AM",
//       rules: ["Teams: 2-4 members", "Bring laptops"]
//     },
//     {
//       id: 'evt_fashion',
//       name: 'Vogue: Fashion Walk',
//       category: 'PANACHE',
//       price: "500",
//       out: true,
//       date: "Feb 14, 06:00 PM",
//       rules: ["Theme: Ethnic Fusion", "Time: 8 mins"]
//     },
//     {
//       id: 'evt_robowar',
//       name: 'Robo-War: Unleashed',
//       category: 'PRAGATI',
//       price: "400",
//       out: true,
//       date: "Feb 13, 11:00 AM",
//       rules: ["Max Weight: 15kg", "No explosives"]
//     },
//     {
//       id: 'evt_dance',
//       name: 'Step Up: Solo Dance',
//       category: 'PANACHE',
//       price: "150",
//       out: true,
//       date: "Feb 12, 02:00 PM",
//       rules: ["Duration: 2-3 mins", "Decent costumes"]
//     },
//     {
//       id: 'evt_talent',
//       name: 'Department Talent Hunt',
//       category: 'PRATISHTHA',
//       price: "0",
//       out: false,
//       date: "Feb 13, 04:00 PM",
//       rules: ["VGU Students Only", "ID Card Mandatory"]
//     }
//   ];

//   for (const e of events) {
//     await prisma.event.create({
//       data: {
//         id: e.id,
//         name: e.name,
//         description: `Official ${e.name} competition at Panache 2026.`,
//         category: e.category,
//         eventPrice: e.price,
//         allowOutside: e.out,
//         minPlayers: 1,
//         maxPlayers: 10,
//         dateLabel: e.date,
//         eventDate: new Date(), 
//         guidelines: e.rules
//       }
//     });
//   }

//   // ==========================================
//   // 4. SEED ADMIN & INVITES
//   // ==========================================
//   console.log("🔑 Generating Secure Invite Codes...");
//   const globalEvents = events.filter(e => e.out);
//   for (const ev of globalEvents) {
//     const prefix = ev.name.substring(0, 3).toUpperCase();
//     for (let i = 1; i <= 3; i++) {
//       await prisma.eventInvite.create({
//         data: { code: `EXT-${prefix}-${100 + i}`, eventId: ev.id }
//       });
//     }
//   }

//   console.log("🛡️ Seeding Admin & Judges...");
//   await prisma.admin.create({
//     data: { name: 'Manjeet Kumar', email: 'admin@panache.in', password: 'securepassword2026' }
//   });

//   const judge = await prisma.judge.create({
//     data: { name: 'Dr. Pallavi Singh', email: 'judge01@vgu.ac.in', password: 'judgepassword123' }
//   });

//   await prisma.judgeAssignment.create({
//     data: { judgeId: judge.id, eventId: 'evt_hackathon' }
//   });


//   // ==========================================
//   // 5. SEED CONCERTS (Full Lineup)
//   // ==========================================
//   console.log('🎸 Seeding Concert Data...');

//   // 1. DIVINE
//   await prisma.concert.create({
//     data: {
//       id: "concert_day_1",
//       artistName: "Divine",
//       dayLabel: "Day 1 - Gully Gang",
//       date: new Date('2026-02-12T19:00:00Z'),
//       imageUrl: "https://im.rediff.com/movies/2019/feb/13gully-boy1.jpg",
//       tierDetails: {
//         create: [
//           { tier: 'SILVER', price: "499", ticketLimit: 500 },
//           { tier: 'GOLD', price: "999", ticketLimit: 200 },
//           { tier: 'PLATINUM', price: "2499", ticketLimit: 50 },
//         ]
//       }
//     }
//   });

//   // 2. ARIJIT SINGH
//   await prisma.concert.create({
//     data: {
//       id: "concert_day_2",
//       artistName: "Arijit Singh",
//       dayLabel: "Day 2 - Soulful Night",
//       date: new Date('2026-02-13T20:00:00Z'),
//       imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Arijit_Singh.jpg",
//       tierDetails: {
//         create: [
//           { tier: 'SILVER', price: "799", ticketLimit: 800 },
//           { tier: 'GOLD', price: "1499", ticketLimit: 300 },
//           { tier: 'PLATINUM', price: "3999", ticketLimit: 100 },
//         ]
//       }
//     }
//   });

//   // 3. KING
//   await prisma.concert.create({
//     data: {
//       id: "concert_day_3",
//       artistName: "King",
//       dayLabel: "Day 3 - Champagne Talk",
//       date: new Date('2026-02-14T19:00:00Z'),
//       imageUrl: "https://i.scdn.co/image/ab6761610000e5eb5b4fa9d592b2d9092eb68be7",
//       tierDetails: {
//         create: [
//           { tier: 'SILVER', price: "699", ticketLimit: 400 },
//           { tier: 'GOLD', price: "1299", ticketLimit: 200 },
//           { tier: 'PLATINUM', price: "2999", ticketLimit: 50 },
//         ]
//       }
//     }
//   });

//   // 4. DARSHAN RAVAL
//   await prisma.concert.create({
//     data: {
//       id: "concert_day_4",
//       artistName: "Darshan Raval",
//       dayLabel: "Day 4 - Blue Family Live",
//       date: new Date('2026-02-15T19:00:00Z'),
//       imageUrl: "https://i.scdn.co/image/ab6761610000e5eb4e4a7d7d7d7d7d7d7d7d7d7d",
//       tierDetails: {
//         create: [
//           { tier: 'SILVER', price: "599", ticketLimit: 400 },
//           { tier: 'GOLD', price: "1199", ticketLimit: 200 },
//           { tier: 'PLATINUM', price: "2599", ticketLimit: 50 },
//         ]
//       }
//     }
//   });

//   // 5. NUCLEYA
//   await prisma.concert.create({
//     data: {
//       id: "concert_day_5",
//       artistName: "Nucleya",
//       dayLabel: "Day 5 - Bass Rani Finale",
//       date: new Date('2026-02-16T20:00:00Z'),
//       imageUrl: "https://i.scdn.co/image/ab6761610000e5eb9c2d7f7d7d7d7d7d7d7d7d7d",
//       tierDetails: {
//         create: [
//           { tier: 'SILVER', price: "499", ticketLimit: 500 },
//           { tier: 'GOLD', price: "999", ticketLimit: 300 },
//           { tier: 'PLATINUM', price: "1999", ticketLimit: 100 },
//         ]
//       }
//     }
//   });

//   console.log('✅ Concerts Seeded');
//   console.log("🏁 Seed complete! Panache Era 2026 is ready.");
// }

// main()
//   .catch((e) => { console.error(e); process.exit(1); })
//   .finally(async () => { await prisma.$disconnect(); });





// async function main() {
//   console.log("🚀 Starting incremental seed...");

//   // 1. Seed New External Colleges
//   // console.log("🏫 Seeding Additional External Colleges...");
//   const externalColleges = [
//     { name: 'SKIT', city: 'Jaipur' },
//     { name: 'NIMS', city: 'Jaipur' }, // Changed Pilani to Jaipur (common location) or keep as is
//     { name: 'JECRC', city: 'Jaipur' } // Changed Jodhpur to Jaipur (common location) or keep as is
//   ];

  // for (const col of externalColleges) {
  //   // Check if exists to avoid unique constraint errors
  //   const existing = await prisma.college.findFirst({
  //     where: { name: col.name }
  //   });

  //   if (!existing) {
  //     await prisma.college.create({ data: { ...col, isInternal: false } });
  //     console.log(`✅ Created: ${col.name}`);
  //   } else {
  //     console.log(`ℹ️ Skipped (Already exists): ${col.name}`);
  //   }
  // }

  // 2. Generate Invite Codes
//   console.log("🔑 Generating Secure Invite Codes...");
  
//   // FETCH EVENTS FROM DB (Fixes 'events is not defined' error)
//   const globalEvents = await prisma.event.findMany({
//     where: { allowOutside: true }
//   });

//   if (globalEvents.length === 0) {
//     console.log("⚠️ No external events found in DB. Please run the full seed first.");
//     return;
//   }

//   for (const ev of globalEvents) {
//     // Generate a clean prefix (first 3 chars, uppercase, no spaces)
//     const prefix = ev.name.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();

//     for (let i = 1; i <= 4; i++) {
//       const code = `EXT-${prefix}-${120 + i}`;

//       // Try/Catch to safely skip duplicates without crashing
//       try {
//         await prisma.eventInvite.create({
//           data: { code: code, eventId: ev.id }
//         });
//         console.log(`   👉 Generated ${code} for ${ev.name}`);
//       } catch (error) {
//         // Code likely exists, ignore
//       }
//     }
//   }

//   console.log("🏁 Incremental seed complete!");
// }

// main()
//   .catch((e) => { console.error(e); process.exit(1); })
//   .finally(async () => { await prisma.$disconnect(); });




// async function main() {
//   console.log('🌱 Starting LeaderBoard seed...');

//   // 1. Clear existing data (Optional: Remove if you want to keep old data)
//   await prisma.leaderBoard.deleteMany({});
//   console.log('🧹 Cleared existing leaderboard entries.');

//   // 2. Define 19 Departments with realistic dummy data
//   const leaderBoardData = [
//     { teamName: "Code Titans", score: "98.5", deptName: "Computer Science (CSE)" },
//     { teamName: "Cyber Sentinels", score: "96.0", deptName: "Cyber Security" },
//     { teamName: "AI Innovators", score: "95.5", deptName: "AI & Data Science" },
//     { teamName: "Robo Corps", score: "94.0", deptName: "Robotics & Automation" },
//     { teamName: "Electro Buzz", score: "92.5", deptName: "Electronics (ECE)" },
//     { teamName: "Web Weavers", score: "91.0", deptName: "Information Technology (IT)" },
//     { teamName: "Power Rangers", score: "89.5", deptName: "Electrical Engineering (EE)" },
//     { teamName: "Gear Heads", score: "88.0", deptName: "Mechanical Engineering (ME)" },
//     { teamName: "Structura", score: "87.5", deptName: "Civil Engineering (CE)" },
//     { teamName: "Bio Hackers", score: "86.0", deptName: "Biotechnology" },
//     { teamName: "Chem Catalysts", score: "85.5", deptName: "Chemical Engineering" },
//     { teamName: "Aero Flyers", score: "84.0", deptName: "Aerospace Engineering" },
//     { teamName: "Auto Motives", score: "83.5", deptName: "Automobile Engineering" },
//     { teamName: "Mech Masters", score: "82.0", deptName: "Mechatronics" },
//     { teamName: "Design Zen", score: "80.5", deptName: "Architecture" },
//     { teamName: "Space Creators", score: "79.0", deptName: "Interior Design" },
//     { teamName: "Vogue Squad", score: "78.5", deptName: "Fashion Design" },
//     { teamName: "Biz Tycoons", score: "77.0", deptName: "Business Admin (BBA)" },
//     { teamName: "CSI Investigators", score: "75.5", deptName: "Forensic Science" },
//   ];

//   // 3. Insert Data
//   // We add 'collegeName: "VGU"' to all of them
//   const dataWithCollege = leaderBoardData.map((entry) => ({
//     ...entry,
//     // collegeName: "VGU Campus",
//   }));

//   await prisma.leaderBoard.createMany({
//     data: dataWithCollege,
//   });

//   console.log(`✅ Successfully seeded ${leaderBoardData.length} leaderboard entries!`);
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });


import { PrismaClient, PaymentStatus, EventCategory } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Ensure we have a College (or create one)
  let college = await prisma.college.findFirst();
  if (!college) {
    college = await prisma.college.create({
      data: {
        name: 'VGU Main Campus',
        city: 'Jaipur',
        isInternal: true,
      },
    });
    console.log('🏫 Created Default College:', college.name);
  }

  // 2. Ensure we have an Event (or create one)
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        name: 'Hackathon 2026',
        description: 'The ultimate coding battle.',
        category: EventCategory.PRAGATI,
        minPlayers: 10,
        maxPlayers: 15,
        eventPrice: '500',
        registrationOpen: true,
      },
    });
    console.log('📅 Created Default Event:', event.name);
  }

  // 3. Generate 500 Teams
  console.log('🚀 Generating 500 Teams with Members... This might take a moment.');

  const totalTeams = 500;
  
  // We use a transaction or just a loop. A loop is safer for large datasets to avoid timeout/memory issues.
  for (let i = 0; i < totalTeams; i++) {
    
    // Randomize member count between 10 and 15
    const memberCount = faker.number.int({ min: 10, max: 15 });
    
    // Generate Members Array
    const membersData = [];
    for (let m = 0; m < memberCount; m++) {
      membersData.push({
        name: faker.person.fullName(),
        enrollment: faker.string.alphanumeric(10).toUpperCase(),
        phone: faker.phone.number(), // Updated faker method
        isLeader: m === 0, // First member is leader
      });
    }

    // Create Team with nested members
    await prisma.team.create({
      data: {
        teamName: `${faker.word.adjective()} ${faker.animal.type()} ${i + 1}`, // e.g. "Brave Lion 12"
        teamEmail: faker.internet.email(),
        paymentStatus: PaymentStatus.APPROVED, // Assuming paid for data vis
        ticketCode: `TKT-${faker.string.alphanumeric(8).toUpperCase()}`, // Unique Ticket Code
        
        // Relations
        eventId: event.id,
        collegeId: college.id,
        
        // Create Members directly
        members: {
          create: membersData,
        },
      },
    });

    // Log progress every 50 teams
    if ((i + 1) % 50 === 0) {
      console.log(`✅ Generated ${i + 1} / ${totalTeams} teams`);
    }
  }

  console.log('✨ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });