-- DropForeignKey
ALTER TABLE "productImages" DROP CONSTRAINT "productImages_product_id_fkey";

-- AddForeignKey
ALTER TABLE "productImages" ADD CONSTRAINT "productImages_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
