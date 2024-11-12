-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_sareeId_fkey";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_sareeId_fkey" FOREIGN KEY ("sareeId") REFERENCES "Saree"("id") ON DELETE CASCADE ON UPDATE CASCADE;
