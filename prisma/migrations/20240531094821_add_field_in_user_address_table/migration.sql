/*
  Warnings:

  - Added the required column `address` to the `userAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `userAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `userAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `userAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `userAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipcode` to the `userAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "userAddress" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "phone_number" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "zipcode" TEXT NOT NULL;
