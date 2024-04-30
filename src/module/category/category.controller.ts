import { Body, Delete, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { Response } from 'express';
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
    @Get("/all")
    async getAllCategory(@Res() res: Response) {
        return await this.categoryService.getAllCategories(res);
    }
    @Get(":id")
    async getcategorybyID(@Param("id") id:number,@Res() res: Response) {
        return await this.categoryService.getcategorybyId(id,res);
    }
    @Delete("delete/:id")
    async deleteCategory(@Param("id") id: number, @Res() res: Response) {
        return await this.categoryService.deleteCategory(id, res)
    }
}
