import express from 'express';
import { createServer } from 'http'; // Required for WebSockets
import { Server } from 'socket.io';   // Required for WebSockets
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
import concertRoutes from './routes/concertRoutes.js';
// import emailRoutes from './routes/emailRoutes.js';
// import userRoutes from './routes/userRoutes'
dotenv.config();

const app = express();
const httpServer = createServer(app); // Wrap express app

app.set('trust proxy', 1);

// 1. Configure CORS & Socket.io
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5175",
  "https://panache.vercel.app",
  "https://panache-16.vercel.app",
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

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});


// In-memory cache
export const ticketCache = new Map();

// Readiness flag
let cacheReady = false;

// Hydrate cache on server start
export async function hydrateCache() {
  try {
    console.log("🔥 Hydrating cache...");
    const start = Date.now();

    // 1. Fetch Teams + Members
    const teams = await prisma.team.findMany({
      select: {
        ticketCode: true,
        id: true,
        teamName: true,
        paymentStatus: true,
        event: { select: { eventDate: true } }, // Include event date
        entryLogs: { orderBy: { scannedAt: "desc" }, take: 1, select: { type: true } },
        members: {
          select: {
            id: true, name: true,
            entryLogs: { orderBy: { scannedAt: "desc" }, take: 1, select: { type: true } }
          }
        }
      }
    });

    // 2. Fetch Concert Tickets
    const concertTickets = await prisma.concertTicket.findMany({
      select: {
        arenaCode: true,
        id: true,
        guestName: true,
        isEnterArena: true,
        isEnterMainGate: true, // <--- Add this
        tier: true,
        concert: { select: { date: true } }, // Include concert date
        entryLogs: { orderBy: { scannedAt: "desc" }, take: 1, select: { type: true } }
      }
    });

    ticketCache.clear();

    // 3. Load Teams into Cache
    teams.forEach(t => {
      if (t.ticketCode) {
        const membersWithStatus = t.members.map(m => ({
          id: m.id,
          name: m.name,
          status: m.entryLogs[0]?.type || 'EXIT'
        }));

        ticketCache.set(t.ticketCode, {
          type: 'TEAM',
          id: t.id,
          name: t.teamName,
          payment: t.paymentStatus,
          eventDate: t.event?.eventDate, // Store event date
          lastStatus: t.entryLogs[0]?.type || "EXIT",
          members: membersWithStatus // Store member list with status
        });
      }
    });

    // 4. Load Concert Tickets into Cache
    concertTickets.forEach(t => {
      if (t.arenaCode) {
        ticketCache.set(t.arenaCode, {
          type: 'CONCERT',
          id: t.id,
          name: t.guestName,
          isEnterArena: t.isEnterArena,
          isEnterMainGate: t.isEnterMainGate, // <--- Store in cache
          tier: t.tier,
          concertDate: t.concert?.date, // Add concert date
          lastStatus: t.entryLogs[0]?.type || "EXIT", // Add last status
        });
      }
    });

    cacheReady = true;
    console.log(`⚡ Cache Ready: ${ticketCache.size} tickets in ${Date.now() - start}ms`);
  } catch (err) {
    console.error("❌ Cache hydration failed:", err);
  }
}

