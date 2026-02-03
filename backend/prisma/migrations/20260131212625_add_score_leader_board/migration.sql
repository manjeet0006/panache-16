-- CreateTable
CREATE TABLE "LeaderBoard" (
    "id" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "score" TEXT NOT NULL,
    "collageName" TEXT,
    "deptName" TEXT,

    CONSTRAINT "LeaderBoard_pkey" PRIMARY KEY ("id")
);
