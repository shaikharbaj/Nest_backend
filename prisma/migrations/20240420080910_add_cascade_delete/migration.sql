-- DropForeignKey
ALTER TABLE "userInformation" DROP CONSTRAINT "userInformation_userId_fkey";

-- DropForeignKey
ALTER TABLE "userRoles" DROP CONSTRAINT "userRoles_userId_fkey";

-- AddForeignKey
ALTER TABLE "userInformation" ADD CONSTRAINT "userInformation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userRoles" ADD CONSTRAINT "userRoles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
