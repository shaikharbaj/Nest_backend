import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { Response } from 'express';

@Controller('attribute')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Get('/getattributewithvalue/:id')
  async getvaluesofsingleAttribute(
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    return await this.attributeService.getattributewithvalue(id, res);
  }
  @Get('/all')
  async getallattribute(@Query() payload: any, @Res() res: Response) {
    const { page, searchTerm }: { page: number; searchTerm: string } = payload;
    return await this.attributeService.getallattribute(
      Number(page),
      searchTerm,
      res,
    );
  }

  @Get('loadattributeById/:id')
  async loadattributeById(@Param('id') id: number, @Res() res: Response) {
    return await this.attributeService.loadattributeById(id, res);
  }
  @Post('/add')
  async addAttribute(@Body() data: any, @Res() res: Response) {
    return await this.attributeService.addAttribute(data, res);
  }

  @Patch('/edit/:id')
  async editAttribute(
    @Body() data: any,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    return await this.attributeService.editAttribute(id, data, res);
  }
  @Delete('/delete/:id')
  async deleteAttribute(@Param('id') id: number, @Res() res: Response) {
    return await this.attributeService.deleteAttribute(id, res);
  }

  @Patch('/change-status/:id')
  async chanestatus(@Param('id') id: number, @Res() res: Response) {
    return await this.attributeService.changestatus(id, res);
  }
}
