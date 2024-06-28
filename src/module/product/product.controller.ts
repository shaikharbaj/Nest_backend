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
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Auth } from '../user/dto/authdto';
import { FileValidationPipe } from 'src/exceptions/filetypeandsize';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { Response } from 'express';
import { JwtGuard } from '../user/guards/jwt.guards';
import { RolesGuard } from '../auth/guards/roles.guard';
import { HasPermission } from '../auth/decorator/has-permission.decorator';
import { productModulePermission } from 'src/constants/permissions';

@Controller('product')
export class ProductController {
  constructor(private readonly productservice: ProductService) {}

  @Post('/get-product-variant-detail')
  async get_product_varient(@Body() data: any, @Res() res: Response) {
    return await this.productservice.get_product_varient_details(data, res);
  }
  @UseGuards(JwtGuard)
  @Get('/supplier/all')
  async getAllProductsforSupplier(
    @Auth() auth: any,
    @Query() payload: any,
    @Res() res: Response,
  ) {
    const { page, searchTerm }: { page: number; searchTerm: string } = payload;
    return await this.productservice.getAllProductsforSupplier(
      auth,
      page,
      searchTerm,
      res,
    );
  }
  @Get('/all')
  async getallproducts(@Query() payload: any, @Res() res: Response) {
    const { page, searchTerm }: { page: number; searchTerm: string } = payload;
    return await this.productservice.getallproducts(
      Number(page),
      searchTerm,
      res,
    );
  }
  @Get('/allproduct')
  async getallproductswithvarient(@Query() payload: any, @Res() res: Response) {
    const { page, searchTerm }: { page: number; searchTerm: string } = payload;
    return await this.productservice.getallproductswithvarient(
      Number(page),
      searchTerm,
      res,
    );
  }
  @Get('/getproductbyID/:id')
  async getSingleProduct(@Param('id') id: number, @Res() res: Response) {
    return await this.productservice.getsingleproduct(id, res);
  }
  @Get('/getsingleproduct/:name')
  async getsingleproduct(@Param('name') name: string, @Res() res: Response) {
    return await this.productservice.loadsingleproduct(name, res);
  }

  @Get('/productdetails/:slug')
  async getproductDetails(@Param('slug') slug: any,@Res() res:Response) {
    return await this.productservice.getproductDetails(slug,res);
  }

  // @Post('/add-product-varient-image')
  // async addproductvarient_images(
  //   @UploadedFiles() files: Array<Express.Multer.File>,
  //   @Body() data: any,
  //   @Res() res: Response,
  // ) {
  //   return await this.productservice.addproductvarientImage(data, files, res);
  // }

  @HasPermission(productModulePermission.ADD)
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images' }, { name: 'variants' }]),
  )
  @Post('/add')
  async addProduct(
    @Auth() auth: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() data: any,
    @Res() res: Response,
  ) {
    console.log(files);
    // console.log(data?.variants);
    return await this.productservice.addproduct(
      auth,
      data,
      files['images'],
      res,
    );
  }

  @HasPermission(productModulePermission.UPDATE)
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor('images'))
  @Patch('edit/:id')
  async editproduct(
    @Param('id') id: number,
    @Body() data: any,
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return await this.productservice.updateProduct(id, data, files, res);
  }

  @HasPermission(productModulePermission.DELETE)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete('delete/:id')
  async deleteProduct(@Param('id') id: number, @Res() res: Response) {
    return await this.productservice.deleteproduct(id, res);
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'main' },
      { name: 'file1' },
      { name: 'file2' },
      { name: 'file3' },
      { name: 'file4' },
      { name: 'file5' },
    ]),
  )
  @Post('/add-product-varient-image')
  async addproductvarientImage(
    @Body() data: any,
    @UploadedFiles() files: any,
    @Res() res: Response,
  ) {
    return await this.productservice.addproductvarientImage(data, files, res);
  }

  @Post('/add-varient')
  async add_varient(@Body() data: any, @Res() res: Response) {
    return await this.productservice.addproductvarient(data, res);
  }
}
