import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prismaservice';
import { Response } from 'express';

@Injectable()
export class OrderService {
    constructor(private readonly prisma: PrismaService) { }

    async orderproduct(auth: any, data: any, res: Response) {
        try {
            //check the stock of products....
            for (let item of data?.orderItems) {
                const product = await this.prisma.product.findUnique({
                    where: { id: item.productId },
                });

                if (!product) {
                    throw new BadRequestException(`Product not found: ${item.productId}`);
                }

                if (product.stock < item.quantity) {
                    throw new BadRequestException(`Insufficient stock for product: ${product.name}`);
                }
            }
            const order =await this.prisma.$transaction(async (prisma) => {
                const createdOrder = await prisma.order.create({
                    data: {
                        userId: auth.userId,
                        totalPrice: data.totalPrice,
                        status: data?.status,
                        paymentStatus: data?.paymentStatus,
                        paymentMethod: data?.paymentMethod,
                        shippingName: data.shippingDetails.name,
                        shippingEmail: data.shippingDetails.email,
                        shippingCountry: data.shippingDetails.country,
                        shippingState: data.shippingDetails.state,
                        shippingCity: data.shippingDetails.city,
                        shippingAddressLine1: data.shippingDetails.addressLine1,
                        shippingPhone: data.shippingDetails.phone,
                        shippingZipCode: data.shippingDetails.zipCode,
                        orderItems: {
                            create: data?.orderItems
                        }
                    },
                });

                for (let item of data?.orderItems) {
                    await prisma.product.update({
                        where: { id: item.productId },
                        data: { stock: { decrement: item.quantity } },
                    });
                }

                return createdOrder;
            });  
        return res.status(HttpStatus.OK).json({ success: true, message: "Order place Successfully", data:order});
    } catch(error) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message, success: false });
    }
    }

    async getallordersofcustomer(auth:any,res:Response){
          try {
            // const orders = await this.prisma.
          } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({success:false,message:error.message});   
       }
    }

}
