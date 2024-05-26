-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_supplier_id_fkey";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
