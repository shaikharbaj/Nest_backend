import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prismaservice';
import { Response } from 'express';
import { PaginateFunction, paginator } from '../prisma/paginator';
import { contains } from 'class-validator';

const paginate: PaginateFunction = paginator({ perPage: 10 });
@Injectable()
export class AttributeunitService {
  constructor(private readonly prisma: PrismaService) {}

  async findManywithPagination(select: {}, where: any, page: number = 1) {
    return await paginate(
      this.prisma.attributesUnit,
      {
        select: select,
        where: { ...where },
      },
      { page },
    );
  }
  async getallattributeUnit(page: number, searchTerm: string, res: Response) {
    try {
      const select: any = {
        id: true,
        name: true,
        status: true,
        category: true,
      };
      const where: any = {
        OR: [{ name: { contains: searchTerm, mode: 'insensitive' } }],
      };
      const data = await this.findManywithPagination(select, where, page);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'all attributes units fetch successfully', data });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }
  async addAttributeUnit(data: any, res: Response) {
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
      const checkattributeuniteAlreadyPresent =
        await this.prisma.attributesUnit.findFirst({
          where: {
            category_id: Number(data?.category_id),
            name: data?.name,
          },
        });
      if (checkattributeuniteAlreadyPresent) {
        throw new Error('attribute unite already present.');
      }
      //save attribute value...........
      const newAttribureUnite = await this.prisma.attributesUnit.create({
        data: {
          name: data?.name,
          category_id: Number(data?.category_id),
          status: data?.status,
        },
      });

      return res.status(HttpStatus.OK).json({
        message: 'attribute unite added successfully',
        success: true,
        data: newAttribureUnite,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  async editAttributeUnit(id: number, data: any, res: Response) {
    try {
      const checkcategoryexist = await this.prisma.category.findFirst({
        where: {
          id: Number(data?.category_id),
        },
      });
      if (!checkcategoryexist) {
        throw new Error('category with this id is not found');
      }
      //check attribute unite is already present or not
      const checkattributeuniteAlreadyPresent =
        await this.prisma.attributesUnit.findFirst({
          where: {
            category_id: Number(data?.category_id),
            name: data?.name,
          },
        });
      if (
        checkattributeuniteAlreadyPresent &&
        checkattributeuniteAlreadyPresent.id !== Number(id)
      ) {
        throw new Error('attribute unite already present.');
      }

      //update the data............................
      const updateddata = await this.prisma.attributesUnit.update({
        where: {
          id: Number(id),
        },
        data: {
          category_id: Number(data?.category_id),
          status: data?.status,
          name: data?.name,
        },
      });

      return res.status(HttpStatus.OK).json({
        message: 'attribute unite updated successfully',
        success: true,
        data: updateddata,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  }
  async deleteAttributeUnit(id: number, res: Response) {
    try {
      const checkattributeuniteAlreadyPresent =
        await this.prisma.attributesUnit.findFirst({
          where: {
            id: Number(id),
          },
        });
      if (!checkattributeuniteAlreadyPresent) {
        throw new Error('attribute unite with this id is not present');
      }
      //delete them....
      const deleteddata = await this.prisma.attributesUnit.delete({
        where: {
          id: Number(id),
        },
      });
      return res.status(HttpStatus.OK).json({
        message: 'attribute unite deleted successfully',
        success: true,
        data: deleteddata,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  }
}
