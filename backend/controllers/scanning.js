import { prisma } from '../db.js';
import { io, ticketCache } from '../index.js'; 

const getDayNumber = () => {
  const now = new Date();
  const eventStartDate = new Date('2026-02-01T00:00:00.000Z');
  const diff = now.getTime() - eventStartDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
};

// --- SEARCH TICKET ---
export const searchTicket = async (req, res) => {
  const { ticketCode } = req.body;

  if (!ticketCode) return res.status(400).json({ error: 'Ticket code is required' });

  try {
    // 1. Database Search (Event Team)
    const team = await prisma.team.findUnique({
      where: { ticketCode },
      include: {
        event: true,
        members: {
          include: { entryLogs: { orderBy: { scannedAt: 'desc' }, take: 1 } },
        },
      },
    });

    if (team) {
      const isAnyMemberIn = team.members.some(
        (member) => member.entryLogs[0]?.type === 'ENTRY'
      );
      return res.json({ type: 'event', details: { ...team, status: isAnyMemberIn ? 'IN' : 'OUT' } });
    }

    // 2. Database Search (Concert Ticket)
    const concertTicket = await prisma.concertTicket.findUnique({
      where: { arenaCode: ticketCode },
      include: {
        concert: true,
        entryLogs: { orderBy: { scannedAt: 'desc' }, take: 1 }
      }
    });

    if (concertTicket) {
      const lastLog = concertTicket.entryLogs[0];
      const status = lastLog && lastLog.type === 'ENTRY' ? 'IN' : 'OUT';
      return res.json({ type: 'concert', details: { ...concertTicket, status } });
    }

    return res.status(404).json({ error: 'Ticket not found' });

  } catch (error) {
    console.error('Error searching for ticket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// --- MARK EVENT ENTRY ---
export const markEventEntry = async (req, res) => {
  const { teamId, memberId, scannerId } = req.body;

  if (!teamId || !memberId || !scannerId) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const dayNumber = getDayNumber();

    // 1. DB LOOKUP
    const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: { event: true } // Fetches ticketCode implicitly
    });

    if (!team) return res.status(404).json({ error: 'Team not found' });

    // Date Check
    const eventDate = new Date(team.event.eventDate);
    const today = new Date();
    if (eventDate.toDateString() !== today.toDateString()) {
        return res.status(403).json({ error: 'Entry only allowed on event day' });
    }

    // Duplicate Entry Check
    const lastLog = await prisma.entryLog.findFirst({
        where: { memberId, teamId },
        orderBy: { scannedAt: 'desc' },
    });

    if (lastLog && lastLog.type === 'ENTRY') {
        return res.status(409).json({ error: 'Member is already marked as IN' });
    }

    // 2. DB WRITE
    const entry = await prisma.entryLog.create({
      data: { teamId, memberId, scannerId, dayNumber, type: 'ENTRY' },
    });

    // 3. CACHE UPDATE & SOCKET EMIT (Optimized)
    // We use team.ticketCode from the DB result to find the cache entry O(1)
    if (team.ticketCode) {
        const teamTicket = ticketCache.get(team.ticketCode);
        
        if (teamTicket) {
            const member = teamTicket.members.find(m => m.id === memberId);
            if (member) member.status = 'ENTRY';

            // // Broadcast update to all scanners
            // io.emit("TEAM_MEMBERS_UPDATED", {
            //     teamId: teamTicket.id,
            //     members: teamTicket.members,
            //     triggeredBy: scannerId
            // });
        }
    }

    res.status(201).json(entry);
  } catch (error) {
    console.error('Error marking event entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// --- MARK EVENT EXIT ---
export const markEventExit = async (req, res) => {
    const { teamId, memberId, scannerId } = req.body;

    if (!teamId || !memberId || !scannerId) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    try {
        const dayNumber = getDayNumber();

        // 1. DB LOOKUP
        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: { event: true }
        });

        if (!team) return res.status(404).json({ error: 'Team not found' });

        const eventDate = new Date(team.event.eventDate);
        const today = new Date();
        if (eventDate.toDateString() !== today.toDateString()) {
            return res.status(403).json({ error: 'Exit only allowed on event day' });
        }

        const lastLog = await prisma.entryLog.findFirst({
            where: { memberId, teamId },
            orderBy: { scannedAt: 'desc' },
        });

        if (!lastLog) return res.status(409).json({ error: 'Member has not entered yet.' });
        if (lastLog.type === 'EXIT') return res.status(409).json({ error: 'Member is already OUT' });

        // 2. DB WRITE
        const exit = await prisma.entryLog.create({
            data: { teamId, memberId, scannerId, dayNumber, type: 'EXIT' },
        });

        // 3. CACHE UPDATE & SOCKET EMIT (Optimized)
        if (team.ticketCode) {
            const teamTicket = ticketCache.get(team.ticketCode);
            
            if (teamTicket) {
                const member = teamTicket.members.find(m => m.id === memberId);
                if (member) member.status = 'EXIT';

                // io.emit("TEAM_MEMBERS_UPDATED", {
                //     teamId: teamTicket.id,
                //     members: teamTicket.members,
                //     triggeredBy: scannerId
                // });
            }
        }

        res.status(201).json(exit);
    } catch (error) {
        console.error('Error marking event exit:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// --- MARK CONCERT ENTRY ---
export const markConcertEntry = async (req, res) => {
    const { concertTicketId, scannerId } = req.body;

    if (!concertTicketId || !scannerId) {
        return res.status(400).json({ error: 'concertTicketId and scannerId are required' });
    }

    try {
        const dayNumber = getDayNumber();

        // 1. DB LOOKUP
        const concertTicket = await prisma.concertTicket.findUnique({
            where: { id: concertTicketId },
            include: { concert: true }
        });

        if (!concertTicket) return res.status(404).json({ error: 'Concert ticket not found' });
        
        const concertDate = new Date(concertTicket.concert.date);
        const today = new Date();
        concertDate.setHours(0,0,0,0);
        today.setHours(0,0,0,0);

        if (concertDate.getTime() !== today.getTime()) {
             return res.status(403).json({ error: 'Entry only allowed on event day' });
        }

        // Logic based on Scanner ID
        const updateData = {};
        if (scannerId === 'MAIN_GATE') {
            if (concertTicket.isEnterMainGate) return res.status(409).json({ error: 'Already entered Main Gate' });
            updateData.isEnterMainGate = true;
        } 
        else if (scannerId === 'CELEBRITY_GATE') {
            if (concertTicket.isEnterArena) return res.status(409).json({ error: 'Already entered Arena' });
            updateData.isEnterArena = true;
        }
        else {
             return res.status(400).json({ error: 'Invalid Scanner ID' });
        }
        
        // 2. DB WRITE
        await prisma.concertTicket.update({
            where: { id: concertTicketId },
            data: updateData,
        });

        const entry = await prisma.entryLog.create({
            data: { concertTicketId, scannerId, dayNumber, type: 'ENTRY' },
        });

        // 3. CACHE UPDATE & SOCKET EMIT
        if (concertTicket.arenaCode) {
            const cachedTicket = ticketCache.get(concertTicket.arenaCode); 
            if (cachedTicket) {
                if (scannerId === 'MAIN_GATE') cachedTicket.isEnterMainGate = true;
                if (scannerId === 'CELEBRITY_GATE') cachedTicket.isEnterArena = true;
                cachedTicket.lastStatus = 'ENTRY';
            }
        }
        
        // This emit was missing in your snippet, added back for completeness
        // io.emit("SCAN_SUCCESS", {
        //     action: "ENTRY",
        //     teamName: concertTicket.guestName,
        //     message: `${concertTicket.tier} - ${scannerId}`,
        //     timestamp: new Date()
        // });

        res.status(201).json({ message: 'Entry marked successfully', entry });
    } catch (error) {
        console.error('Error marking concert entry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};