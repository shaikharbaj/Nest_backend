-- CreateTable
CREATE TABLE "productImages" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "isThumbnail" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "productImages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "productImages" ADD CONSTRAINT "productImages_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
