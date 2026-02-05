import express from 'express';
import { formatInTimeZone } from 'date-fns-tz';
import { createServer } from 'http'; // Required for WebSockets
import { Server } from 'socket.io';   // Required for WebSockets
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './db.js';


import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import judgingRoutes from './routes/judgingRoutes.js';
import scanningRoutes from './routes/scanningRoutes.js';
import metaRoutes from './routes/meta.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import concertRoutes from './routes/concertRoutes.js';
// import emailRoutes from './routes/emailRoutes.js';
import zlib from 'zlib';
// import userRoutes from './routes/userRoutes'
dotenv.config();

const app = express();
app.use(helmet());
const httpServer = createServer(app); // Wrap express app

app.set('trust proxy', 1);

// 1. Configure CORS & Socket.io
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5175",
  "https://panache.vercel.app",
  "https://panache-16.vercel.app",
  "https://panache-16-gghv.vercel.app",
  "https://adminpanache16.vercel.app",
  "*"
];


app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    // 1. Try standard Express IP (works if 'trust proxy' is set)
    let clientIp = req.ip;

    if (!clientIp || clientIp === '::1' || clientIp === '127.0.0.1') {
        clientIp = req.headers['x-forwarded-for'] || req.headers['cf-connecting-ip'];
    }


    // The first one is usually the real client.
    if (clientIp && clientIp.includes(',')) {
        clientIp = clientIp.split(',')[0].trim();
    }

    // 4. Log it
    console.log(`📡 Request: ${req.method} ${req.url} | From IP: ${clientIp}`);

    next(); // Pass control to the next middleware/route
});

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});



// In-memory cache
export const ticketCache = new Map();

// --- Compression Helpers ---
function compressData(data) {
  const jsonString = JSON.stringify(data);
  // Use level 1 for speed, as requested
  return zlib.gzipSync(jsonString, { level: 1 });
}

function decompressData(buffer) {
  const uncompressed = zlib.gunzipSync(buffer);
  return JSON.parse(uncompressed.toString());
}

// Readiness flag
let cacheReady = false;

// Hydrate cache on server start
export async function hydrateCache() {
  try {
    console.log("🔥 Hydrating cache...");
    const start = Date.now();
    const CHUNK_SIZE = 500; // Process 500 records at a time to conserve memory

    ticketCache.clear();
    console.log("  - Cache cleared.");

    // --- Process Teams in Chunks ---
    let teamCursor = undefined;
    let teamsProcessed = 0;
    while (true) {
      console.log(`  - Fetching team chunk... (cursor: ${teamCursor})`);
      const teams = await prisma.team.findMany({
        take: CHUNK_SIZE,
        ...(teamCursor && { skip: 1, cursor: { id: teamCursor } }), // Paginate using the cursor
        select: {
          ticketCode: true,
          id: true,
          teamName: true,
          paymentStatus: true,
          event: { select: { eventDate: true, name: true } },
          entryLogs: { orderBy: { scannedAt: "desc" }, take: 1, select: { type: true } },
          members: {
            select: { id: true, name: true, entryLogs: { orderBy: { scannedAt: "desc" }, take: 1, select: { type: true } } }
          }
        }
      });

      if (teams.length === 0) {
        break; // No more teams to process
      }

      teams.forEach(t => {
        if (t.ticketCode) {
          const membersWithStatus = t.members.map(m => ({
            id: m.id,
            name: m.name,
            status: (m.entryLogs[0]?.type === 'ENTRY') ? 1 : 0
          }));
          const ticketObject = {
            type: 'TEAM',
            id: t.id,
            name: t.teamName,
            payment: t.paymentStatus,
            eventDate: t.event?.eventDate,
            eventName: t.event?.name,
            lastStatus: (t.entryLogs[0]?.type === 'ENTRY') ? 1 : 0,
            members: membersWithStatus
          };
          ticketCache.set(t.ticketCode, compressData(ticketObject));
        }
      });

      teamCursor = teams[teams.length - 1].id;
      teamsProcessed += teams.length;
      console.log(`  - Processed ${teams.length} teams. Total teams processed: ${teamsProcessed}`);
    }

    // --- Process Concert Tickets in Chunks ---
    let ticketCursor = undefined;
    let ticketsProcessed = 0;
    while (true) {
      console.log(`  - Fetching concert ticket chunk... (cursor: ${ticketCursor})`);
      const concertTickets = await prisma.concertTicket.findMany({
        take: CHUNK_SIZE,
        ...(ticketCursor && { skip: 1, cursor: { id: ticketCursor } }), // Paginate
        select: {
          arenaCode: true,
          id: true,
          guestName: true,
          isEnterArena: true,
          isEnterMainGate: true,
          tier: true,
          concert: { select: { date: true } },
          entryLogs: { orderBy: { scannedAt: "desc" }, take: 1, select: { type: true } }
        }
      });

      if (concertTickets.length === 0) {
        break; // No more tickets to process
      }

      concertTickets.forEach(t => {
        if (t.arenaCode) {
          const ticketObject = {
            type: 'CONCERT',
            id: t.id,
            name: t.guestName,
            isEnterArena: t.isEnterArena,
            isEnterMainGate: t.isEnterMainGate,
            tier: t.tier,
            concertDate: t.concert?.date,
            lastStatus: (t.entryLogs[0]?.type === 'ENTRY') ? 1 : 0,
          };
          ticketCache.set(t.arenaCode, compressData(ticketObject));
        }
      });

      ticketCursor = concertTickets[concertTickets.length - 1].id;
      ticketsProcessed += concertTickets.length;
      console.log(`  - Processed ${concertTickets.length} tickets. Total tickets processed: ${ticketsProcessed}`);
    }

    cacheReady = true;
    console.log(`⚡ Cache Ready: ${ticketCache.size} total tickets in ${Date.now() - start}ms`);
  } catch (err) {
    // This will now catch errors from any chunk and log them.
    console.error("❌ Cache hydration failed:", err);
  }
}

