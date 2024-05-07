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
import { Response } from 'express';
import { JwtGuard } from '../user/guards/jwt.guards';
import { Auth } from '../user/dto/authdto';
import { BlogService } from './blog.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/exceptions/filetypeandsize';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('/remove_image')
  async removeImage() {
    return await this.blogService.removeImage();
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

  @UseGuards(JwtGuard)
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

  @UseGuards(JwtGuard)
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

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteBlog(@Param('id') id: number, @Res() res: Response) {
    return await this.blogService.deleteBlog(id, res);
  }

  // @Get("/get")
  // async getdata(){
  //       return await this.p
  // }
}
