/*
  Warnings:

  - Added the required column `permission_name` to the `Permissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Permissions" ADD COLUMN     "permission_name" TEXT NOT NULL;
