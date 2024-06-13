/*
  Warnings:

  - Added the required column `img_order` to the `VariantImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VariantImage" ADD COLUMN     "img_order" INTEGER NOT NULL;
