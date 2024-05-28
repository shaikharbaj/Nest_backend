-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING';
