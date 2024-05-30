/*
  Warnings:

  - Added the required column `url` to the `productImages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "productImages" ADD COLUMN     "url" TEXT NOT NULL;
