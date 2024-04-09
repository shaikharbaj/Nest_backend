-- CreateTable
CREATE TABLE "userInformation" (
    "id" SERIAL NOT NULL,
    "phone" TEXT,
    "data_of_birth" DATE,
    "phone_number" VARCHAR(25),
    "street" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipcode" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "userInformation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userInformation_userId_key" ON "userInformation"("userId");

-- AddForeignKey
ALTER TABLE "userInformation" ADD CONSTRAINT "userInformation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
