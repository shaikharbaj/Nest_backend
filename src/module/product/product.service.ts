import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { title } from 'process';
import { PrismaService } from '../prisma/prismaservice';
import { CloudinaryService } from 'src/cloudinary.service';
import { PaginateFunction, paginator } from '../prisma/paginator';
const paginate: PaginateFunction = paginator({ perPage: 10 });
@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}
  public slugify(str: string) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async findManywithPagination(select: {}, where: any, page: number = 1) {
    return await paginate(
      this.prisma.product,
      {
        select: select,
        where: { ...where },
      },
      { page },
    );
  }

  async getAllProductsforSupplier(
    auth: any,
    page: number,
    searchTerm: string,
    res: Response,
  ) {
    try {
      const where = {
        supplier_id: Number(auth?.userId),
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          {
            category: {
              OR: [{ name: { contains: searchTerm, mode: 'insensitive' } }],
            },
          },
          {
            subcategory: {
              OR: [{ name: { contains: searchTerm, mode: 'insensitive' } }],
            },
          },
        ],
      };
      const select = {
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
      };

      const data = await this.findManywithPagination(select, where, page);
      // const products = await this.prisma.product.findMany({
      //   select: {
      //     id: true,
      //     name: true,
      //     description: true,
      //     originalprice: true,
      //     discountprice: true,
      //     category_id: true,
      //     subcategory_id: true,
      //     image: true,
      //     stock: true,
      //     productImages: true,
      //     category: {
      //       select: {
      //         id: true,
      //         name: true,
      //       },
      //     },
      //     subcategory: {
      //       select: {
      //         id: true,
      //         name: true,
      //       },
      //     },
      //     supplier_id: true,
      //     supplier: true,
      //   },
      //   where: {
      //     supplier_id: Number(auth?.userId),
      //     OR: [
      //       { name: { contains: searchTerm, mode: 'insensitive' } },
      //     ]
      //   },
      // });

      return res
        .status(HttpStatus.OK)
        .json({ message: 'all products fetch successfully', data });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'error while fetching data', data: error.message });
    }
  }
  async getallproducts(page: number, searchTerm: string, res: Response) {
    try {
      const select: any = {
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
      };
      const where: any = {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      };
      const data = await this.findManywithPagination(select, where, page);
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

      // console.log();
      const slug = this.slugify(payload?.name);

      const product = await this.prisma.product.create({
        data: {
          name: payload.name,
          description: payload.description,
          originalprice: parseFloat(payload.originalprice),
          discountprice: parseFloat(payload.discountprice),
          slug: slug,
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

      // save
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

  async updateProduct(
    id: number,
    data: any,
    files: Array<Express.Multer.File>,
    res: Response,
  ) {
    try {
      // name: 'This is 1st product',
      // description: 'This is the description of the first product that i create',
      // category_id: '1',
      // subcategory_id: '',
      // originalprice: '500',
      // discountprice: '400',
      // stock: '10'
      const payload: any = {};
      if (data?.name) {
        payload.name = data?.name;
      }
      if (data?.description) {
        payload.description = data?.description;
      }
      if (data?.originalprice) {
        payload.originalprice = parseFloat(data?.originalprice);
      }
      if (data?.discountprice) {
        payload.discountprice = parseFloat(data?.discountprice);
      }
      if (data?.category_id) {
        payload.category_id = Number(data?.category_id);
      }
      if (data?.subcategory_id) {
        payload.subcategory_id = Number(data?.subcategory_id);
      }
      if (data?.stock) {
        payload.stock = Number(data?.stock);
      }
      console.log(payload);
      //update product.....
      const update = await this.prisma.product.update({
        where: {
          id: Number(id),
        },
        data: payload,
      });

      return res.status(201).json({
        success: true,
        message: 'product updated successfully',
        data: update,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }
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
      console.log(error);
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
          variants: {
            include: {
              varientValue: {
                include: {
                  attributes: {
                    include: {
                      attributevalues: true,
                    },
                  },
                },
              },
            },
          },
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
      // const slug = name.split('-').join(' ');
      // SAMSUNG Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)  (12 GB RAM)
      // samsung galaxy s24 ultra 5g titanium gray 256 gb 12 gb ram
      const product = await this.prisma.product.findFirst({
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
          variants: {
            include: {
              variantImages: true,
              varientValue: {
                include: {
                  attributes: {
                    include: {
                      attributevalues: true,
                    },
                  },
                },
              },
            },
          },
        },
        where: {
          slug: {
            equals: name,
            mode: 'insensitive',
          },
        },
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'product fetch successfully',
        data: product,
        // data: {},
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  }
  //add varient.......
  async addproductvarient(data: any, res: Response) {
    try {
      //check product is present or not
      const product_id = Number(data?.product_id);
      //check product exist or not.......
      const isproductpresent = await this.prisma.product.findFirst({
        where: {
          id: product_id,
        },
      });
      if (!isproductpresent) {
        throw new Error('product is not found with this id');
      }
      //varients .........................................
      const addeddata = await this.prisma.$transaction(async (prisma) => {
        const createdVariants = [];

        for (const variant of data?.variants) {
          const createdVariant = await prisma.variant.create({
            data: {
              productId: product_id,
              slug: variant.sku,
              sku: variant.sku,
              stock: Number(variant.stock),
              originalprice: Number(variant.originalprice),
              discountprice: Number(variant.discountprice),
              varientValue: {
                create: variant.attributes.map((attr: any) => ({
                  attribute_id: Number(attr.attributeID),
                  attributevalue_id: Number(attr.attributevalue_id),
                })),
              },
            },
            include: {
              varientValue: true,
            },
          });

          createdVariants.push(createdVariant);
        }
        return createdVariants;
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'product varient added successfully',
        data: addeddata,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  }

  async get_product_varient_details(data: any, res: Response) {
    try {
      const product_id = Number(data?.product_id);
      //check product exist or not.......
      const isproductpresent = await this.prisma.product.findFirst({
        where: {
          id: product_id,
        },
      });
      if (!isproductpresent) {
        throw new Error('product is not found with this id');
      }
      //check product varient is present or not
      const checkisvarientispresent = await this.prisma.variant.findFirst({
        include: {
          product: true,
          variantImages: true,
          varientValue: {
            include: {
              attributeValue: {
                include: {
                  attributes: true,
                },
              },
            },
          },
        },
        where: {
          productId: data?.product_id,
          id: Number(data?.varient_id),
        },
      });
      if (!checkisvarientispresent) {
        throw new Error('varient is not present with this id');
      }
      let attributeArr = checkisvarientispresent.varientValue.map(
        (varient: any) => {
          return [
            varient.attributeValue.attributes.name,
            varient.attributeValue.name,
          ];
        },
      );
      const arr = [];
      attributeArr.forEach((ele: any) => {
        arr.push(`${ele[0]}: ${ele[1]}`);
      });
      const attributeString = arr.join(', ');
      checkisvarientispresent['attributes'] = attributeString;
      //get product varient details..

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'product varient data fetch  successfully',
        data: checkisvarientispresent,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  }

  async addproductvarientImage(
    payload: any,
    files: Array<Express.Multer.File>,
    res: Response,
  ) {
    try {
      const product_id = Number(payload?.product_id);
      //check product exist or not.......
      const isproductpresent = await this.prisma.product.findFirst({
        where: {
          id: product_id,
        },
      });
      if (!isproductpresent) {
        throw new Error('product is not found with this id');
      }

      //check product varient is present or not
      const checkisvarientispresent = await this.prisma.variant.findFirst({
        where: {
          productId: Number(payload?.product_id),
          id: Number(payload?.varient_id),
        },
      });
      if (!checkisvarientispresent) {
        throw new Error('varient is not present with this id');
      }
      let obj = [];
      for (let i = 0; i < Object.keys(files).length; i++) {
        obj.push(files[Object.keys(files)[i]][0]);
      }

      let imagepayload: any = [];
      const arr = ['main', 'file1', 'file2', 'file3', 'file4', 'file5'];

      for (let i = 0; i < arr.length; i++) {
        console.log(obj[i]);
        if (arr[i] === obj[i]?.fieldname) {
          const result: any = await this.cloudinary.uploadImage(obj[i]);
          if (obj[i].fieldname === 'main') {
            imagepayload.push({
              url: result.url,
              isThumbnail: true,
              img_order: i + 1,
              variantId: Number(payload?.varient_id),
            });
          } else {
            imagepayload.push({
              url: result.url,
              isThumbnail: false,
              img_order: i + 1,
              variantId: Number(payload?.varient_id),
            });
          }
        } else {
          imagepayload.push({
            url: null,
            isThumbnail: false,
            img_order: i + 1,
            variantId: Number(payload?.varient_id),
          });
        }
      }

      console.log(imagepayload);

      // if (obj) {
      //   const result: any = await this.cloudinary.uploadImages(obj);
      //   result.forEach((i: any, index: number) => {
      //     if (Number(index) === 0) {
      //       imagepayload.push({
      //         url: i.url,
      //         isThumbnail: true,
      //         variantId: Number(payload?.varient_id),
      //       });
      //     } else {
      //       imagepayload.push({
      //         url: i.url,
      //         isThumbnail: false,
      //         variantId: Number(payload?.varient_id),
      //       });
      //     }
      //   });
      //   // console.log(result)
      //   // payload.image = result.url; // Add avatar property if image upload successful
      // }

      const updateimage = await this.prisma.variantImage.createMany({
        data: imagepayload,
      });

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'varient image added successfully',
        data: updateimage,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  }
}
