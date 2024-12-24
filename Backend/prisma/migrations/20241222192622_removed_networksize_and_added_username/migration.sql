/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `networkSize` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_name_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
DROP COLUMN "networkSize",
ADD COLUMN     "Username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_Username_key" ON "User"("Username");
