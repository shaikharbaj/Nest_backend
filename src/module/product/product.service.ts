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
  ) { }

  public async extractPublicId(url: string) {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0];
    return publicId;
  }
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
        slug:true,
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
        variants: {
          include: {
            varientValue: true,
            variantImages: true,
          },
        },
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

  async getallproductswithvarient(
    page: number,
    searchTerm: string,
    res: Response,
  ) {
    try {
      const data = await this.prisma.variant.findMany({
        include: {
          product: {
            include: {
              category: {
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
      });
      return res
        .status(HttpStatus.OK)
        .json({ message: 'all products fetch successfully', data });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, error: error.message });
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
          slug: true,
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
      const remove_imgorder = JSON.parse(payload?.remove_imgorder);
      console.log(remove_imgorder);
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

      //update varient....
      const update_varient = await this.prisma.variant.update({
        where: {
          id: Number(payload?.varient_id),
        },
        data: {
          discountprice: Number(payload.discountprice),
          originalprice: Number(payload.originalprice),
          stock: Number(payload.stock),
        },
      });

      //check images is presenet or not...
      const checkvarient_imagepresent = await this.prisma.variantImage.findMany(
        {
          where: {
            variantId: checkisvarientispresent.id,
          },
        },
      );
      if (checkvarient_imagepresent.length > 0) {
        //then update the images..........
        // remove the previous uploaded image
        const deleted_image_order = Object.values(remove_imgorder)
          .filter((o: any) => o !== '')
          .map((o) => Number(o));
        for (let i = 0; i < deleted_image_order.length; i++) {
          const imgurl = checkvarient_imagepresent.filter((j: any) => {
            return Number(j?.img_order) == Number(deleted_image_order[i]);
          });
          //remove the images from cloudinary and add the images .......

          const updatevarientimage = await this.prisma.variantImage.update({
            where: {
              id: Number(imgurl[0].id),
            },
            data: {
              url: null,
            },
          });
        }
        if (files) {
          let obj = [];
          for (let i = 0; i < Object.keys(files).length; i++) {
            obj.push(files[Object.keys(files)[i]][0]);
          }
          for (let i = 0; i < obj.length; i++) {
            const imgurl = await this.cloudinary.uploadImage(obj[i]);
            console.log(obj[i]['fieldname']);
            if (obj[i].fieldname == 'main') {
              const find = await this.prisma.variantImage.findFirst({
                where: {
                  img_order: 1,
                },
              });
              await this.prisma.variantImage.update({
                where: {
                  id: find.id,
                },
                data: {
                  url: imgurl?.url,
                },
              });
            } else if (obj[i].fieldname == 'file1') {
              const find = await this.prisma.variantImage.findFirst({
                where: {
                  img_order: 2,
                },
              });
              await this.prisma.variantImage.update({
                where: {
                  id: find.id,
                },
                data: {
                  url: imgurl?.url,
                },
              });
            } else if (obj[i].fieldname == 'file2') {
              const find = await this.prisma.variantImage.findFirst({
                where: {
                  img_order: 3,
                },
              });
              await this.prisma.variantImage.update({
                where: {
                  id: find.id,
                },
                data: {
                  url: imgurl?.url,
                },
              });
            } else if (obj[i].fieldname == 'file3') {
              const find = await this.prisma.variantImage.findFirst({
                where: {
                  img_order: 4,
                },
              });
              await this.prisma.variantImage.update({
                where: {
                  id: find.id,
                },
                data: {
                  url: imgurl?.url,
                },
              });
            } else if (obj[i].fieldname == 'file4') {
              const find = await this.prisma.variantImage.findFirst({
                where: {
                  img_order: 5,
                },
              });
              await this.prisma.variantImage.update({
                where: {
                  id: find.id,
                },
                data: {
                  url: imgurl?.url,
                },
              });
            } else {
              const find = await this.prisma.variantImage.findFirst({
                where: {
                  img_order: 6,
                },
              });
              await this.prisma.variantImage.update({
                where: {
                  id: find.id,
                },
                data: {
                  url: imgurl?.url,
                },
              });
            }
          }
        }
      } else {
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

        const updateimage = await this.prisma.variantImage.createMany({
          data: imagepayload,
        });
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'varient image added successfully',
        // data: updateimage,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  }

  async getproductDetails(slug: string, res: Response) {
    try {
      const data = await this.prisma.variant.findFirst({
        include: {
          variantImages: true,
          varientValue: {
            include: {
              attributeValue: {
                include: {
                  attributes: true,
                },
              },
            },
            orderBy: {
              attributeValue: {
                attributes: {
                  name: 'asc',
                },
              },
            },
          },
          product: {
            include: {
              category: true,
            },
          },
        },
        where: {
          slug: slug,
        },
      });
      if (!data) {
        throw new Error('No product found');
      }

      const usedAttributes = await this.prisma.attributes.findMany({
        where: {
          attributevalues: {
            some: {
              variantValue: {
                some: {
                  variant: {
                    product: {
                      id: +data?.productId,
                    },
                  },
                },
              },
            },
          },
        },
        include: {
          attributevalues: {
            where: {
              variantValue: {
                some: {
                  variant: {
                    product: {
                      id: +data?.productId,
                    },
                  },
                },
              },
            },
            include: {
              attributeunit: true,
              variantValue: {
                include: {
                  variant: {
                    include: {
                      product: true, // Include the product details associated with the variant
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          name: 'asc', // Order attributes by name in ascending order
        },
      });

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'product data fetch successfully',
        data: { ...data, varient: usedAttributes },
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  }

  async getproductvarientDetails(id: number, options: any, res: Response) {
    try {

      const filterConditions = Object.keys(options).map(key => ({
        attribute: {
          name: key,
        },
        attributeValue: {
          name: options[key],
        },
      }));

      console.log(filterConditions);

      const data = await this.prisma.variant.findFirst({
        include: {
          variantImages: true,
          varientValue: {
            include: {
              attributeValue: {
                include: {
                  attributes: true,
                },
              },
            },
            orderBy: {
              attributeValue: {
                attributes: {
                  name: 'asc',
                },
              },
            },
          },
          product: {
            include: {
              category: true,
            },
          },
        },
        where: {
          productId: +id,
          varientValue: {
            every: {
              OR: filterConditions.map(condition => ({
                attributes: condition.attribute,
                attributeValue: condition.attributeValue,
              })),
            },
          },
        },
      });
      if (!data) {
        throw new Error('No product found');
      }

      const usedAttributes = await this.prisma.attributes.findMany({
        where: {
          attributevalues: {
            some: {
              variantValue: {
                some: {
                  variant: {
                    product: {
                      id: +data?.productId,
                    },
                  },
                },
              },
            },
          },
        },
        include: {
          attributevalues: {
            where: {
              variantValue: {
                some: {
                  variant: {
                    product: {
                      id: +data?.productId,
                    },
                  },
                },
              },
            },
            include: {
              attributeunit: true,
              variantValue: {
                include: {
                  variant: {
                    include: {
                      product: true, // Include the product details associated with the variant
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          name: 'asc', // Order attributes by name in ascending order
        },
      });

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'product data fetch successfully',
        data: { ...data, varient: usedAttributes },
      });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  }
}
