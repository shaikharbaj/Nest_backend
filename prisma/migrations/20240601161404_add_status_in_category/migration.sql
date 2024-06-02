-- AlterTable
ALTER TABLE "category" ADD COLUMN     "category_status" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "subcategory_status" BOOLEAN;
