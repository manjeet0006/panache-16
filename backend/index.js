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
  "https://panache-16.vercel.app"
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
        entryLogs: { orderBy: { scannedAt: "desc" }, take: 1, select: { type: true } },
        members: { select: { id: true, name: true } }
      }
    });

    // 2. Fetch Concert Tickets
    const concertTickets = await prisma.concertTicket.findMany({
      select: {
        arenaCode: true,
        id: true,
        guestName: true,
        isEnterArena: true,
        tier: true
      }
    });

    ticketCache.clear();

    // 3. Load Teams into Cache
    teams.forEach(t => {
      if (t.ticketCode) {
        ticketCache.set(t.ticketCode, {
          type: 'TEAM',
          id: t.id,
          name: t.teamName,
          payment: t.paymentStatus,
          lastStatus: t.entryLogs[0]?.type || "EXIT",
          members: t.members // Store member list
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
          tier: t.tier
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
                entryLogs: { orderBy: { scannedAt: "desc" }, take: 1, select: { type: true } },
                members: { select: { id: true, name: true } }
            }
        });

        if (t && t.ticketCode) {
            ticketCache.set(t.ticketCode, {
                type: 'TEAM',
                id: t.id,
                name: t.teamName,
                payment: t.paymentStatus,
                lastStatus: t.entryLogs[0]?.type || "EXIT",
                members: t.members
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
            select: { arenaCode: true, id: true, guestName: true, isEnterArena: true, tier: true }
        });

        if (t && t.arenaCode) {
            ticketCache.set(t.arenaCode, {
                type: 'CONCERT',
                id: t.id,
                name: t.guestName,
                isEnterArena: t.isEnterArena,
                tier: t.tier
            });
            console.log(`✅ CONCERT CACHE UPDATED: ${t.guestName}`);
        }
    } catch (err) {
        console.error(`❌ Failed to update concert ticket cache for ID ${ticketId}:`, err);
    }
}

await hydrateCache();

// 3. Socket Logic
io.on("connection", (socket) => {
  socket.on("VERIFY_SCAN", async (data) => {
    if (!cacheReady) {
      return socket.emit("SCAN_ERROR", { error: "System warming up, try again" });
    }

    const { ticketCode, scannerId } = data;
    const ticket = ticketCache.get(ticketCode);

    if (!ticket) {
      return socket.emit("SCAN_ERROR", { error: "Ticket Not Found" });
    }

    // --- GATE-SPECIFIC LOGIC ---
    switch (scannerId) {
      case 'CELEBRITY_GATE':
        if (ticket.type !== 'CONCERT') {
          return socket.emit("SCAN_ERROR", { error: "Only Celebrity Passes Allowed Here" });
        }

        if (ticket.isEnterArena) {
          return socket.emit("SCAN_ERROR", { error: "Pass Already Used for Entry" });
        }

        // Update cache & DB
        ticket.isEnterArena = true;
        prisma.concertTicket.update({ where: { id: ticket.id }, data: { isEnterArena: true } }).catch(console.error);

        socket.emit("SCAN_SUCCESS", {
          action: "ENTRY",
          teamName: ticket.name, // Guest name
          message: `${ticket.tier} TIER`
        });
        break;

      case 'MAIN_GATE':
        if (ticket.type === 'TEAM') {
          // New flow for teams: return member list
          socket.emit("SCAN_TEAM_DETAILS", {
            teamName: ticket.name,
            teamId: ticket.id,
            members: ticket.members
          });
        } else if (ticket.type === 'CONCERT') {
          // Standard entry/exit for concert passes at main gate
          const nextAction = ticket.lastStatus === 'ENTRY' ? 'EXIT' : 'ENTRY';
          ticket.lastStatus = nextAction;

          prisma.entryLog.create({
            data: { concertTicketId: ticket.id, scannerId, type: nextAction, dayNumber: 1 }
          }).catch(console.error);

          socket.emit("SCAN_SUCCESS", {
            action: nextAction,
            teamName: ticket.name,
            message: "Concert Pass"
          });
        }
        break;

      default:
        return socket.emit("SCAN_ERROR", { error: "Invalid Scanner ID" });
    }
  });

  socket.on("LOG_MEMBER_ENTRY", async ({ teamId, memberId, memberName }) => {
    // This is a simplified version. A real-world scenario would need to
    // track individual member entry/exit status. For now, we log an event
    // for the team, but with the member's name.
    const team = [...ticketCache.values()].find(t => t.id === teamId && t.type === 'TEAM');

    if (team) {
      const nextAction = "ENTRY" // Simplified for now
      prisma.entryLog.create({
        data: {
          teamId: team.id,
          scannerId: "MAIN_GATE_MEMBER_LOG",
          type: nextAction,
          dayNumber: 1,
          // We could add a field to EntryLog like `notes` to store the member name
        }
      }).catch(console.error);

      socket.emit("MEMBER_LOG_SUCCESS", {
        message: `${memberName} from ${team.name} recorded.`
      });
    }
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

app.use(errorHandler);


// 4. START SERVER

const PORT = process.env.PORT || 5000;
// CRITICAL: Use httpServer.listen, NOT app.listen
httpServer.listen(PORT, () => {
  console.log(`🚀 Unified Real-time Backend running on port ${PORT}`);
});