export async function updateTeamInCache(teamId) {
    try {
        const t = await prisma.team.findUnique({
            where: { id: teamId },
            select: {
                ticketCode: true, id: true, teamName: true, paymentStatus: true,
                event: { select: { eventDate: true, name: true } },
                entryLogs: { orderBy: { scannedAt: "desc" }, take: 1, select: { type: true } },
                members: {
                  select: {
                    id: true, name: true,
                    entryLogs: { orderBy: { scannedAt: "desc" }, take: 1, select: { type: true } }
                  }
                }
            }
        });

        if (t && t.ticketCode) {
            const membersWithStatus = t.members.map(m => ({
              id: m.id,
              name: m.name,
              status: (m.entryLogs[0]?.type === 'ENTRY') ? 1 : 0
            }));

            const ticketObject = {
                type: 'TEAM',
                id: t.id,
                name: t.teamName,
                payment: t.paymentStatus,
                eventDate: t.event?.eventDate,
                eventName: t.event?.name,
                lastStatus: (t.entryLogs[0]?.type === 'ENTRY') ? 1 : 0,
                members: membersWithStatus
            };
            ticketCache.set(t.ticketCode, compressData(ticketObject));
            console.log(`✅ TEAM CACHE UPDATED: ${t.teamName}`);
        }
    } catch (err) {
        console.error(`❌ Failed to update team cache for ID ${teamId}:`, err);
    }
}

export async function updateConcertTicketInCache(ticketId) {
    try {
        const t = await prisma.concertTicket.findUnique({
            where: { id: ticketId },
            select: { 
              arenaCode: true, id: true, guestName: true, isEnterArena: true, isEnterMainGate: true, tier: true,
              concert: { select: { date: true } }, // Include concert date
              entryLogs: { orderBy: { scannedAt: "desc" }, take: 1, select: { type: true } }
            }
        });

        if (t && t.arenaCode) {
            const ticketObject = {
                type: 'CONCERT',
                id: t.id,
                name: t.guestName,
                isEnterArena: t.isEnterArena,
                isEnterMainGate: t.isEnterMainGate,
                tier: t.tier,
                concertDate: t.concert?.date,
                lastStatus: (t.entryLogs[0]?.type === 'ENTRY') ? 1 : 0,
            };
            ticketCache.set(t.arenaCode, compressData(ticketObject));
            console.log(`✅ CONCERT CACHE UPDATED: ${t.guestName}`);
        }
    } catch (err) {
        console.error(`❌ Failed to update concert ticket cache for ID ${ticketId}:`, err);
    }
}

// await hydrateCache();


function notifySystemReady() {
  if (cacheReady) {
    io.emit("SYSTEM_READY");
  }
}

// 3. Socket Logic
const socketRateLimit = new Map();
const activeIPs = new Map();

