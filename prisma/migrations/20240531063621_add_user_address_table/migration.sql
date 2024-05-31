-- CreateTable
CREATE TABLE "userAddress" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "userAddress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "userAddress" ADD CONSTRAINT "userAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
