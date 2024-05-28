import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prismaservice';
import { Response } from 'express';
import { throwError } from 'rxjs';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

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
          throw new BadRequestException(
            `Insufficient stock for product: ${product.name}`,
          );
        }
      }
      const order = await this.prisma.$transaction(async (prisma) => {
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
              create: data?.orderItems,
            },
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
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Order place Successfully',
        data: order,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message, success: false });
    }
  }

  async getallordersofcustomer(auth: any, res: Response) {
    try {
      const orders = await this.prisma.order.findMany({
        select: {
          id: true,
          userId: true,
          totalPrice: true,
          status: true,
          paymentStatus: true,
          paymentMethod: true,
          shippingName: true,
          shippingPhone: true,
          shippingEmail: true,
          shippingAddressLine1: true,
          shippingAddressLine2: true,
          shippingCity: true,
          shippingState: true,
          shippingZipCode: true,
          shippingCountry: true,
          createdAt: true,
          orderItems: {
            select: {
              id: true,
              quantity: true,
              price: true,
              product: true,
              status: true,
              paymentStatus: true,
            },
          },
        },
        where: {
          userId: Number(auth.userId),
        },
      });
      if (!orders) {
        throw new Error('no order found');
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'order fetch successfully',
        data: orders,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  async getorderbyID(auth: any, id: number, res: Response) {
    try {
      const order = await this.prisma.order.findFirst({
        select: {
          id: true,
          userId: true,
          totalPrice: true,
          status: true,
          paymentStatus: true,
          paymentMethod: true,
          shippingName: true,
          shippingPhone: true,
          shippingEmail: true,
          shippingAddressLine1: true,
          shippingAddressLine2: true,
          shippingCity: true,
          shippingState: true,
          shippingZipCode: true,
          shippingCountry: true,
          createdAt: true,
          orderItems: {
            select: {
              id: true,
              quantity: true,
              price: true,
              product: true,
              status: true,
              paymentStatus: true,
            },
          },
        },
        where: {
          AND: [{ id: Number(id) }, { userId: Number(auth.userId) }],
        },
      });

      return res.status(201).json({
        data: order,
        success: true,
        message: 'order fetch successfully',
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message, success: false });
    }
  }

  async loadallsupplierorders(auth: any, res: Response) {
    try {
      const order = await this.prisma.order.findFirst({
        select: {
          id: true,
          userId: true,
          totalPrice: true,
          status: true,
          paymentStatus: true,
          paymentMethod: true,
          shippingName: true,
          shippingPhone: true,
          shippingEmail: true,
          shippingAddressLine1: true,
          shippingAddressLine2: true,
          shippingCity: true,
          shippingState: true,
          shippingZipCode: true,
          shippingCountry: true,
          createdAt: true,
          orderItems: {
            select: {
              id: true,
              quantity: true,
              price: true,
              product: true,
              status: true,
              paymentStatus: true,
            },
          },
        },
        where: {
          userId: Number(auth.userId),
        },
      });
      return res.status(201).json({
        data: order,
        success: true,
        message: 'supplier order fetch successfully...!',
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message, success: false });
    }
  }
}
