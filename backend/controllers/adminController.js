import { prisma } from '../db.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { ticketCache } from '../index.js';
import { v4 as uuidv4 } from "uuid";
import { google } from "googleapis";
import path from "path";
import { customAlphabet } from 'nanoid';



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
      process.env.JWT_ADMIN_SECRET,
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

// --- 1. EVENT MANAGEMENT ---

/**
 * CREATE EVENT
 */
export const createEvent = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      minPlayers,
      maxPlayers,
      allowOutside,
      eventPrice,
      eventDate,
      dateLabel,
      guidelines,
      registrationOpen,
    } = req.body;

    const event = await prisma.event.create({
      data: {
        name,
        description,
        category,

        minPlayers: Number(minPlayers),
        maxPlayers: Number(maxPlayers),

        allowOutside: Boolean(allowOutside),
        eventPrice: eventPrice ?? "0",

        eventDate: eventDate ? new Date(eventDate) : null,
        dateLabel: dateLabel || null,

        guidelines: Array.isArray(guidelines) ? guidelines : [],

        registrationOpen:
          typeof registrationOpen === "boolean"
            ? registrationOpen
            : true,
      },
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("Create Event Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET EVENTS (CATEGORIZED)
 */
export const getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
    });

    const categorized = {
      PANACHE: { internal: [], outside: [] },
      PRATISHTHA: { internal: [], outside: [] },
      PRAGATI: { internal: [], outside: [] },
    };

    events.forEach(event => {
      if (!categorized[event.category]) return;

      if (event.allowOutside) {
        categorized[event.category].outside.push(event);
      } else {
        categorized[event.category].internal.push(event);
      }
    });

    res.json(categorized);
  } catch (error) {
    console.error("Get Events Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * UPDATE EVENT
 */
export const updateEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const {
      name,
      description,
      category,
      minPlayers,
      maxPlayers,
      allowOutside,
      eventPrice,
      eventDate,
      dateLabel,
      guidelines,
      registrationOpen,
    } = req.body;

    const event = await prisma.event.update({
      where: { id: eventId },
      data: {
        name,
        description,
        category,

        minPlayers: Number(minPlayers),
        maxPlayers: Number(maxPlayers),

        allowOutside: Boolean(allowOutside),
        eventPrice: eventPrice ?? "0",

        eventDate: eventDate ? new Date(eventDate) : null,
        dateLabel: dateLabel || null,

        guidelines: Array.isArray(guidelines) ? guidelines : [],

        registrationOpen:
          typeof registrationOpen === "boolean"
            ? registrationOpen
            : true,
      },
    });

    res.json(event);
  } catch (error) {
    console.error("Update Event Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * DELETE EVENT
 */
export const deleteEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    await prisma.$transaction(async (tx) => {
      // 1️⃣ Delete members of teams in this event
      await tx.member.deleteMany({
        where: {
          team: {
            eventId: eventId,
          },
        },
      });

      // 2️⃣ Delete teams of this event
      await tx.team.deleteMany({
        where: { eventId },
      });

      // 3️⃣ Delete event invites
      await tx.eventInvite.deleteMany({
        where: { eventId },
      });

      // 4️⃣ Finally delete the event
      await tx.event.delete({
        where: { id: eventId },
      });
    });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete Event Error:", error);
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
    // =========================
    // 1️⃣ FETCH ALL EVENTS
    // =========================
    const events = await prisma.event.findMany({
      select: {
        id: true,
        name: true,
        allowOutside: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // =========================
    // 2️⃣ FETCH TEAMS (FILTERED)
    // =========================
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
        department: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // =========================
    // 📊 DASHBOARD STATS
    // =========================

    const totalRegistrations = teams.length;

    let inCollege = 0;
    let outCollege = 0;

    const departmentStats = {};
    const paymentAnalytics = {
      APPROVED: 0,
      PENDING: 0,
      REJECTED: 0,
    };

    // =========================
    // 3️⃣ INIT EVENT STATS (ALL EVENTS)
    // =========================
    const eventStats = {};

    events.forEach((e) => {
      eventStats[e.id] = {
        id: e.id,
        name: e.name,
        allowOutside: e.allowOutside,
        teams: [], // 👈 empty by default
      };
    });

    // =========================
    // 4️⃣ MAP TEAMS INTO EVENTS
    // =========================
    teams.forEach((t) => {
      // College split (FIXED)
      if (t.college?.isInternal) inCollege++;
      else outCollege++;

      // Event-wise teams
      if (eventStats[t.eventId]) {
        eventStats[t.eventId].teams.push({
          id: t.id,
          teamName: t.teamName,
          college: t.college?.name || null,
          paymentStatus: t.paymentStatus,
        });
      }

      // Department-wise
      const dept = t.department?.name || "Unknown";
      departmentStats[dept] = (departmentStats[dept] || 0) + 1;

      // Payment analytics
      paymentAnalytics[t.paymentStatus]++;
    });

    // =========================
    // 5️⃣ FINAL RESPONSE
    // =========================
    res.json({
      teams,
      stats: {
        totalRegistrations,
        inCollege,
        outCollege,
        totalEvents: events.length, // ✅ ALL EVENTS COUNT
        departmentStats,
        paymentAnalytics,
        eventStats: Object.values(eventStats), // ✅ includes empty events
      },
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);
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

export const generateInviteCodes = async (req, res) => {
  const { eventId, count } = req.body;

  // Validation
  if (!eventId || !count) {
    return res.status(400).json({
      error: "eventId and count are required",
    });
  }

  try {
    const invites = [];

  for (let i = 0; i < count; i++) {
  const code = `EXT-${customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)()}`;

  invites.push({
    code,
    eventId,
  });
}


    await prisma.eventInvite.createMany({
      data: invites,
      skipDuplicates: true,
    });

    return res.json({
      message: "Invite codes generated successfully",
      eventId,
      totalGenerated: invites.length,
      codes: invites.map(i => i.code),
    });
  } catch (error) {
    console.error("Invite generation failed:", error);
    return res.status(500).json({
      error: "Failed to generate invite codes",
    });
  }
};




// See all codes to find an unused one to give to a student
export const getAvailableCodes = async (req, res) => {
  const { eventId } = req.params;

  try {
    const codes = await prisma.eventInvite.findMany({
      where: { eventId }, // returns BOTH used & unused
      select: {
        code: true,
        isUsed: true,
        usedByTeam: {
          select: {
            id: true,
            teamName: true,
            paymentStatus: true,
            college: {
              select: { name: true },
            },
            department: {
              select: { name: true },
            },
            members: {
              select: {
                name: true,
                phone: true,
                isLeader: true,
              },
            },
          },
        },
      },
      // ❌ orderBy removed as requested
    });

    res.json(codes);
  } catch (error) {
    console.error("getAvailableCodes error:", error);
    res.status(500).json({ error: error.message });
  }
};


export const deleteInviteCode = async (req, res) => {
  const { code } = req.params;

  try {
    await prisma.eventInvite.delete({
      where: { code },
    });

    res.json({ message: "Invite code deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const syncEventSheet = async (req, res) => {
  const { id } = req.params;

  try {
    /* ================= 1. FETCH EVENT & INVITES ================= */
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        invites: {
          orderBy: { id: "desc" },
          include: {
            usedByTeam: {
              include: {
                college: true,
                department: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    /* ================= 2. GOOGLE AUTH (FROM .ENV) ================= */
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: "service_account",
        project_id: process.env.GOOGLE_PROJECT_ID,
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    /* ================= 3. SPREADSHEET ID ================= */
    const spreadsheetId =
      event.spreadsheetId || process.env.GOOGLE_SHEET_ID_INVITES;

    if (!spreadsheetId) {
      return res.status(400).json({ error: "No Spreadsheet ID configured" });
    }

    /* ================= 4. SANITIZE TAB NAME ================= */
    const tabName = event.name
      .replace(/[\/\\\?\*\[\]\:]/g, "")
      .substring(0, 30);

    /* ================= 5. CHECK / CREATE TAB ================= */
    const docMetadata = await sheets.spreadsheets.get({ spreadsheetId });

    let targetSheet = docMetadata.data.sheets.find(
      (s) => s.properties.title.toLowerCase() === tabName.toLowerCase()
    );

    let sheetId;

    if (!targetSheet) {
      const createResponse = await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
          requests: [{ addSheet: { properties: { title: tabName } } }],
        },
      });

      sheetId =
        createResponse.data.replies[0].addSheet.properties.sheetId;
    } else {
      sheetId = targetSheet.properties.sheetId;
    }

    /* ================= 6. PREPARE DATA ================= */
    const syncTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    const rows = [
      ["PANACHE 2026"],
      [event.name.toUpperCase()],
      [`Last Synced: ${syncTime}`, `Total Codes: ${event.invites.length}`],
      [],
      [
        "Invite Code",
        "Status",
        "Team Name",
        "College / Institute",
        "Department",
        "Payment Status",
        "Assigned Logs",
        "Invite Link",
      ],
    ];

    event.invites.forEach((invite) => {
      const team = invite.usedByTeam;
      const inviteLink = `https://panache-16.vercel.app/register/${event.id}?secretCode=${invite.code}`;

      rows.push([
        invite.code,
        invite.isUsed ? "USED" : "AVAILABLE",
        team?.teamName || "-",
        team?.college?.name || "-",
        team?.department?.name || "External",
        team?.paymentStatus || "-",
        team ? "See Logs" : "-",
        inviteLink,
      ]);
    });

    /* ================= 6.5 CLEAR OLD DATA ================= */
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: `'${tabName}'!A:Z`,
    });

    /* ================= 7. WRITE DATA ================= */
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `'${tabName}'!A1`,
      valueInputOption: "USER_ENTERED",
      resource: { values: rows },
    });

    /* ================= 8. FORMATTING ================= */
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests: [
          {
            updateDimensionProperties: {
              range: {
                sheetId,
                dimension: "COLUMNS",
                startIndex: 0,
                endIndex: 1,
              },
              properties: { pixelSize: 140 },
              fields: "pixelSize",
            },
          },
          {
            repeatCell: {
              range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.8, green: 0, blue: 0 },
                  textFormat: {
                    foregroundColor: { red: 1, green: 1, blue: 1 },
                    bold: true,
                    fontSize: 16,
                  },
                  horizontalAlignment: "CENTER",
                },
              },
              fields:
                "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
            },
          },
          {
            repeatCell: {
              range: { sheetId, startRowIndex: 1, endRowIndex: 2 },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.95, green: 0.95, blue: 0.95 },
                  textFormat: { bold: true, fontSize: 13 },
                  horizontalAlignment: "CENTER",
                },
              },
              fields:
                "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
            },
          },
          {
            mergeCells: {
              range: {
                sheetId,
                startRowIndex: 0,
                endRowIndex: 2,
                startColumnIndex: 0,
                endColumnIndex: 8,
              },
              mergeType: "MERGE_ALL",
            },
          },
          {
            repeatCell: {
              range: { sheetId, startRowIndex: 4, endRowIndex: 5 },
              cell: {
                userEnteredFormat: { textFormat: { bold: true } },
              },
              fields: "userEnteredFormat(textFormat)",
            },
          },
        ],
      },
    });

    res.json({
      message: `Synced successfully to Google Sheet tab: ${tabName}`,
    });
  } catch (error) {
    console.error("Sheet Sync Error:", error);
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
