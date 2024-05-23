import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prismaservice';
import { Response } from 'express';
@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async loadcartproduct(auth: any, res: Response) {
    try {
      const cart = await this.prisma.cart.findFirst({
        where: {
          userId: Number(auth.userId),
        },
      });
      //get all product from cart...
      const cartItem = await this.prisma.cartItem.findMany({
        include: {
          product: true,
        },
        where: {
          cartId: cart.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'cart item fetch successfully',
        data: cartItem,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }
  
  async add_to_cart(auth: any, data: any, res: Response) {
    try {
      const cart = await this.prisma.cart.findFirst({
        where: {
          userId: Number(auth.userId),
        },
      });
      const cartId = cart?.id;

      //check product is already in cart or not if
      const checkproductalreadyexist = await this.prisma.cartItem.findFirst({
        where: {
          AND: [{ cartId: cartId }, { productId: Number(data.product_id) }],
        },
      });
      let product;
      if (!checkproductalreadyexist) {
        product = await this.prisma.cartItem.create({
          include: {
            product: true,
          },
          data: {
            cartId: cartId,
            productId: Number(data.product_id),
            quantity: 1,
          },
        });
      } else {
        product = await this.prisma.cartItem.update({
          include: {
            product: true,
          },
          where: {
            id: Number(checkproductalreadyexist.id),
          },
          data: {
            quantity: { increment: 1 },
          },
        });
      }

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'item added in cart successfully',
        data: product,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  async incrementQuantity(auth: any, id: number, res: Response) {
    try {
      const cart = await this.prisma.cart.findFirst({
        where: {
          userId: Number(auth.userId),
        },
      });
      const cartId = cart?.id;

      //check product is already in cart or not if
      const checkproductalreadyexist = await this.prisma.cartItem.findFirst({
        where: {
          AND: [{ cartId: cartId }, { productId: Number(id) }],
        },
      });
      if (!checkproductalreadyexist) {
        throw new Error(
          'product with this id is not present in this users cart',
        );
      }
      //update the quantity of the product......
      const updatequantity = await this.prisma.cartItem.update({
        where: {
          id: checkproductalreadyexist.id,
        },
        data: { quantity: { increment: 1 } },
      });

      return res.status(HttpStatus.OK).json({
        message: 'quantity incremented successfully',
        data: updatequantity,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  async decrementQuantity(auth: any, id: number, res: Response) {
    try {
      const cart = await this.prisma.cart.findFirst({
        where: {
          userId: Number(auth.userId),
        },
      });
      const cartId = cart?.id;

      //check product is already in cart or not if
      const checkproductalreadyexist = await this.prisma.cartItem.findFirst({
        where: {
          AND: [{ cartId: cartId }, { productId: Number(id) }],
        },
      });

      if (!checkproductalreadyexist) {
        throw new Error(
          'product with this id is not present in this users cart',
        );
      }

      //   if (checkproductalreadyexist.quantity > 1) {
      let updatedproduct = await this.prisma.cartItem.update({
        where: {
          id: checkproductalreadyexist.id,
        },
        data: { quantity: { decrement: 1 } },
      });
      //   } else {
      if (updatedproduct.quantity == 0) {
        await this.prisma.cartItem.delete({
          where: {
            id: Number(checkproductalreadyexist.id),
          },
        });
      }

      //update the quantity of the product........
      return res.status(HttpStatus.OK).json({
        message: 'quantity decrement successfully.',
        data: updatedproduct,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  async removeproductfromcart(auth: any, id: number, res: Response) {
    try {
      //find cart...
      const cart = await this.prisma.cart.findFirst({
        where: {
          userId: Number(auth.userId),
        },
      });

      //find product.....
      const product = await this.prisma.cartItem.findFirst({
        where: {
          AND: [{ cartId: cart.id }, { productId: Number(id) }],
        },
      });
      //delete the product from cartItem...
      const removeItem = await this.prisma.cartItem.delete({
        where: {
          id: Number(product.id),
        },
      });

      return res.status(HttpStatus.OK).json({
        success: true,
        data: removeItem,
        message: 'cart item deleted successfully...!',
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }
}
