-- AlterTable
ALTER TABLE "OTP" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '2 minutes';

-- CreateTable
CREATE TABLE "ReferalTree" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level1" JSONB,
    "level2" JSONB,
    "level3" JSONB,
    "level4" JSONB,
    "level5" JSONB,
    "level6" JSONB,

    CONSTRAINT "ReferalTree_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReferalTree_userId_key" ON "ReferalTree"("userId");

-- AddForeignKey
ALTER TABLE "ReferalTree" ADD CONSTRAINT "ReferalTree_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
