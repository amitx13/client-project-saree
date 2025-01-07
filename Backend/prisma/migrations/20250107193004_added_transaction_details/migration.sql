-- AlterTable
ALTER TABLE "OTP" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '2 minutes';

-- CreateTable
CREATE TABLE "TransactionDetails" (
    "userId" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "TransactionDetails_userId_key" ON "TransactionDetails"("userId");

-- AddForeignKey
ALTER TABLE "TransactionDetails" ADD CONSTRAINT "TransactionDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
