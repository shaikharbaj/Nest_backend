import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { AttributevalueService } from './attributevalue.service';
import { Response } from 'express';
@Controller('attributevalue')
export class AttributevalueController {
  constructor(private readonly attributevalueService: AttributevalueService) {}

  @Get('/getattributevaluebyid/:id')
  async getAttributevaluebyId(@Param('id') id: number, @Res() res: Response) {
    return await this.attributevalueService.getAttributeValueById(id, res);
  }

  @Post('/create')
  async createAttributevalue(@Body() data: any, @Res() res: Response) {
    return await this.attributevalueService.createAttributeValue(data, res);
  }

  @Patch('/edit/:id')
  async editAttributevalue(
    @Param('id') id: number,
    @Body() data: any,
    @Res() res: Response,
  ) {
    return await this.attributevalueService.editAttributeValue(id, data, res);
  }

  @Patch('/changestatus/:id')
  async changestatus_Attributevalue(
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    return await this.attributevalueService.togglestatus(id, res);
  }

  @Delete('/delete/:id')
  async deleteattributevaluestatus(
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    return await this.attributevalueService.deleteattributevalue(id, res);
  }
}
