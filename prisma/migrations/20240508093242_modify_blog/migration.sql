/*
  Warnings:

  - Added the required column `subcategory_id` to the `blogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "blogs" ADD COLUMN     "subcategory_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