io.on("connection", (socket) => {
  // Use X-Forwarded-For if behind a proxy (like Cloudflare/Render)
  // Otherwise, use socket.handshake.address
  let ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;

  // The x-forwarded-for header can be a comma-separated list of IPs.
  // The first one is the original client IP.
  if (ip && ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }

  // --- MAX 2 CONNECTIONS PER IP LOGIC ---
  const connections = activeIPs.get(ip) || [];
  if (connections.length >= 2) {
    console.log(`Blocking connection from ${ip}, limit of 2 reached.`);
    socket.disconnect(true);
    return;
  }
  
  socket.ipAddress = ip;
  activeIPs.set(ip, [...connections, socket.id]);


  
  const now = Date.now();
  const lastConnection = socketRateLimit.get(ip);
  
  // 1 second cooldown
  if (lastConnection && now - lastConnection < 1000) {
    console.log(`Blocking frequent connection from ${ip}`);
    socket.disconnect(true);
    return;
  }
  
  socketRateLimit.set(ip, now);

  console.log(`Socket connected: ${socket.id} from ${ip}. Total connections from this IP: ${[...connections, socket.id].length}`);

  // IMMEDIATE HANDSHAKE: Tell the client if we are ready or warming up
  socket.emit("SYSTEM_STATUS", {
    isReady: cacheReady
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
    const ip = socket.ipAddress;
    if (ip) {
      const connections = activeIPs.get(ip) || [];
      const newConnections = connections.filter(id => id !== socket.id);

      if (newConnections.length > 0) {
        activeIPs.set(ip, newConnections);
      } else {
        activeIPs.delete(ip);
      }
      console.log(`IP ${ip} now has ${newConnections.length} connections.`);
    }
  });

  socket.on("VERIFY_SCAN", async (data) => {
    if (!cacheReady) {
      return socket.emit("SCAN_ERROR", { error: "System warming up, try again" });
    }

    const { ticketCode, scannerId } = data;
    const buffer = ticketCache.get(ticketCode);

    if (!buffer) {
      return socket.emit("SCAN_ERROR", { error: "Ticket Not Found" });
    }

    const ticket = decompressData(buffer);


    // --- 1. DATE VALIDATION (TIMEZONE-AWARE) ---
    // All dates are compared in the event's local timezone to avoid server timezone issues.
    // TODO: Consider moving 'Asia/Kolkata' to an environment variable.
    const timeZone = 'Asia/Kolkata';
    const today = formatInTimeZone(new Date(), timeZone, 'yyyy-MM-dd');

    let ticketDateStr = null;
    const ticketEventDate = ticket.type === 'TEAM' ? ticket.eventDate : ticket.concertDate;

    if (ticketEventDate) {
      ticketDateStr = formatInTimeZone(new Date(ticketEventDate), timeZone, 'yyyy-MM-dd');
    }

    if (ticketDateStr && ticketDateStr !== today) {
      return socket.emit("SCAN_ERROR", { error: "Ticket not valid for today" });
    }

    // --- 2. GATE-SPECIFIC LOGIC ---
    switch (scannerId) {
      case 'CELEBRITY_GATE':
        if (ticket.type !== 'CONCERT') {
          return socket.emit("SCAN_ERROR", { error: "Only Celebrity Passes Allowed Here" });
        }

        // Check specifically for Arena/Celebrity Gate entry
        if (ticket.isEnterArena) {
          return socket.emit("SCAN_ERROR", { error: "Pass Already Used at Celebrity Gate" });
        }

        // Update cache & DB for Celebrity Gate
        ticket.isEnterArena = true;
        ticketCache.set(ticketCode, compressData(ticket)); // Re-compress and save
        prisma.concertTicket.update({
            where: { id: ticket.id },
            data: { isEnterArena: true }
        }).catch(console.error);

        socket.emit("SCAN_SUCCESS", {
          action: "ENTRY",
          teamName: ticket.name,
          message: `${ticket.tier} TIER - Arena Entry`
        });
        break;

      case 'MAIN_GATE':
        if (ticket.type === 'TEAM') {
          // ... existing team logic ...
          socket.emit("SCAN_TEAM_DETAILS", {
            teamName: ticket.name,
            teamId: ticket.id,
            members: ticket.members.map(m => ({ // Decode status for frontend
                ...m,
                status: m.status === 1 ? 'ENTRY' : 'EXIT'
            }))
          });
        } else if (ticket.type === 'CONCERT') {

          // Check specifically for Main Gate entry
          if (ticket.isEnterMainGate) {
            return socket.emit("SCAN_ERROR", { error: "Pass Already Used at Main Gate" });
          }

          // Update cache & DB for Main Gate
          ticket.isEnterMainGate = true;
          ticketCache.set(ticketCode, compressData(ticket)); // Re-compress and save
          prisma.concertTicket.update({
              where: { id: ticket.id },
              data: { isEnterMainGate: true }
          }).catch(console.error);

          socket.emit("SCAN_SUCCESS", {
            action: "ENTRY",
            teamName: ticket.name,
            message: "Concert Pass - Campus Entry"
          });
        }
        break;

      default:
        return socket.emit("SCAN_ERROR", { error: "Invalid Scanner ID" });
    }
  });

  socket.on("TOGGLE_MEMBER_STATUS", async ({ teamId, memberId, memberName, scannerId }) => {
    // This is inefficient, but it matches the old logic's intent in a compressed world.
    // A better solution would be a secondary map from teamId -> ticketCode.
    let teamTicketCode = null;
    let teamTicket = null;

    for (const [key, value] of ticketCache.entries()) {
        const decompressed = decompressData(value);
        if (decompressed.type === 'TEAM' && decompressed.id === teamId) {
            teamTicket = decompressed;
            teamTicketCode = key;
            break;
        }
    }

    if (!teamTicket) {
      return socket.emit("SCAN_ERROR", { error: "Team not found in cache" });
    }

    const member = teamTicket.members.find(m => m.id === memberId);

    if (!member) {
      // This should ideally not happen if the frontend sends correct data
      return socket.emit("SCAN_ERROR", { error: "Member not found in team" });
    }

    // Determine next action and update cache
    const currentStatus = member.status || 0; // 0 for 'EXIT'
    const nextAction = currentStatus === 1 ? 0 : 1; // Toggle between 1 (ENTRY) and 0 (EXIT)
    member.status = nextAction; // Update status in the decompressed object

    // Re-compress and save the updated object
    ticketCache.set(teamTicketCode, compressData(teamTicket));


    // Log the event to the database
    prisma.entryLog.create({
      data: {
        teamId: teamTicket.id,
        memberId: memberId, // <<< Critically, log the specific member
        scannerId: scannerId || "MAIN_GATE_MEMBER_LOG",
        type: nextAction === 1 ? 'ENTRY' : 'EXIT', // Log string to DB
        dayNumber: 1, // Assuming day 1, this could be dynamic
      }
    }).catch(console.error); // Log errors silently on the server

    // Notify the frontend of success
    const actionString = nextAction === 1 ? 'ENTRY' : 'EXIT';
    socket.emit("MEMBER_LOG_SUCCESS", {
      action: actionString,
      memberName: memberName,
      teamName: teamTicket.name,
      message: `${memberName} from ${teamTicket.name} logged for ${actionString}.`
    });

    // Also, broadcast the updated team details so all scanners are aware
    io.emit("TEAM_MEMBERS_UPDATED", {
      teamId: teamTicket.id,
      members: teamTicket.members.map(m => ({ // Also decode here
          ...m,
          status: m.status === 1 ? 'ENTRY' : 'EXIT'
      })),
    });
  });
});


