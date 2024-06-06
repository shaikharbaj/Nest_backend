import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prismaservice';
import { Response } from 'express';

@Injectable()
export class AttributevalueService {
  constructor(private readonly prisma: PrismaService) {}

  async createAttributeValue(data: any, res: Response) {
    try {
      //check attribute is present or not....
      const checkattributepresent = await this.prisma.attributes.findFirst({
        where: {
          id: Number(data?.attributes_id),
        },
      });
      if (!checkattributepresent) {
        throw new Error('attribute with this id is not present.');
      }
      if (data?.attributeunit_id) {
        //check unit is present....
        const checkattributeunitpresent =
          await this.prisma.attributesUnit.findFirst({
            where: {
              id: Number(data?.attributeunit_id),
            },
          });
        if (!checkattributeunitpresent) {
          throw new Error('attributeunit with this id is not present.');
        }
      }

      //check attribute value is already present or not...
      const checkattributevalueispresent =
        await this.prisma.attributesValue.findFirst({
          where: {
            name: data?.attributevalueName,
            attributes_id: data?.attributes_id,
          },
        });
      if (checkattributevalueispresent) {
        throw new Error('attribute value is already present');
      }

      //create the attribute value.............
      const payload: any = {
        name: data?.attributevalueName,
        status: data?.status,
        attributes_id: data?.attributes_id,
      };
      if (data?.attributeunit_id) {
        payload.attributeunit_id = data?.attributeunit_id;
      }

      const newdata = await this.prisma.attributesValue.create({
        data: payload,
      });

      return res.status(HttpStatus.OK).json({
        message: 'attribute value created successfully',
        success: true,
        data: newdata,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  async getAttributeValueById(id: number, res: Response) {
    try {
      const data = await this.prisma.attributesValue.findFirst({
        include: {
          attributeunit: true,
          attributes: true,
        },
        where: {
          id: Number(id),
        },
      });
      if (!data) {
        throw new Error('attributevalue with this is not found');
      }
      return res.status(HttpStatus.OK).json({
        message: 'attribute value fetch successfully',
        success: true,
        data: data,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }
  // { name: 'attvalue1', status: true, attributes_id: 1, id: 5 }
  async editAttributeValue(id: number, data: any, res: Response) {
    try {
      //check attribute value is present or not....
      const checkattributevvaluepresent =
        await this.prisma.attributesValue.findFirst({
          where: {
            id: Number(id),
          },
        });
      if (!checkattributevvaluepresent) {
        throw new Error('attribute value with this id is not present.');
      }
      //check attribute is present or not....
      const checkattributepresent = await this.prisma.attributes.findFirst({
        where: {
          id: Number(data?.attributes_id),
        },
      });
      if (!checkattributepresent) {
        throw new Error('attribute with this id is not present.');
      }
      //check unit is present....
      if (data?.attributeunit_id) {
        const checkattributeunitpresent =
          await this.prisma.attributesUnit.findFirst({
            where: {
              id: Number(data?.attributeunit_id),
            },
          });
        if (!checkattributeunitpresent) {
          throw new Error('attributeunit with this id is not present.');
        }
      }

      //check attribute value is already present or not...
      const checkattributevalueAlreadyPresent =
        await this.prisma.attributesValue.findFirst({
          where: {
            name: data?.name,
            attributes_id: Number(data?.attributes_id),
          },
        });
      if (
        checkattributevalueAlreadyPresent &&
        Number(id) !== checkattributevalueAlreadyPresent.id
      ) {
        throw new Error('attribute value is already present');
      }

      //update the data....
      const payload: any = {
        name: data?.name,
        status: data?.status,
        attributes_id: data?.attributes_id,
      };
      if (data?.attributeunit_id) {
        payload.attributeunit_id = data?.attributeunit_id;
      } else {
        payload.attributeunit_id = null;
      }
      const newdata = await this.prisma.attributesValue.update({
        where: {
          id: Number(id),
        },
        data: payload,
      });

      return res.status(HttpStatus.OK).json({
        message: 'attribute value update successfully',
        success: true,
        data: newdata,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  //change status attribute value........................
  async togglestatus(id: number, res: Response) {
    try {
      //check attribute value is present or not....
      const checkattributevaluepresent =
        await this.prisma.attributesValue.findFirst({
          where: {
            id: Number(id),
          },
        });
      if (!checkattributevaluepresent) {
        throw new Error('attribute value with this id is not present.');
      }

      //change the status......
      let updateddata: any;
      if (checkattributevaluepresent.status) {
        updateddata = await this.prisma.attributesValue.update({
          include: {
            attributeunit: true,
            attributes: true,
          },
          where: {
            id: Number(id),
          },
          data: {
            status: false,
          },
        });
      } else {
        updateddata = await this.prisma.attributesValue.update({
          include: {
            attributeunit: true,
            attributes: true,
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
        message: 'attribute value status updated successfully',
        success: true,
        data: updateddata,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  async deleteattributevalue(id: number, res: Response) {
    try {
      //check attribute value is present or not....
      const checkattributevaluepresent =
        await this.prisma.attributesValue.findFirst({
          where: {
            id: Number(id),
          },
        });
      if (!checkattributevaluepresent) {
        throw new Error('attribute value with this id is not present.');
      }

      //delete the attribute value....
      const deletevalue = await this.prisma.attributesValue.delete({
        where: {
          id: Number(id),
        },
      });
      return res.status(HttpStatus.OK).json({
        message: 'attribute value deleted successfully...!',
        success: true,
        data: deletevalue,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  //get all active attribute value.......................
  async getActiveAttributeValueById(id: number, res: Response) {
    try {
      //check attribute is present or not
      console.log(id)
      const checkattributeisPresent = await this.prisma.attributes.findFirst({
        where: {
          id: Number(id),
        },
      });
      if (!checkattributeisPresent) {
        throw new Error('attribute with this id is not present');
      }
      const data = await this.prisma.attributesValue.findMany({
        include: {
          attributeunit: true,
          attributes: true,
        },
        where: {
          attributes_id: Number(id),
          status: true,
        },
      });
      return res.status(HttpStatus.OK).json({
        message: 'active attribute value fetch successfully',
        success: true,
        data: data,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }
}
