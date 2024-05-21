-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('SUPPLIER', 'CUSTOMER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userType" "UserType";

-- AlterTable
ALTER TABLE "role_permissions" ADD COLUMN     "userType" "UserType";
