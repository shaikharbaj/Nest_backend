import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { response, Response } from 'express';
import { CategoryService } from './category.service';
import { JwtGuard } from '../user/guards/jwt.guards';
import { RolesGuard } from '../auth/guards/roles.guard';
import { HasPermission } from '../auth/decorator/has-permission.decorator';
import {
  categoryModulePermission,
  subCategoryModulePermission,
} from 'src/constants/permissions';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get('/category-for-filter')
  async category_for_filter(@Res() res: Response) {
    return await this.categoryService.getcategoryforFilter(res);
  }

  @Get('/all')
  async getAllCategory(@Query() payload: any,@Res() res: Response) {
    const { page, searchTerm }: { page: number; searchTerm: string } = payload;
    return await this.categoryService.getAllCategories( Number(page),
    searchTerm,res);
  }
  @Get('/getvariationoption/:id')
  async getvarientoption(@Param("id") id:number,@Res() res: Response) {
    return await this.categoryService.getvarientoption(id,res);
  }

  @Get('/allactiveCategory')
  async getAllActiveCategory(@Res() res: Response) {
    return await this.categoryService.getAllActiveCategories(res);
  }

  @Get('all/subcataegories')
  async getallsubcategories(@Res() res: Response) {
    return await this.categoryService.getallsubcategories(res);
  }
  @Get('/allsubactivecataegories')
  async getallActiveSubcategories(@Res() res: Response) {
    return await this.categoryService.getallActivesubcategories(res);
  }
  @Get('sub_of_single_category/:id')
  async sub_of_single_category(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    return await this.categoryService.sub_of_single_category(id, response);
  }
  @Get(':id')
  async getcategorybyID(@Param('id') id: number, @Res() res: Response) {
    return await this.categoryService.getcategorybyId(id, res);
  }
  @Get('/subcategory/:id')
  async getsubcategorysubcategory(
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    return await this.categoryService.getsubcategorysubcategory(id, res);
  }

  @HasPermission(categoryModulePermission.ADD)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('/add')
  async addCategory(@Body() data: any, @Res() res: Response) {
    return await this.categoryService.addCategory(data, res);
  }

  @HasPermission(subCategoryModulePermission.ADD)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('/add/subcategory')
  async addsubCategory(@Body() data: any, @Res() res: Response) {
    return await this.categoryService.addsubCategory(data, res);
  }

  @HasPermission(categoryModulePermission.UPDATE)
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('/edit/:id')
  async editCategory(
    @Body() data: any,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    return await this.categoryService.editcategory(data, id, res);
  }
   
  @Patch("/togglecategorystatus/:id")
  async togglecategoryStatus(@Param("id") id:number,@Res() res:Response){
        return await this.categoryService.togglecategorystatus(id,res);
  }
  @Patch("/togglesubcategorystatus/:id")
  async togglesubcategorystatus(@Param("id") id:number,@Res() res:Response){
        return await this.categoryService.togglesubcategorystatus(id,res);
  }
  @HasPermission(subCategoryModulePermission.UPDATE)
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('/edit/subcategory/:id')
  async editsubcategory(
    @Body() data: any,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    return await this.categoryService.updatesubCategory(data, id, res);
  }

  @HasPermission(categoryModulePermission.DELETE)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete('delete/:id')
  async deleteCategory(@Param('id') id: number, @Res() res: Response) {
    return await this.categoryService.deleteCategory(id, res);
  }
  @HasPermission(subCategoryModulePermission.DELETE)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete('delete/subcategory/:id')
  async deletesubCategory(@Param('id') id: number, @Res() res: Response) {
    return await this.categoryService.deletesubCategory(id, res);
  }
}
