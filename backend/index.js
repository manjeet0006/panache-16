import express from 'express';
import { createServer } from 'http'; // Required for WebSockets
import { Server } from 'socket.io';   // Required for WebSockets
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './db.js'; 


import adminRoutes from './routes/adminRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import judgingRoutes from './routes/judgingRoutes.js';
import scanningRoutes from './routes/scanningRoutes.js';
import metaRoutes from './routes/meta.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const httpServer = createServer(app); // Wrap express app

// 1. Configure CORS & Socket.io
const allowedOrigins = ['http://localhost:5173'];

const io = new Server(httpServer, {
  cors: {
    // 2. Be very specific with the origin. Do not use trailing slashes.
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
  // 3. Force these transports to avoid the 15-second "polling" timeout
  transports: ['websocket', 'polling']
});

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// In-memory cache
export const ticketCache = new Map();

// Readiness flag
let cacheReady = false;

// Hydrate cache on server start
export async function hydrateCache() {
  try {
    const teams = await prisma.team.findMany({
      select: {
        ticketCode: true,
        id: true,
        teamName: true,
        paymentStatus: true,
        entryLogs: {
          orderBy: { scannedAt: "desc" },
          take: 1,
          select: { type: true }
        }
      }
    });

    ticketCache.clear();

    teams.forEach(t => {
      if (t.ticketCode) {
        ticketCache.set(t.ticketCode, {
          id: t.id,
          name: t.teamName,
          payment: t.paymentStatus, // APPROVED / PENDING / REJECTED
          lastStatus: t.entryLogs[0]?.type || "EXIT"
        });
      }
    });

    cacheReady = true;
    console.log(`⚡ Cache Ready: ${ticketCache.size} teams loaded`);
  } catch (err) {
    console.error("❌ Cache hydration failed:", err);
  }
}

await hydrateCache();

// 3. Socket Logic
io.on("connection", (socket) => {
  socket.on("VERIFY_SCAN", async (data) => {
    if (!cacheReady) {
      return socket.emit("SCAN_ERROR", {
        error: "System warming up, try again"
      });
    }

    const { ticketCode, scannerId } = data;
    const start = Date.now();

    //  O(1) lookup
    const team = ticketCache.get(ticketCode);

    // Ticket existence
    if (!team) {
      return socket.emit("SCAN_ERROR", {
        error: "Ticket Not Found"
      });
    }

    // Payment validation
    if (team.payment !== "APPROVED") {
      return socket.emit("SCAN_ERROR", {
        error: "Payment Required",
        status: team.payment
      });
    }

    // ENTRY / EXIT toggle
    const nextAction =
      team.lastStatus === "ENTRY" ? "EXIT" : "ENTRY";

    // Update cache immediately (anti double-scan)
    team.lastStatus = nextAction;

    // Instant response (FAST)
    socket.emit("SCAN_SUCCESS", {
      action: nextAction,
      teamName: team.name,
      teamId: team.id,
      paymentStatus: team.payment,
      perf: `${Date.now() - start}ms`
    });

    // Async DB log (non-blocking)
    prisma.entryLog
      .create({
        data: {
          teamId: team.id,
          scannerId: scannerId || "GATE_01",
          type: nextAction,
          dayNumber: 1
        }
      })
      .catch(err =>
        console.error("❌ EntryLog sync failed:", err)
      );
  });
});

// 3. REST ROUTES 

app.use('/api/register', registrationRoutes);
app.use('/api/judge', judgingRoutes);
app.use('/api/scan', scanningRoutes); // Keep for history/manual lookups
app.use('/api/admin', adminRoutes);
app.use('/api/meta', metaRoutes);

app.use(errorHandler);


// 4. START SERVER

const PORT = process.env.PORT || 5000;
// CRITICAL: Use httpServer.listen, NOT app.listen
httpServer.listen(PORT, () => {
  console.log(`🚀 Unified Real-time Backend running on port ${PORT}`);
});