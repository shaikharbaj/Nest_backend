import { Body, Controller, Delete, Get, Patch, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Auth } from "../user/dto/authdto";
import { FileValidationPipe } from "src/exceptions/filetypeandsize";

@Controller()
export class ProductController{


    @Get()
    async getAllProducts(){}
    
    @Get(":id")
    async getSingleProduct(){

    }
   
    @UseInterceptors(FileInterceptor('file'))
    @Post("/add")
    async addProduct( @Auth() auth: any,
    @Body() data: any,
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,){
           console.log(data);
           console.log(file);
    }


    @Patch("edit/:id")
    async editproduct(){

    }
    @Delete("delete/:id")
    async deleteProduct(){
        
    }
       
}