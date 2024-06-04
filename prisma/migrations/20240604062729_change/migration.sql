/*
  Warnings:

  - You are about to drop the column `categoryId` on the `attributes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "attributes" DROP CONSTRAINT "attributes_categoryId_fkey";

-- AlterTable
ALTER TABLE "attributes" DROP COLUMN "categoryId",
ADD COLUMN     "category_id" INTEGER;

-- AddForeignKey
ALTER TABLE "attributes" ADD CONSTRAINT "attributes_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
