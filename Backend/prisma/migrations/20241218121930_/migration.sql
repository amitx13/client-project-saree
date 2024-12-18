/*
  Warnings:

  - Added the required column `reqMembers` to the `Reward` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reward" ADD COLUMN     "reqMembers" INTEGER NOT NULL;
