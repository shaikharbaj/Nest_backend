/*
  Warnings:

  - Added the required column `createdBy` to the `attributes_unit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "attributes_Id" INTEGER,
ADD COLUMN     "attributesunit_Id" INTEGER,
ADD COLUMN     "attributesvalue_Id" INTEGER;

-- AlterTable
ALTER TABLE "attributes_unit" ADD COLUMN     "createdBy" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_attributesunit_Id_fkey" FOREIGN KEY ("attributesunit_Id") REFERENCES "attributes_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_attributes_Id_fkey" FOREIGN KEY ("attributes_Id") REFERENCES "attributes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_attributesvalue_Id_fkey" FOREIGN KEY ("attributesvalue_Id") REFERENCES "attribute_value"("id") ON DELETE SET NULL ON UPDATE CASCADE;
