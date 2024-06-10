/*
  Warnings:

  - Added the required column `originalprice` to the `varients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `varients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `varients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `varients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock` to the `varients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "varients" ADD COLUMN     "discountprice" DOUBLE PRECISION,
ADD COLUMN     "originalprice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "sku" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "stock" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "VariantImage" (
    "id" SERIAL NOT NULL,
    "variantId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "VariantImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VariantImage" ADD CONSTRAINT "VariantImage_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "varients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
