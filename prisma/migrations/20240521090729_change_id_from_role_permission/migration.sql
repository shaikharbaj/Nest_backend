/*
  Warnings:

  - The primary key for the `role_permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id");
