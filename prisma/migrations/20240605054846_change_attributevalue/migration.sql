/*
  Warnings:

  - A unique constraint covering the columns `[attributeunit_id]` on the table `attribute_value` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `attributeunit_id` to the `attribute_value` table without a default value. This is not possible if the table is not empty.
  - Made the column `attributes_id` on table `attribute_value` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "attribute_value" DROP CONSTRAINT "attribute_value_attributes_id_fkey";

-- AlterTable
ALTER TABLE "attribute_value" ADD COLUMN     "attributeunit_id" INTEGER NOT NULL,
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "attributes_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "attribute_value_attributeunit_id_key" ON "attribute_value"("attributeunit_id");

-- AddForeignKey
ALTER TABLE "attribute_value" ADD CONSTRAINT "attribute_value_attributes_id_fkey" FOREIGN KEY ("attributes_id") REFERENCES "attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribute_value" ADD CONSTRAINT "attribute_value_attributeunit_id_fkey" FOREIGN KEY ("attributeunit_id") REFERENCES "attributes_unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
