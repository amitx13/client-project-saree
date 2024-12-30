-- AlterTable
ALTER TABLE "ActivationCode" ALTER COLUMN "ownerUserID" SET DEFAULT 'JD00001';

-- AlterTable
ALTER TABLE "OTP" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '2 minutes';
