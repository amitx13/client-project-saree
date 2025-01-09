-- AlterTable
ALTER TABLE "OTP" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '2 minutes';

-- AlterTable
ALTER TABLE "RequestCodeTransactionDetails" ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false;
