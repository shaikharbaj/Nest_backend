import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { title } from 'process';
import { PrismaService } from '../prisma/prismaservice';
import { CloudinaryService } from 'src/cloudinary.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}
  async getAllProductsforSupplier(auth: any, res: Response) {
    try {
      const products = await this.prisma.product.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          originalprice: true,
          discountprice: true,
          category_id: true,
          subcategory_id: true,
          image: true,
          stock: true,
          productImages: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          subcategory: {
            select: {
              id: true,
              name: true,
            },
          },
          supplier_id: true,
          supplier: true,
        },
        where: {
          supplier_id: Number(auth?.userId),
        },
      });

      return res
        .status(HttpStatus.OK)
        .json({ message: 'all products fetch successfully', data: products });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'error while fetching data', data: error.message });
    }
  }
  async getallproducts(res: Response) {
    try {
      const data = await this.prisma.product.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          originalprice: true,
          discountprice: true,
          stock: true,
          productImages: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          subcategory: {
            select: {
              id: true,
              name: true,
            },
          },
          image: true,
          supplier_id: true,
        },
      });
      return res
        .status(HttpStatus.OK)
        .json({ message: 'all products fetch successfully', data });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message, success: false });
    }
  }
  async addproduct(
    auth: any,
    data: any,
    files: Array<Express.Multer.File>,
    res: Response,
  ) {
    try {
      const payload: any = {
        name: data.name,
        description: data.description,
        originalprice: data.originalprice,
        discountprice: data.discountprice,
        stock: Number(data.stock),
        category_id: Number(data.category_id),
        subcategory_id: Number(data.subcategory_id),
        supplier_id: Number(auth.userId),
      };
      let imagepayload: any = [];

      if (files) {
        const result: any = await this.cloudinary.uploadImages(files);
        console.log(result);
        result.forEach((i: any, index: number) => {
          if (Number(data?.primaryImageIndex) == Number(index)) {
            imagepayload.push({ url: i.url, isThumbnail: true });
          } else {
            imagepayload.push({ url: i.url, isThumbnail: false });
          }
        });

        // console.log(result)
        // payload.image = result.url; // Add avatar property if image upload successful
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
          supplier_id: payload.supplier_id,
          productImages: {
            create: imagepayload,
          },
        },
      });
      return res.status(201).json({
        success: true,
        message: 'product added successfully',
        data: product,
      });
    } catch (error) {
      console.log(error);

      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  }
  async updateProduct(id: number, res: Response) {}
  async deleteproduct(id: number, res: Response) {
    try {
      const product = await this.prisma.product.delete({
        where: {
          id: Number(id),
        },
      });

      //delete the images of the product......

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'product deleted successfully',
        data: product,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  }
  async getsingleproduct(id: number, res: Response) {
    try {
      const product = await this.prisma.product.findUnique({
        select: {
          id: true,
          name: true,
          description: true,
          originalprice: true,
          discountprice: true,
          stock: true,
          productImages: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          subcategory: {
            select: {
              id: true,
              name: true,
            },
          },
          image: true,
          supplier_id: true,
        },
        where: {
          id: Number(id),
        },
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'product fetch successfully',
        data: product,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  }
  async loadsingleproduct(name: string, res: Response) {
    try {
      const product = await this.prisma.product.findFirst({
        select: {
          id: true,
          name: true,
          description: true,
          originalprice: true,
          discountprice: true,
          stock: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          subcategory: {
            select: {
              id: true,
              name: true,
            },
          },
          image: true,
        },
        where: {
          name: name,
        },
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'product fetch successfully',
        data: product,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  }
}
