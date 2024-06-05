-- DropForeignKey
ALTER TABLE "attribute_value" DROP CONSTRAINT "attribute_value_attributeunit_id_fkey";

-- AlterTable
ALTER TABLE "attribute_value" ALTER COLUMN "attributeunit_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "attribute_value" ADD CONSTRAINT "attribute_value_attributeunit_id_fkey" FOREIGN KEY ("attributeunit_id") REFERENCES "attributes_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
