import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Auth } from "../user/dto/authdto";
import { FileValidationPipe } from "src/exceptions/filetypeandsize";
import { ProductService } from "./product.service";
import { Response } from "express";
import { JwtGuard } from "../user/guards/jwt.guards";

@Controller("product")
export class ProductController {

    constructor(private readonly productservice: ProductService) { }

    @UseGuards(JwtGuard)
    @Get("/supplier/all")
    async getAllProductsforSupplier(@Auth() auth:any,@Res() res: Response) {
        return await this.productservice.getAllProductsforSupplier(auth,res);
    }
    @Get("all")
    async getallproducts(@Res() res:Response){
         return await this.productservice.getallproducts(res);
    }
    @Get(":id")
    async getSingleProduct(@Param("id") id: number, @Res() res: Response) {
        return await this.productservice.getsingleproduct(id, res)
    }
    @Get("/getsingleproduct/:name")
    async getsingleproduct(@Param("name") name: string, @Res() res: Response) {
        return await this.productservice.loadsingleproduct(name, res)
    }

    @UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor('image'))
    @Post("/add")
    async addProduct(@Auth() auth: any,
        @Body() data: any,
        @UploadedFile(FileValidationPipe) file: Express.Multer.File, @Res() res: Response) {
        // console.log(auth)
        return await this.productservice.addproduct(auth, data, file, res);
    }


    @Patch("edit/:id")
    async editproduct() {
    }
    @Delete("delete/:id")
    async deleteProduct(@Param("id") id: number, @Res() res: Response) {
        return await this.productservice.deleteproduct(id, res)
    }
}