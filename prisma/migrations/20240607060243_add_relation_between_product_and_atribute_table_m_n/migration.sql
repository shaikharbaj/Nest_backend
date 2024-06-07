/*
  Warnings:

  - You are about to drop the column `attributes_Id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `attributesunit_Id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `attributesvalue_Id` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_attributes_Id_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_attributesunit_Id_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_attributesvalue_Id_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "attributes_Id",
DROP COLUMN "attributesunit_Id",
DROP COLUMN "attributesvalue_Id";

-- CreateTable
CREATE TABLE "ProductAttributes" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "attribute_id" INTEGER NOT NULL,
    "attributeValue_id" INTEGER NOT NULL,

    CONSTRAINT "ProductAttributes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductAttributes_product_id_attribute_id_attributeValue_id_key" ON "ProductAttributes"("product_id", "attribute_id", "attributeValue_id");

-- AddForeignKey
ALTER TABLE "ProductAttributes" ADD CONSTRAINT "ProductAttributes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttributes" ADD CONSTRAINT "ProductAttributes_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttributes" ADD CONSTRAINT "ProductAttributes_attributeValue_id_fkey" FOREIGN KEY ("attributeValue_id") REFERENCES "attribute_value"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
