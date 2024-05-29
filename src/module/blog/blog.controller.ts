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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { query, Response } from 'express';
import { JwtGuard } from '../user/guards/jwt.guards';
import { Auth } from '../user/dto/authdto';
import { BlogService } from './blog.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/exceptions/filetypeandsize';
import { HasPermission } from '../auth/decorator/has-permission.decorator';
import { blogModulePermissions } from 'src/constants/permissions';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('/remove_image')
  async removeImage() {
    return await this.blogService.removeImage();
  }
  @Get('/filter')
  async getfilteredData(@Query() paylaod: any, @Res() res: Response) {
    return await this.blogService.getfilteredData(paylaod, res);
  }
  @UseGuards(JwtGuard)
  @Get('/all')
  async getAllBlogs(@Res() res: Response) {
    return await this.blogService.getAllBlog(res);
  }

  @Get(':id')
  async getBlogById(@Param('id') id: number, @Res() res: Response) {
    return await this.blogService.getblogById(id, res);
  }

  @HasPermission(blogModulePermissions.ADD)
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('/add')
  async addBlog(
    @Auth() auth: any,
    @Body() data: any,
    @Res() res: Response,
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
  ) {
    return await this.blogService.addblog(auth, data, file, res);
  }

  @HasPermission(blogModulePermissions.UPDATE)
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Patch('/edit/:id')
  async editBlog(
    @Param('id') id: number,
    @Body() data: any,
    @Res() res: Response,
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
  ) {
    return await this.blogService.updateblog(id, data, file, res);
  }

  @HasPermission(blogModulePermissions.DELETE)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  async deleteBlog(@Param('id') id: number, @Res() res: Response) {
    return await this.blogService.deleteBlog(id, res);
  }

  // @Get("/get")
  // async getdata(){
  //       return await this.p
  // }
}