export async function updateTeamInCache(teamId) {
    try {
        const t = await prisma.team.findUnique({
            where: { id: teamId },
            select: {
                ticketCode: true, id: true, teamName: true, paymentStatus: true,
                event: { select: { eventDate: true } }, // Include event date
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
              status: m.entryLogs[0]?.type || 'EXIT'
            }));

            ticketCache.set(t.ticketCode, {
                type: 'TEAM',
                id: t.id,
                name: t.teamName,
                payment: t.paymentStatus,
                eventDate: t.event?.eventDate, // Store event date
                lastStatus: t.entryLogs[0]?.type || "EXIT",
                members: membersWithStatus
            });
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
            ticketCache.set(t.arenaCode, {
                type: 'CONCERT',
                id: t.id,
                name: t.guestName,
                isEnterArena: t.isEnterArena,
                isEnterMainGate: t.isEnterMainGate, // <--- Added here
                tier: t.tier,
                concertDate: t.concert?.date, // Add concert date
                lastStatus: t.entryLogs[0]?.type || "EXIT",
            });
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
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // IMMEDIATE HANDSHAKE: Tell the client if we are ready or warming up
  socket.emit("SYSTEM_STATUS", { 
    isReady: cacheReady 
  });
  socket.on("VERIFY_SCAN", async (data) => {
    if (!cacheReady) {
      return socket.emit("SCAN_ERROR", { error: "System warming up, try again" });
    }

    const { ticketCode, scannerId } = data;
    const ticket = ticketCache.get(ticketCode);

    if (!ticket) {
      return socket.emit("SCAN_ERROR", { error: "Ticket Not Found" });
    }

    // --- 1. DATE VALIDATION ---
    const today = new Date().toDateString();
    let ticketDate = null;

    if (ticket.type === 'TEAM' && ticket.eventDate) {
      ticketDate = new Date(ticket.eventDate).toDateString();
    } else if (ticket.type === 'CONCERT' && ticket.concertDate) {
      ticketDate = new Date(ticket.concertDate).toDateString();
    }

    // if (ticketDate && ticketDate !== today) {
    //   return socket.emit("SCAN_ERROR", { error: "Ticket not valid for today" });
    // }

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
            members: ticket.members
          });
        } else if (ticket.type === 'CONCERT') {
          
          // Check specifically for Main Gate entry
          if (ticket.isEnterMainGate) {
            return socket.emit("SCAN_ERROR", { error: "Pass Already Used at Main Gate" });
          }
  
          // Update cache & DB for Main Gate
          ticket.isEnterMainGate = true;
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
    const teamTicket = [...ticketCache.values()].find(t => t.id === teamId && t.type === 'TEAM');

    if (!teamTicket) {
      return socket.emit("SCAN_ERROR", { error: "Team not found in cache" });
    }

    const member = teamTicket.members.find(m => m.id === memberId);

    if (!member) {
      // This should ideally not happen if the frontend sends correct data
      return socket.emit("SCAN_ERROR", { error: "Member not found in team" });
    }

    // Determine next action and update cache
    const currentStatus = member.status || 'EXIT';
    const nextAction = currentStatus === 'ENTRY' ? 'EXIT' : 'ENTRY';
    member.status = nextAction; // Update status in the cached object

    // Log the event to the database
    prisma.entryLog.create({
      data: {
        teamId: teamTicket.id,
        memberId: memberId, // <<< Critically, log the specific member
        scannerId: scannerId || "MAIN_GATE_MEMBER_LOG",
        type: nextAction,
        dayNumber: 1, // Assuming day 1, this could be dynamic
      }
    }).catch(console.error); // Log errors silently on the server

    // Notify the frontend of success
    socket.emit("MEMBER_LOG_SUCCESS", {
      action: nextAction,
      memberName: memberName,
      teamName: teamTicket.name,
      message: `${memberName} from ${teamTicket.name} logged for ${nextAction}.`
    });

    // Also, broadcast the updated team details so all scanners are aware
    io.emit("TEAM_MEMBERS_UPDATED", {
      teamId: teamTicket.id,
      members: teamTicket.members,
    });
  });
});

// 3. REST ROUTES

app.use('/api/register', registrationRoutes);
app.use('/api/judge', judgingRoutes);
app.use('/api/scan', scanningRoutes); // Keep for history/manual lookups
app.use('/api/admin', adminRoutes);
app.use('/api/meta', metaRoutes);

app.use('/api/concert', concertRoutes);

app.use('/api/user', userRoutes);
// app.use('/api' , emailRoutes);

app.use(errorHandler);


// 4. START SERVER


hydrateCache().then(() => {
  console.log("✅ Hydration Finished");
  notifySystemReady(); // <--- Notify all connected clients
});

const PORT = process.env.PORT || 5000;
// CRITICAL: Use httpServer.listen, NOT app.listen
httpServer.listen(PORT, () => {
  console.log(`🚀 Unified Real-time Backend running on port ${PORT}`);
});