-- AlterTable
ALTER TABLE "OTP" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '2 minutes';

-- CreateTable
CREATE TABLE "RequestCodeTransactionDetails" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "transactionId" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "RequestCodeTransactionDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RequestCodeTransactionDetails" ADD CONSTRAINT "RequestCodeTransactionDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
