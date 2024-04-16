-- CreateTable
CREATE TABLE "JsonExample" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "attributes" JSONB NOT NULL,

    CONSTRAINT "JsonExample_pkey" PRIMARY KEY ("id")
);
