import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma/prismaservice';
import { PaginateFunction, paginator } from '../prisma/paginator';
import { contains } from 'class-validator';
const paginate: PaginateFunction = paginator({ perPage: 10 });
@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
  async findManywithPagination(select: {}, where: any, page: number = 1) {
    return await paginate(
      this.prisma.category,
      {
        select: select,
        where: { ...where },
      },
      { page },
    );
  }
  async addCategory(payload: any, res: Response) {
    try {
      //check it is already present...
      const iscategoryAlreadyPresent = await this.prisma.category.findFirst({
        where: {
          name: payload.name,
        },
      });
      if (iscategoryAlreadyPresent) {
        throw new Error('this category is alredy exist...');
      }
      const data = await this.prisma.category.create({
        data: {
          name: payload.name,
        },
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'cataegory created successfully.!',
        data,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }
  async addsubCategory(payload: any, res: Response) {
    try {
      //check already exist or not
      const checksubalreadyexist = await this.prisma.category.findFirst({
        where: {
          AND: [
            {
              parent_id: Number(payload.parent_id),
            },
            {
              name: payload.name,
            },
          ],
        },
      });
      if (checksubalreadyexist) {
        throw new Error('this subcategory is alredy exist in this category...');
      }
      const data = await this.prisma.category.create({
        data: {
          name: payload.name,
          parent_id: Number(payload.parent_id),
        },
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'subcategory created successfully.!',
        data,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }
  async getAllCategories(page: number, searchTerm: string, res: Response) {
    try {
      const select: any = {
        id: true,
        name: true,
        category_status:true,
        createdAt: true,
        updatedAt: true,
      };
      const where: any = {
        parent_id: null,
        OR: [
          {
            name: { contains: searchTerm, mode: 'insensitive' },
          },
        ],
      };
      // const data = await this.prisma.category.findMany({
      //   where: {
      //     AND: [{ parent_id: null }],
      //   },
      // });
      const data = await this.findManywithPagination(select, where, page);
      console.log(data);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'all cataegory fetch successfully.!',
        data,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }
  async getAllActiveCategories(res: Response) {
    try {
      const data = await this.prisma.category.findMany({
        where: {
          AND: [{ parent_id: null }, { category_status: true }],
        },
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'all cataegory fetch successfully.!',
        data,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }
  async getallsubcategories(res: Response) {
    try {
      const data = await this.prisma.category.findMany({
        where: {
          NOT: {
            parent_id: null,
          },
        },
        include: {
          parent: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      // console.log()

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'all sub-cataegory fetch successfully.!',
        data,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }
  async getallActivesubcategories(res: Response) {
    try {
      const data = await this.prisma.category.findMany({
        where: {
          NOT: {
            AND: [
              { parent_id: null },
              { subcategory_status: true },
              { category_status: true },
            ],
          },
        },
        include: {
          parent: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      // console.log()

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'all sub-cataegory fetch successfully.!',
        data,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }
  async getcategorybyId(id: number, res: Response) {
    try {
      const data = await this.prisma.category.findFirst({
        where: {
          id: Number(id),
        },
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'cataegory fetch successfully.!',
        data,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }
  async getsubcategorysubcategory(id: number, res: Response) {
    try {
      const data = await this.prisma.category.findFirst({
        select: {
          id: true,
          name: true,
          parent_id: true,
        },
        where: {
          id: Number(id),
        },
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'subcategory fetch successfully.!',
        data,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }
  async sub_of_single_category(id: number, res: Response) {
    try {
      const checkcategoriesexist = await this.prisma.category.findFirst({
        where: {
          AND: [{ id: Number(id) }, { parent_id: null }],
        },
      });
      if (!checkcategoriesexist) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: 'category not found with this id' });
      }
      const data = await this.prisma.category.findMany({
        where: {
          AND: [{ parent_id: Number(id) }, { subcategory_status: true }],
        },
        include: {
          parent: {
            select: {
              name: true,
            },
          },
        },
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'subcategory fetch successfully.!',
        data,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }
  async editcategory(payload: any, id: number, res: Response) {
    try {
      //check category already present or not
      const checkexist = await this.prisma.category.findFirst({
        where: { id: Number(id), parent_id: null },
      });
      if (!checkexist) {
        throw new Error('category with this is not found');
      }
      const data = await this.prisma.category.update({
        where: {
          id: Number(id),
        },
        data: {
          name: payload.name,
        },
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'cataegory updated successfully.!',
        data,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  async updatesubCategory(payload: any, id: number, res: Response) {
    try {
      //check already exist or not
      const checksubalreadyexist = await this.prisma.category.findFirst({
        where: {
          id: Number(id),
        },
      });
      if (!checksubalreadyexist) {
        throw new Error('subcategory is not exist..!');
      }
      const data = await this.prisma.category.update({
        where: {
          id: Number(id),
        },
        data: {
          name: payload.name,
          parent_id: payload.parent_id,
        },
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'subcategory updated successfully.!',
        data,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  async deleteCategory(id: number, res: Response) {
    try {
      //check category already present or not..
      const checkexist = await this.prisma.category.findFirst({
        where: { id: Number(id), parent_id: null },
      });
      if (!checkexist) {
        throw new Error('category with this is not found');
      }
      //check category has subcategory or not if has then check thier subcategories is in used or not if they are in used then prevent category from delete otherwise delete them...............
      const checksubacategory = await this.prisma.category.findMany({
        where: {
          parent_id: checkexist.id,
        },
      });

      if (checksubacategory.length > 0) {
        //check subcategory is in used or not......
        const condition: any = [];
        const filter: any = {
          OR: condition,
        };
        checksubacategory.forEach((subcategory) => {
          condition.push({
            category_id: subcategory.parent_id,
            subcategory_id: subcategory.id,
          });
        });
        const relatedblogs = await this.prisma.blog.findMany({
          where: filter,
        });

        const relatedproducts = await this.prisma.product.findMany({
          where: filter,
        });

        if (relatedblogs.length > 0 || relatedproducts.length > 0) {
          throw new Error('unable to delete category bacause it is in used');
        } else {
          const ids = checksubacategory.map((ele) => ele.id);
          if (ids.length > 0) {
            //delete...
            await this.prisma.category.deleteMany({
              where: {
                id: {
                  in: ids,
                },
              },
            });
          }
          const data = await this.prisma.category.delete({
            where: {
              id: Number(id),
            },
          });

          return res.status(HttpStatus.OK).json({
            success: true,
            message: 'cataegory deleted successfully.!',
            data,
          });
        }
      } else {
        const data = await this.prisma.category.delete({
          where: {
            id: Number(id),
          },
        });
        return res.status(HttpStatus.OK).json({
          success: true,
          message: 'cataegory deleted successfully.!',
          data,
        });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  async deletesubCategory(id: number, res: Response) {
    try {
      //check subcategory already present or not..
      const checkexist = await this.prisma.category.findFirst({
        where: { id: Number(id) },
      });
      if (!checkexist) {
        throw new Error('sub-category with this is not found');
      }
      const data = await this.prisma.category.delete({
        where: {
          id: Number(id),
        },
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'subcategory deleted successfully.!',
        data,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  async getcategoryforFilter(res: Response) {
    try {
      const data = await this.prisma.category.findMany({
        where: {
          AND: [{ parent_id: null }, { category_status: true }],
        },
        include: {
          Category: {
            where: {
              subcategory_status: true,
            },
          },
        },
      });
      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: 'allcategories successfully.!', data });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  async togglecategorystatus(id: number, res: Response) {
    try {
      //check category already present or not..
      const checkexist = await this.prisma.category.findFirst({
        where: { id: Number(id), parent_id: null },
      });
      if (!checkexist) {
        throw new Error('category with this is not found');
      }

      const checksubacategory = await this.prisma.category.findMany({
        where: {
          parent_id: checkexist.id,
        },
      });
      if (checksubacategory.length > 0) {
        //check subcategory is in used or not......
        const condition: any = [];
        const filter: any = {
          OR: condition,
        };
        checksubacategory.forEach((subcategory) => {
          condition.push({
            category_id: subcategory.parent_id,
            subcategory_id: subcategory.id,
          });
        });
        const relatedblogs = await this.prisma.blog.findMany({
          where: filter,
        });

        const relatedproducts = await this.prisma.product.findMany({
          where: filter,
        });
        //   const ids = checksubacategory.map((ele) => ele.id);
        //   if (ids.length > 0) {
        //     //delete...
        //     await this.prisma.category.deleteMany({
        //       where: {
        //         id: {
        //           in: ids,
        //         },
        //       },
        //     });
        //   }
        if (relatedblogs.length > 0 || relatedproducts.length > 0) {
          if (checkexist.category_status) {
            throw new Error(
              'unable to inactive category bacause it is in used',
            );
          } else {
            //change status to active......
            // const data = await this.prisma.category.update({
            //         where:{
            //             id:checkexist.id
            //         },
            //         data:{
            //               category_status:false
            //         }
            // })
            // if(ids.length>0){
            //       //change subcategory status to
            // }
          }
        } else {
          let data: any;
          const ids = checksubacategory.map((ele) => ele.id);
          console.log(ids);
          if (checkexist.category_status) {
            await this.prisma.category.updateMany({
              where: {
                id: {
                  in: ids,
                },
              },
              data: {
                subcategory_status: false,
                category_status: false,
              },
            });

            data = await this.prisma.category.update({
              where: {
                id: Number(id),
              },
              data: {
                category_status: false,
              },
            });
          } else {
            await this.prisma.category.updateMany({
              where: {
                id: {
                  in: ids,
                },
              },
              data: {
                subcategory_status: true,
                category_status: true,
              },
            });

            data = await this.prisma.category.update({
              where: {
                id: Number(id),
              },
              data: {
                category_status: true,
              },
            });
          }

          return res.status(HttpStatus.OK).json({
            success: true,
            message: 'cataegory status updated successfully.!',
            data,
          });
        }
      } else {
        let data;
        if (checkexist?.category_status) {
          data = await this.prisma.category.update({
            where: {
              id: Number(id),
            },
            data: {
              category_status: false,
            },
          });
        } else {
          data = await this.prisma.category.update({
            where: {
              id: Number(id),
            },
            data: {
              category_status: true,
            },
          });
        }
        return res.status(HttpStatus.OK).json({
          success: true,
          message: 'cataegory status updated successfully.!',
          data,
        });
      }
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }
  async togglesubcategorystatus(id: number, res: Response) {
    try {
      const checkexist = await this.prisma.category.findFirst({
        where: { id: Number(id) },
      });
      if (!checkexist) {
        throw new Error('subcategory with this is not found');
      }
      //check it is used or not.....
      const relatedblogs = await this.prisma.blog.findMany({
        where: {
          subcategory_id: Number(id),
        },
      });

      const relatedproducts = await this.prisma.product.findMany({
        where: {
          subcategory_id: Number(id),
        },
      });

      if (relatedblogs.length > 0 || relatedproducts.length > 0) {
        throw new Error(
          'unable to inactive status because subcategory in used',
        );
      } else {
        let data: any;
        //change status
        if (checkexist.subcategory_status) {
          data = await this.prisma.category.update({
            include: {
              parent: true,
            },
            where: {
              id: checkexist.id,
            },
            data: {
              subcategory_status: false,
            },
          });
        } else {
          data = await this.prisma.category.update({
            include: {
              parent: true,
            },
            where: {
              id: checkexist.id,
            },
            data: {
              subcategory_status: true,
            },
          });
        }
        return res.status(HttpStatus.OK).json({
          success: true,
          message: 'subcataegory status updated successfully.!',
          data,
        });
      }
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }
}
