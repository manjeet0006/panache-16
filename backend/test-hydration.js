// import { PrismaClient } from '@prisma/client';
// import { performance } from 'perf_hooks';

// // 1. Enable Query Logging to see if the DB is slow or the Network is slow
// const prisma = new PrismaClient({
//   log: [
//     { emit: 'event', level: 'query' },
//     { emit: 'stdout', level: 'info' },
//     { emit: 'stdout', level: 'warn' },
//     { emit: 'stdout', level: 'error' },
//   ],
// });

// // Log actual DB query time
// prisma.$on('query', (e) => {
//   console.log(`\x1b[36mSQL Query took ${e.duration}ms\x1b[0m`);
// });

// const ticketCache = new Map();

// async function hydrateCacheTest() {
//   console.log("🧪 Starting Parallel Hydration Test...");
//   const startTime = performance.now();

//   try {
//     // START TIMER
//     const dbStart = performance.now();

//     // 2. PARALLEL FETCHING (The Fix)
//     // We fire both requests instantly. We don't wait for one to finish before starting the other.
//     const [teams, concertTickets] = await Promise.all([
      
//       // Query A: Teams
//       prisma.team.findMany({
//         select: {
//           ticketCode: true,
//           id: true,
//           teamName: true,
//           paymentStatus: true,
//           event: { select: { eventDate: true, name: true } },
//           // Optimization: Limit logs strictly
//           entryLogs: { orderBy: { scannedAt: "desc" }, take: 1, select: { type: true } },
//           members: {
//             select: {
//               id: true, name: true,
//               entryLogs: { orderBy: { scannedAt: "desc" }, take: 1, select: { type: true } }
//             }
//           }
//         }
//       }),

//       // Query B: Concerts
//       prisma.concertTicket.findMany({
//         select: {
//           arenaCode: true,
//           id: true,
//           guestName: true,
//           isEnterArena: true,
//           isEnterMainGate: true,
//           tier: true,
//           concert: { select: { date: true } },
//           entryLogs: { orderBy: { scannedAt: "desc" }, take: 1, select: { type: true } }
//         }
//       })
//     ]);

//     const dbEnd = performance.now();
//     console.log(`✅ DB Fetch finished in ${(dbEnd - dbStart).toFixed(2)} ms`);
//     console.log(`   - Fetched ${teams.length} Teams`);
//     console.log(`   - Fetched ${concertTickets.length} Concert Tickets`);

//     // 3. Processing (In-Memory)
//     ticketCache.clear();

//     teams.forEach(t => {
//       if (t.ticketCode) {
//         const membersWithStatus = t.members.map(m => ({
//           id: m.id, name: m.name, status: m.entryLogs[0]?.type || 'EXIT'
//         }));
//         ticketCache.set(t.ticketCode, {
//           type: 'TEAM', id: t.id, name: t.teamName, members: membersWithStatus
//         });
//       }
//     });

//     concertTickets.forEach(t => {
//       if (t.arenaCode) {
//         ticketCache.set(t.arenaCode, {
//           type: 'CONCERT', id: t.id, name: t.guestName
//         });
//       }
//     });

//     const endTime = performance.now();
//     console.log(`----------------------------------------`);
//     console.log(`⏱️  Total Execution Time: ${(endTime - startTime).toFixed(2)} ms`);
//     console.log(`----------------------------------------`);

//   } catch (err) {
//     console.error("❌ Test Failed:", err);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// hydrateCacheTest();