import { Body, Delete, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { response, Response } from 'express';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }
    @Post("/add")
    async addCategory(@Body() data: any, @Res() res: Response) {
        return await this.categoryService.addCategory(data, res);
    }
    @Post("/add/subcategory")
    async addsubCategory(@Body() data: any, @Res() res: Response) {
        return await this.categoryService.addsubCategory(data, res);
    }
    @Patch("/edit/:id")
    async editCategory(@Body() data: any, @Res() res: Response, @Param("id") id: number) {
        return await this.categoryService.editcategory(data, id, res)
    }
    @Patch("/edit/subcategory/:id")
    async editsubcategory(@Body() data: any, @Param("id") id: number, @Res() res: Response) {
        return await this.categoryService.updatesubCategory(data, id, res);
    }
    @Get("/all")
    async getAllCategory(@Res() res: Response) {
        return await this.categoryService.getAllCategories(res);
    }
    @Get("all/subcataegories")
    async getallsubcategories(@Res() res:Response){
           return await this.categoryService.getallsubcategories(res);
    }
    @Get("sub_of_single_category/:id")
    async sub_of_single_category(@Param("id") id:number,@Res() response:Response){
           return await this.categoryService.sub_of_single_category(id,response);
    }
    @Get(":id")
    async getcategorybyID(@Param("id") id: number, @Res() res: Response) {
        return await this.categoryService.getcategorybyId(id, res);
    }
    @Get("/subcategory/:id")
    async getsubcategorysubcategory(@Param("id") id: number, @Res() res: Response) {
        return await this.categoryService.getsubcategorysubcategory(id, res);
    }
    @Delete("delete/:id")
    async deleteCategory(@Param("id") id: number, @Res() res: Response) {
        return await this.categoryService.deleteCategory(id, res)
    }
    @Delete("delete/subcategory/:id")
    async deletesubCategory(@Param("id") id: number, @Res() res: Response) {
        return await this.categoryService.deletesubCategory(id, res)
    }
}
