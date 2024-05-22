import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prismaservice';
import { Response } from 'express';
@Injectable()
export class CartService {

    constructor(private readonly prisma: PrismaService) { }

    async add_to_cart(auth: any, data: any, res: Response) {
        try {
            const cart = await this.prisma.cart.findFirst({
                where: {
                    userId: Number(auth.userId)
                }
            })
            const cartId = cart?.id;

            //check product is already in cart or not if 
            const checkproductalreadyexist = await this.prisma.cartItem.findFirst({
                where: {
                    AND: [
                        { cartId: cartId },
                        { productId: Number(data.product_id) }
                    ]
                }
            })
            let product;
            if (!checkproductalreadyexist) {
                product = await this.prisma.cartItem.create({
                    data: {
                        cartId: cartId,
                        productId: Number(data.product_id),
                        quantity: 1
                    }
                })
            } else {
                product = await this.prisma.cartItem.update({
                    where: {
                        id: Number(checkproductalreadyexist.id)
                    },
                    data: {
                        quantity: { increment: 1 }
                    }
                })
            }
            // //add product to cart................

            // const product = await this.prisma.cartItem.create({
            //     data: {
            //         cartId: cartId,
            //         productId: Number(data.product_id),
            //         quantity: Number(data.quantity)
            //     }
            // })

            return res.status(HttpStatus.OK).json({ success: true, message: "item added in cart successfully", data: product });

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    async incrementQuantity(auth: any, id: number, res: Response) {
        try {
            const cart = await this.prisma.cart.findFirst({
                where: {
                    userId: Number(auth.userId)
                }
            })
            const cartId = cart?.id;

            //check product is already in cart or not if 
            const checkproductalreadyexist = await this.prisma.cartItem.findFirst({
                where: {
                    AND: [
                        { cartId: cartId },
                        { productId: Number(id) }
                    ]
                }
            })
            if (!checkproductalreadyexist) {
                throw new Error("product with this id is not present in this users cart")
            }
            //update the quantity of the product......
            const updatequantity = await this.prisma.cartItem.update({
                where: {
                    id: checkproductalreadyexist.id
                },
                data: { quantity: { increment: 1 } }
            })

            return res.status(HttpStatus.OK).json({ message: "quantity incremented successfully", data: updatequantity })
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }


    async decrementQuantity(auth: any, id: number, res: Response) {
        try {
            const cart = await this.prisma.cart.findFirst({
                where: {
                    userId: Number(auth.userId)
                }
            })
            const cartId = cart?.id;

            //check product is already in cart or not if 
            const checkproductalreadyexist = await this.prisma.cartItem.findFirst({
                where: {
                    AND: [
                        { cartId: cartId },
                        { productId: Number(id) }
                    ]
                }
            })
            if (!checkproductalreadyexist) {
                throw new Error("product with this id is not present in this users cart")
            }

            if (checkproductalreadyexist.quantity > 1) {
                const updatequantity = await this.prisma.cartItem.update({
                    where: {
                        id: checkproductalreadyexist.id
                    },
                    data: { quantity: { decrement: 1 } }
                })
            } else {
                const deleteproduct = await this.prisma.cartItem.delete({
                    where: {
                        id: Number(checkproductalreadyexist.id)
                    }
                })
            }
            //update the quantity of the product.....
            return res.status(HttpStatus.OK).json({ message: "quantity incremented successfully" })
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

}
