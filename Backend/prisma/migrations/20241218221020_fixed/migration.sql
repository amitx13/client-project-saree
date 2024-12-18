/*
  Warnings:

  - A unique constraint covering the columns `[userId,rewardId]` on the table `UserReward` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserReward_userId_rewardId_key" ON "UserReward"("userId", "rewardId");
