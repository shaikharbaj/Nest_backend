/*
  Warnings:

  - Added the required column `end_date` to the `banner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `banner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "banner" ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL;
