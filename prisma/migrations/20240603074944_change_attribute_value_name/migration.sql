/*
  Warnings:

  - You are about to drop the `AttributesValue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AttributesValue" DROP CONSTRAINT "AttributesValue_attributes_id_fkey";

-- DropTable
DROP TABLE "AttributesValue";

-- CreateTable
CREATE TABLE "attribute_value" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "attributes_id" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attribute_value_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "attribute_value" ADD CONSTRAINT "attribute_value_attributes_id_fkey" FOREIGN KEY ("attributes_id") REFERENCES "attributes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
