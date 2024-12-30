/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `ActivationCode` table. All the data in the column will be lost.
  - Added the required column `ownerUserID` to the `ActivationCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActivationCode" DROP COLUMN "expiresAt",
ADD COLUMN     "ownerUserID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OTP" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '2 minutes';

-- AddForeignKey
ALTER TABLE "ActivationCode" ADD CONSTRAINT "ActivationCode_ownerUserID_fkey" FOREIGN KEY ("ownerUserID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
