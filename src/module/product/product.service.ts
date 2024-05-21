import { HttpStatus, Injectable } from "@nestjs/common";
import { Response } from "express";
import { title } from "process";
import { PrismaService } from "../prisma/prismaservice";
import { CloudinaryService } from "src/cloudinary.service";

@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService, private readonly cloudinary: CloudinaryService) { }

    async getallproducts(response: Response) {
        try {
            const products = await this.prisma.product.findMany({});
            return response.status(HttpStatus.OK).json({ message: 'all products fetch successfully', data: products });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: 'error while fetching data', data: error.message });
        }
    }
    async addproduct(auth: any, data: any, file: Express.Multer.File, res: Response) {
        try {
            console.log(auth.userId);
            const payload: any = {
                name: data.name,
                description: data.description,
                originalprice: data.originalprice,
                discountprice: data.discountprice,
                stock: Number(data.stock),
                category_id: Number(data.category_id),
                subcategory_id: Number(data.subcategory_id),
                supplier_id: Number(auth.userId)
            }
            if (file) {
                const result = await this.cloudinary.uploadImage(file);
                payload.image = result.url; // Add avatar property if image upload successful
            }
            const product = await this.prisma.product.create({
                data: {
                    name: payload.name,
                    description: payload.description,
                    originalprice: parseFloat(payload.originalprice),
                    discountprice: parseFloat(payload.discountprice),
                    stock: payload.stock,
                    category_id: Number(payload.category_id),
                    subcategory_id: Number(payload.subcategory_id),
                    image: payload.image,
                    supplier_id: 1
                }
            })
            return res.status(201).json({ success: true, message: "product added successfully", data: product })
        } catch (error) {
            console.log(error)
            return res.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }
    async updateProduct(id: number, res: Response) {

    }
    async deleteproduct(id: number, res: Response) {
        try {
            const product = await this.prisma.product.delete({
                where: {
                    id: Number(id)
                }
            })
            return res.status(HttpStatus.OK).json({ success: true, message: "product deleted successfully", data: product })
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }
    async getsingleproduct(id: number, res: Response) {
        try {
            const product = await this.prisma.product.findUnique({
                where: {
                    id: Number(id)
                }
            })
            return res.status(HttpStatus.OK).json({ success: true, message: "product fetch successfully", data: product })
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message })
        }
    }
}