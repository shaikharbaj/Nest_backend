-- CreateTable
CREATE TABLE "OTP" (
    "id" SERIAL NOT NULL,
    "otp" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OTP_user_id_key" ON "OTP"("user_id");

-- AddForeignKey
ALTER TABLE "OTP" ADD CONSTRAINT "OTP_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
