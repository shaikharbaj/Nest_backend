import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from '../user/dto/authdto';
import { FileValidationPipe } from 'src/exceptions/filetypeandsize';
import { ProductService } from './product.service';
import { Response } from 'express';
import { JwtGuard } from '../user/guards/jwt.guards';
import { RolesGuard } from '../auth/guards/roles.guard';
import { HasPermission } from '../auth/decorator/has-permission.decorator';
import { productModulePermission } from 'src/constants/permissions';

@Controller('product')
export class ProductController {
  constructor(private readonly productservice: ProductService) {}

  @UseGuards(JwtGuard)
  @Get('/supplier/all')
  async getAllProductsforSupplier(@Auth() auth: any, @Res() res: Response) {
    return await this.productservice.getAllProductsforSupplier(auth, res);
  }
  @Get('all')
  async getallproducts(@Res() res: Response) {
    return await this.productservice.getallproducts(res);
  }
  @Get(':id')
  async getSingleProduct(@Param('id') id: number, @Res() res: Response) {
    return await this.productservice.getsingleproduct(id, res);
  }
  @Get('/getsingleproduct/:name')
  async getsingleproduct(@Param('name') name: string, @Res() res: Response) {
    return await this.productservice.loadsingleproduct(name, res);
  }

  @HasPermission(productModulePermission.ADD)
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('/add')
  async addProduct(
    @Auth() auth: any,
    @Body() data: any,
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
    @Res() res: Response,
  ) {
    // console.log(auth)
    return await this.productservice.addproduct(auth, data, file, res);
  }

  @HasPermission(productModulePermission.UPDATE)
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('edit/:id')
  async editproduct() {}

  @HasPermission(productModulePermission.DELETE)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete('delete/:id')
  async deleteProduct(@Param('id') id: number, @Res() res: Response) {
    return await this.productservice.deleteproduct(id, res);
  }
}
