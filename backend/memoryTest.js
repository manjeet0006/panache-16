import zlib from 'zlib';

// --- Helper Functions (mirrors your index.js) ---

function compressData(data) {
  const jsonString = JSON.stringify(data);
  return zlib.gzipSync(jsonString, { level: 1 });
}

function createDummyTeam(id) {
  const members = [];
  for (let i = 0; i < 4; i++) { // Assuming 4 members per team
    members.push({
      id: `member-${id}-${i}`,
      name: `Member Name ${i}`,
      status: Math.random() > 0.5 ? 1 : 0,
    });
  }

  return {
    type: 'TEAM',
    id: `team-id-${id}`,
    name: `Team Name ${id}`,
    payment: 'PAID',
    eventDate: new Date().toISOString(),
    eventName: 'Some Sample Event',
    lastStatus: Math.random() > 0.5 ? 1 : 0,
    members: members,
  };
}

function createDummyConcertTicket(id) {
  return {
    type: 'CONCERT',
    id: `concert-id-${id}`,
    name: `Guest Name ${id}`,
    isEnterArena: Math.random() > 0.5,
    isEnterMainGate: Math.random() > 0.5,
    tier: 'GOLD',
    concertDate: new Date().toISOString(),
    lastStatus: Math.random() > 0.5 ? 1 : 0,
  };
}


// --- Main Test Logic ---

const USER_COUNT = 200000;
const testCache = new Map();

console.log('--- Memory Usage Test ---');
console.log(`Simulating ${USER_COUNT} users...`);

// 1. Measure baseline memory
const startMem = process.memoryUsage();
console.log(`Initial Heap Used: ${(startMem.heapUsed / 1024 / 1024).toFixed(2)} MB`);


// 2. Populate the cache
for (let i = 0; i < USER_COUNT; i++) {
  const ticketCode = `TICKET-${i}`;
  let ticketObject;

  // Create a 50/50 mix of team and concert tickets
  if (i % 2 === 0) {
    ticketObject = createDummyTeam(i);
  } else {
    ticketObject = createDummyConcertTicket(i);
  }

  const compressedTicket = compressData(ticketObject);
  testCache.set(ticketCode, compressedTicket);
}

console.log(`
Cache populated with ${testCache.size} items.`);


// 3. Measure final memory usage
const endMem = process.memoryUsage();
console.log(`Final Heap Used:   ${(endMem.heapUsed / 1024 / 1024).toFixed(2)} MB`);

// 4. Calculate and report the difference
const usedForCache = endMem.heapUsed - startMem.heapUsed;
console.log(`
>>> Heap used for cache: ${(usedForCache / 1024 / 1024).toFixed(2)} MB`);
console.log(`>>> Average memory per user: ${(usedForCache / USER_COUNT).toFixed(2)} bytes`);
console.log('\n--- Test Complete ---');
