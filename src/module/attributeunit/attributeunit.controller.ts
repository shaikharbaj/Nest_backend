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
  UseGuards,
} from '@nestjs/common';
import { AttributeunitService } from './attributeunit.service';
import { Response } from 'express';
import { JwtGuard } from '../user/guards/jwt.guards';
import { Auth } from '../user/dto/authdto';

@Controller('attributeunit')
export class AttributeunitController {
  constructor(private readonly attributeunitService: AttributeunitService) {}


  @Get("/getattributeunitby_categoty_id/:id")
  async getattributeunitbyCategory_id(@Param("id") id:number,@Res() res:Response){
        return await this.attributeunitService.getattributeunitbycategory_id(id,res);
  }
  @Get('/all')
  async getallattributeUnit(@Query() payload: any, @Res() res: Response) {
    const { page, searchTerm }: { page: number; searchTerm: string } = payload;
    return await this.attributeunitService.getallattributeUnit(
      Number(page),
      searchTerm,
      res,
    );
  }
  @Get('loadattributeuniteById/:id')
  async loadattributeuniteById(@Param('id') id: number, @Res() res: Response) {
    return await this.attributeunitService.loadattributeuniteById(id, res);
  }

  @UseGuards(JwtGuard)
  @Post('/add')
  async addAttributeUnit(@Auth() auth:any,@Body() data: any, @Res() res: Response) {
    console.log(auth)
    return await this.attributeunitService.addAttributeUnit(auth,data, res);
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

  @Patch('/change_status/:id')
  async changestatus(@Param('id') id: number, @Res() res: Response) {
    return await this.attributeunitService.changestatus(id, res);
  }
}
