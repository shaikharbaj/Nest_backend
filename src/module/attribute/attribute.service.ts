import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prismaservice';
import { PaginateFunction, paginator } from '../prisma/paginator';
import { Response } from 'express';

const paginate: PaginateFunction = paginator({ perPage: 10 });
@Injectable()
export class AttributeService {
  constructor(private readonly prisma: PrismaService) {}

  async findManywithPagination(select: {}, where: any, page: number = 1) {
    return await paginate(
      this.prisma.attributes,
      {
        select: select,
        where: { ...where },
      },
      { page },
    );
  }

  async loadattributeById(id: number, res: Response) {
    try {
      const data = await this.prisma.attributes.findFirst({
        include: {
          category: {
            include: {
              attributeUnit: true,
            },
          },
          attributevalues: true,
        },
        where: {
          id: Number(id),
        },
      });
      return res
        .status(HttpStatus.OK)
        .json({ message: 'attribute fetch successfully', data });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }
  async getallattribute(page: number, searchTerm: string, res: Response) {
    try {
      const select: any = {
        id: true,
        name: true,
        status: true,
        category: true,
        required: true,
      };
      const where: any = {
        OR: [{ name: { contains: searchTerm, mode: 'insensitive' } }],
      };
      const data = await this.findManywithPagination(select, where, page);
      console.log(data);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'all attributes fetch successfully', data });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }
  async addAttribute(data: any, res: Response) {
    try {
      //check category exist or not....
      const checkcategoryexist = await this.prisma.category.findFirst({
        where: {
          id: Number(data?.category_id),
        },
      });
      if (!checkcategoryexist) {
        throw new Error('category with this id is not found');
      }
      //check it is already present or not...
      const checkattributeAlreadyPresent =
        await this.prisma.attributes.findFirst({
          where: {
            category_id: Number(data?.category_id),
            name: data?.name,
          },
        });
      if (checkattributeAlreadyPresent) {
        throw new Error('attribute already present.');
      }
      //save attribute value...........
      const newAttribute = await this.prisma.attributes.create({
        data: {
          name: data?.name,
          category_id: Number(data?.category_id),
          status: data?.status,
          required: data?.required,
        },
      });

      return res.status(HttpStatus.OK).json({
        message: 'attribute added successfully',
        success: true,
        data: newAttribute,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  async editAttribute(id: number, data: any, res: Response) {
    try {
      console.log(data);
      const checkcategoryexist = await this.prisma.category.findFirst({
        where: {
          id: Number(data?.category_id),
        },
      });
      if (!checkcategoryexist) {
        throw new Error('category with this id is not found');
      }
      //check attribute unite is already present or not
      const checkattributeAlreadyPresent =
        await this.prisma.attributes.findFirst({
          where: {
            category_id: Number(data?.category_id),
            name: data?.name,
          },
        });
      if (
        checkattributeAlreadyPresent &&
        checkattributeAlreadyPresent.id !== Number(id)
      ) {
        throw new Error('attribute already present.');
      }

      //update the data............................
      const updateddata = await this.prisma.attributes.update({
        where: {
          id: Number(id),
        },
        data: {
          category_id: Number(data?.category_id),
          status: data?.status,
          name: data?.name,
          required: data?.required,
        },
      });

      return res.status(HttpStatus.OK).json({
        message: 'attribute updated successfully',
        success: true,
        data: updateddata,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }
  async deleteAttribute(id: number, res: Response) {
    try {
      const checkattributeAlreadyPresent =
        await this.prisma.attributes.findFirst({
          where: {
            id: Number(id),
          },
        });
      if (!checkattributeAlreadyPresent) {
        throw new Error('attribute with this id is not present');
      }
      //delete them....
      const deleteddata = await this.prisma.attributes.delete({
        where: {
          id: Number(id),
        },
      });
      return res.status(HttpStatus.OK).json({
        message: 'attribute deleted successfully',
        success: true,
        data: deleteddata,
      });
    } catch (error) {
      console.log(error.message);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  async changestatus(id: number, res: Response) {
    try {
      const checkattributeAlreadyPresent =
        await this.prisma.attributes.findFirst({
          where: {
            id: Number(id),
          },
        });
      if (!checkattributeAlreadyPresent) {
        throw new Error('attribute with this id is not present');
      }
      //change the status
      let change_status: any;
      if (checkattributeAlreadyPresent.status) {
        change_status = await this.prisma.attributes.update({
          include: {
            category: true,
          },
          where: {
            id: Number(id),
          },
          data: {
            status: false,
          },
        });
      } else {
        change_status = await this.prisma.attributes.update({
          include: {
            category: true,
          },
          where: {
            id: Number(id),
          },
          data: {
            status: true,
          },
        });
      }
      return res.status(HttpStatus.OK).json({
        message: 'attribute status updated successfully',
        success: true,
        data: change_status,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  async getattributewithvalue(id: number, res: Response) {
    try {
      const data = await this.prisma.attributes.findFirst({
        include: { category: true, attributevalues: true },
        where: {
          id: Number(id),
        },
      });
      return res
        .status(HttpStatus.OK)
        .json({ message: 'attributes with value fetch successfully', data });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  async getactiveattributeby_category_id(id: number, res: Response) {
    try {
      console.log(id);
      const checkcategoryexist = await this.prisma.category.findFirst({
        where: {
          id: Number(id),
        },
      });
      if (!checkcategoryexist) {
        throw new Error('category with this id is not found');
      }
      //get all attributes....
      const attributes = await this.prisma.attributes.findMany({
        include:{
             attributevalues:true
        },
        where: {
          category_id: Number(id),
          status: true,
        },
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'attributes fetch successfully',
        data: attributes,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }
}
