// backend/controllers/meta.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getColleges = async (req, res) => {
    try {
        const colleges = await prisma.college.findMany({
          orderBy: { name: 'asc' }
        });
        res.json(colleges);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch colleges" });
    }
};

export const createCollege = async (req, res) => {
  try {
    const { name, city, isInternal } = req.body;

    if (!name || !city) {
      return res.status(400).json({
        error: "Name and city are required",
      });
    }

    const college = await prisma.college.create({
      data: {
        name,
        city,
        isInternal: Boolean(isInternal),
      },
    });

    res.status(201).json(college);
  } catch (error) {
    console.error("Create College Error:", error);
    res.status(500).json({ error: "Failed to create college" });
  }
};

/* ================= UPDATE COLLEGE ================= */
export const updateCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, city, isInternal } = req.body;

    const college = await prisma.college.update({
      where: { id },
      data: { name, city, isInternal },
    });

    res.json(college);
  } catch (error) {
    console.error("Update College Error:", error);
    res.status(500).json({ error: "Failed to update college" });
  }
};

/* ================= DELETE COLLEGE ================= */
export const deleteCollege = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.college.delete({
      where: { id },
    });

    res.json({ message: "College deleted successfully" });
  } catch (error) {
    console.error("Delete College Error:", error);
    res.status(500).json({ error: "Failed to delete college" });
  }
};


export const getDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        college: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch departments" });
  }
};


// departmentController.js
export const deleteDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.$transaction(async (tx) => {
      // 1️⃣ Delete Entry Logs
      await tx.entryLog.deleteMany({
        where: {
          team: {
            departmentId: id,
          },
        },
      });

      // 2️⃣ Delete Scores
      await tx.score.deleteMany({
        where: {
          team: {
            departmentId: id,
          },
        },
      });

      // 3️⃣ Delete Members
      await tx.member.deleteMany({
        where: {
          team: {
            departmentId: id,
          },
        },
      });

      // 4️⃣ Delete Teams
      await tx.team.deleteMany({
        where: {
          departmentId: id,
        },
      });

      // 5️⃣ Delete Department
      await tx.department.delete({
        where: { id },
      });
    });

    res.json({
      message: "Department and all related data deleted successfully",
    });
  } catch (error) {
    console.error("Delete Department Error:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Department not found" });
    }

    res.status(500).json({ error: error.message });
  }
};