// CLEANUP: Clear the map every 1 minute. 
// Since we only care about the last 1 second, clearing every minute is totally safe.
setInterval(() => {
  socketRateLimit.clear();
}, 60 * 1000); // Clear every 60 seconds





// Lightweight Keep-Alive Route
app.get('/ping', (req, res) => {
  res.status(200).send('Pong');
});

app.use('/api/admin', adminRoutes);
// 3. REST ROUTES
app.use('/api', apiLimiter);

app.use('/api/register', registrationRoutes);
app.use('/api/judge', judgingRoutes);
app.use('/api/scan', scanningRoutes); // Keep for history/manual lookups
app.use('/api/meta', metaRoutes);

app.use('/api/concert', concertRoutes);

app.use('/api/user', userRoutes);
// app.use('/api' , emailRoutes);

app.use(errorHandler);



export { io };


hydrateCache().then(() => {
  console.log("✅ Hydration Finished");
  notifySystemReady(); // <--- Notify all connected clients
}).catch(err => {
    console.error("Cache hydration failed, shutting down.", err);
    process.exit(1);
});

// The port number can be configured in the .env file.
const PORT = process.env.PORT || 5000;
// CRITICAL: Use httpServer.listen, NOT app.listen
httpServer.listen(PORT, () => {
  console.log(`🚀 Unified Real-time Backend running on port ${PORT}`);
});