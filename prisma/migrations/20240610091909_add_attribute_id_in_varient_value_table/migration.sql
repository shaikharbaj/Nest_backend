/*
  Warnings:

  - Added the required column `attribute_id` to the `varients_value` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "varients_value" ADD COLUMN     "attribute_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "varients_value" ADD CONSTRAINT "varients_value_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
