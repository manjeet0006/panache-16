import { prisma } from '../db.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { ticketCache } from '../index.js';


export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    // Note: In production, use bcrypt.compare(password, admin.password)
    if (!admin || admin.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Sign the token with the ADMIN role
    const token = jwt.sign(
      { id: admin.id, role: 'ADMIN' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- 1. EVENT & DEPT MANAGEMENT ---

export const createEvent = async (req, res) => {
  try {
    const event = await prisma.event.create({ data: req.body });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    await prisma.event.delete({
      where: { id: eventId },
    });
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Department Creation

export const createDepartment = async (req, res) => {
  const { name, secretCode, collegeId } = req.body;
  try {
    const dept = await prisma.department.create({
      data: { name, secretCode, collegeId }
    });
    res.status(201).json(dept);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- 2. JUDGE MANAGEMENT ---

export const createJudgeAccount = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const judge = await prisma.judge.create({
      data: { name, email, password }
    });
    res.status(201).json({ message: "Judge created", judgeId: judge.id });
  } catch (error) {
    res.status(400).json({ error: "Email already exists" });
  }
};

export const appointJudgeToEvent = async (req, res) => {
  const { judgeId, eventId } = req.body;
  try {
    const assignment = await prisma.judgeAssignment.create({
      data: { judgeId, eventId }
    });
    res.json({ message: "Judge appointed successfully", assignment });
  } catch (error) {
    res.status(500).json({ error: "Assignment already exists" });
  }
};

// --- 3. DATA OVERVIEW & FILTERS ---

export const getAdminDashboardData = async (req, res) => {
  const { status, eventId, collegeId } = req.query;
  try {
    const teams = await prisma.team.findMany({
      where: {
        ...(status && { paymentStatus: status }),
        ...(eventId && { eventId }),
        ...(collegeId && { collegeId }),
      },
      include: {
        event: true,
        college: true,
        members: true,
        department: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- 4. DATA CORRECTION (The Power to Update) ---

export const updateTeamDetails = async (req, res) => {
  const { teamId } = req.params;
  const { teamName, members } = req.body; // members is an array of updated member objects

  try {
    // We update the team and use 'deleteMany' then 'create' to reset members list
    const updatedTeam = await prisma.$transaction([
      prisma.member.deleteMany({ where: { teamId } }),
      prisma.team.update({
        where: { id: teamId },
        data: {
          teamName,
          members: {
            create: members
          }
        },
        include: { members: true }
      })
    ]);
    res.json({ message: "Team updated by Admin", updatedTeam: updatedTeam[1] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// --- 5. OUTSIDE STUDENT INQUIRY MANAGEMENT ---

// Get all Stage 1 leads (Outsiders who don't have a code yet)
export const getInquiries = async (req, res) => {
  const { status } = req.query;
  try {
    const inquiries = await prisma.registrationRequest.findMany({
      where: status ? { status } : undefined,
      include: { event: { select: { name: true } } },
      orderBy: { createdAt: "desc" }
    });

    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update Inquiry Status (Admin Action)
export const updateInquiryStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  //  Allowed transitions
  const allowedStatuses = [
    "PENDING",
    "CALLED",
    "CODE_SENT",
    "REGISTERED",
    "REJECTED",
    "CLOSED"
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      error: "Invalid inquiry status"
    });
  }

  try {
    const updatedInquiry = await prisma.registrationRequest.update({
      where: { id },
      data: { status }
    });

    res.json({
      message: "Inquiry status updated successfully",
      inquiry: updatedInquiry
    });

  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Inquiry not found"
      });
    }

    res.status(500).json({
      error: error.message
    });
  }
};


// --- 6. SECRET CODE GENERATION ---

// Generate unique codes for external participants
export const generateSecretCodes = async (req, res) => {
  const { eventId, collegeId, count } = req.body; // ✅ ADD collegeId

  if (!collegeId) {
    return res.status(400).json({ error: "collegeId is required for external invites" });
  }

  try {
    const invites = [];

    for (let i = 0; i < count; i++) {
      const randomPart = crypto.randomBytes(2).toString('hex').toUpperCase();
      const code = `EXT-${randomPart}`;

      invites.push({
        code,
        eventId,
        collegeId, // 🔥 FIX HERE
      });
    }

    await prisma.eventInvite.createMany({
      data: invites,
      skipDuplicates: true
    });

    res.status(201).json({
      message: `${count} codes generated`,
      codes: invites.map(i => i.code)
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// See all codes to find an unused one to give to a student
export const getAvailableCodes = async (req, res) => {
  const { eventId } = req.params;
  try {
    const codes = await prisma.eventInvite.findMany({
      where: { eventId, isUsed: false },
      select: { code: true }
    });
    res.json(codes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// --- 7. LEADERBOARD & RESULTS ---

export const getEventLeaderboard = async (req, res) => {
  const { eventId } = req.params;

  try {
    const teams = await prisma.team.findMany({
      where: { eventId },
      include: {
        scores: true, // Get all judge scores for this team
        department: true,
        college: true,
      }
    });

    // Calculate average or total score for each team
    const leaderboard = teams.map(team => {
      const totalScore = team.scores.reduce((acc, s) => acc + s.totalPoints, 0);
      const averageScore = team.scores.length > 0 ? (totalScore / team.scores.length).toFixed(2) : 0;

      return {
        id: team.id,
        teamName: team.teamName,
        college: team.college.name,
        department: team.department?.name || "External",
        totalScore: parseFloat(totalScore),
        averageScore: parseFloat(averageScore),
        judgeCount: team.scores.length
      };
    }).sort((a, b) => b.totalScore - a.totalScore); // Rank highest to lowest

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// --- 8. EXPORT DATA ---

export const exportParticipantList = async (req, res) => {
  const { eventId } = req.params;

  try {
    const teams = await prisma.team.findMany({
      where: { eventId },
      include: {
        members: true,
        college: true,
        department: true
      }
    });

    // Generate CSV Header
    let csv = "Team Name,College,Department,Member Name,Phone,Email,Role\n";

    // Fill CSV Data
    teams.forEach(team => {
      team.members.forEach(member => {
        csv += `${team.teamName},${team.college.name},${team.department?.name || "External"},${member.name},${member.phone},${member.enrollment || "N/A"},${member.isLeader ? "Leader" : "Member"}\n`;
      });
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=participants_event_${eventId}.csv`);
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateRegistrationStatus = async (req, res) => {
  const { teamId } = req.params;
  const { status, reason } = req.body;

  if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
    return res.status(400).json({
      error: "Invalid status provided"
    });
  }

  try {
    // 1️⃣ Update DB (source of truth)
    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: { paymentStatus: status },
      include: {
        entryLogs: {
          orderBy: { scannedAt: "desc" },
          take: 1,
          select: { type: true }
        }
      }
    });

    // 2️⃣ Sync cache (NEVER delete)
    if (updatedTeam.ticketCode) {
      ticketCache.set(updatedTeam.ticketCode, {
        id: updatedTeam.id,
        name: updatedTeam.teamName,
        payment: updatedTeam.paymentStatus,
        lastStatus: updatedTeam.entryLogs[0]?.type || "EXIT"
      });
    }

    // 3️⃣ Response
    if (status === "REJECTED") {
      return res.json({
        message: "Payment rejected",
        reason,
        team: updatedTeam
      });
    }

    res.json({
      message: `Payment status updated to ${status}`,
      team: updatedTeam
    });

  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Team not found"
      });
    }

    res.status(500).json({
      error: error.message
    });
  }
};
