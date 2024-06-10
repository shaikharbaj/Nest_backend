-- CreateTable
CREATE TABLE "varients" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "varients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "varients_value" (
    "id" SERIAL NOT NULL,
    "variant_id" INTEGER NOT NULL,
    "attributevalue_id" INTEGER NOT NULL,

    CONSTRAINT "varients_value_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "varients" ADD CONSTRAINT "varients_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "varients_value" ADD CONSTRAINT "varients_value_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "varients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "varients_value" ADD CONSTRAINT "varients_value_attributevalue_id_fkey" FOREIGN KEY ("attributevalue_id") REFERENCES "attribute_value"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
