-- CreateTable
CREATE TABLE "LevelReward" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level1Count" INTEGER NOT NULL DEFAULT 0,
    "level2Count" INTEGER NOT NULL DEFAULT 0,
    "level3Count" INTEGER NOT NULL DEFAULT 0,
    "level4Count" INTEGER NOT NULL DEFAULT 0,
    "level5Count" INTEGER NOT NULL DEFAULT 0,
    "level6Count" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LevelReward_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LevelReward_userId_key" ON "LevelReward"("userId");

-- AddForeignKey
ALTER TABLE "LevelReward" ADD CONSTRAINT "LevelReward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
