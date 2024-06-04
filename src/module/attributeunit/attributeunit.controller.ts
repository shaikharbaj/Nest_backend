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
import { AttributeunitService } from './attributeunit.service';
import { Response } from 'express';

@Controller('attributeunit')
export class AttributeunitController {
  constructor(private readonly attributeunitService: AttributeunitService) {}


  @Get("/all")
  async getallattributeUnit(@Query() payload:any,@Res() res:Response){
         const { page, searchTerm }: { page: number; searchTerm: string } = payload;
          return await this.attributeunitService.getallattributeUnit(Number(page),
          searchTerm,
          res,);
  }
  @Get("loadattributeuniteById/:id")
  async loadattributeuniteById(@Param("id") id:number,@Res() res:Response){
       return await this.attributeunitService.loadattributeuniteById(id,res)
  }
  @Post('/add')
  async addAttributeUnit(@Body() data: any, @Res() res: Response) {
    return await this.attributeunitService.addAttributeUnit(data, res);
  }

  @Patch('/edit/:id')
  async editAttributeUnit(
    @Body() data: any,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    return await this.attributeunitService.editAttributeUnit(id, data, res);
  }
  @Delete('/delete/:id')
  async deleteAttributeUnit(@Param('id') id: number, @Res() res: Response) {
    return await this.attributeunitService.deleteAttributeUnit(id, res);
  }
}
